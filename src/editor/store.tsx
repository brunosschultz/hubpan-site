import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { isSupabaseConfigured, supabase } from './supabaseClient';

/* ═══════════════════════════════════════════════════════════════════
   Núcleo do editor visual — estado de conteúdo, histórico e sessão.

   Modelo de dados: cada campo editável tem um valor de RASCUNHO (o que o
   editor mostra e edita) e um valor PUBLICADO (o que o site público
   mostra). Só mudam quando alguém clica em "Publicar". A rota atual
   decide qual canal ler:
     - "/"  e demais páginas públicas → published
     - "/editar" e "/preview"          → draft

   Fonte de verdade: Supabase (Postgres + Auth + Storage), configurado via
   VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY. Sem essas variáveis, cai
   automaticamente no modo local antigo (localStorage, qualquer senha
   entra) — não deve acontecer em produção, só numa checkout local antes
   do setup (ver SETUP-EDITOR.md).
   ═══════════════════════════════════════════════════════════════════ */

export type FieldKind = 'text' | 'color' | 'image' | 'link';
export type Channel = 'draft' | 'published';

/* ---------- Imagem por dispositivo ---------- */

/** As mesmas 3 faixas que o Tailwind já usa no site (`md`/`lg`) — qualquer
 * imagem com variante mobile/tablet troca exatamente nesses pontos, tanto
 * no site publicado (`<picture>`, CSS puro) quanto no editor (JS/matchMedia,
 * só onde não dá pra usar `<picture>` — ex.: imagem de fundo). Mudar aqui
 * exige mudar os dois lugares que leem esses valores (ver fields.tsx). */
export const DEVICE_BREAKPOINTS = { mobileMax: 767, tabletMax: 1023 } as const;
export type DeviceCategory = 'mobile' | 'tablet' | 'desktop';

export function deviceCategoryForWidth(width: number): DeviceCategory {
  if (width <= DEVICE_BREAKPOINTS.mobileMax) return 'mobile';
  if (width <= DEVICE_BREAKPOINTS.tabletMax) return 'tablet';
  return 'desktop';
}

/** Categoria de dispositivo da largura REAL da janela (não simulada, não
 * `editingDevice`) — mora aqui (não em `fields.tsx`) porque o próprio `get`
 * do `EditorProvider` precisa dela internamente (ver nota grande em `get`,
 * abaixo). Usada também onde não dá pra resolver a imagem certa via CSS
 * puro (fundo via `useEditImage`) e pelo painel do editor. */
export function useDeviceBreakpoint(): DeviceCategory {
  const [device, setDevice] = useState<DeviceCategory>(() =>
    deviceCategoryForWidth(typeof window !== 'undefined' ? window.innerWidth : 1440)
  );
  useEffect(() => {
    const mqMobile = window.matchMedia(`(max-width: ${DEVICE_BREAKPOINTS.mobileMax}px)`);
    const mqTablet = window.matchMedia(`(min-width: ${DEVICE_BREAKPOINTS.mobileMax + 1}px) and (max-width: ${DEVICE_BREAKPOINTS.tabletMax}px)`);
    const update = () => setDevice(mqMobile.matches ? 'mobile' : mqTablet.matches ? 'tablet' : 'desktop');
    update();
    mqMobile.addEventListener('change', update);
    mqTablet.addEventListener('change', update);
    return () => {
      mqMobile.removeEventListener('change', update);
      mqTablet.removeEventListener('change', update);
    };
  }, []);
  return device;
}

/** Presets de largura pro seletor "visualizar em" do editor — larguras
 * reais (não nomes de aparelho: o site é responsivo por FAIXA de largura,
 * um iPhone 14 e um iPhone 17 caem na mesma faixa "mobile" pro CSS, não
 * faz sentido ter preset por modelo — ver decisão registrada no CLAUDE.md).
 * `category` vem FIXA em cada preset (não recalculada de `width` via
 * `deviceCategoryForWidth`) — bug real encontrado pelo Bruno: "Tablet —
 * paisagem" tem 1024px de largura, e `tabletMax` é 1023, então a conta caía
 * em 'desktop' por 1px, fazendo aquele preset editar Desktop de verdade
 * (nada isolado). Category explícita elimina esse tipo de erro de limite. */
export interface DevicePreset { id: string; label: string; width: number; height: number; category: DeviceCategory }
export const DEVICE_PRESETS: DevicePreset[] = [
  { id: 'mobile-sm', label: 'Mobile — pequeno', width: 375, height: 812, category: 'mobile' },
  { id: 'mobile-lg', label: 'Mobile — grande', width: 430, height: 932, category: 'mobile' },
  { id: 'tablet-sm', label: 'Tablet — retrato', width: 768, height: 1024, category: 'tablet' },
  { id: 'tablet-lg', label: 'Tablet — paisagem', width: 1024, height: 768, category: 'tablet' },
  { id: 'desktop-sm', label: 'Desktop', width: 1440, height: 900, category: 'desktop' },
  { id: 'desktop-lg', label: 'Desktop — tela grande', width: 1920, height: 1080, category: 'desktop' },
];

export interface ImageSpec {
  w: number;
  h: number;
  shape: 'paisagem' | 'retrato' | 'quadrada';
  /** cover = corta pra preencher (fotos) · contain = cabe inteira com fundo transparente (logos) */
  fit?: 'cover' | 'contain';
  note?: string;
}

/** Deriva o spec certo pro fundo cheio-tela (`background-size:cover`) de um
 * Hero, a partir do spec pensado pro Desktop (paisagem) — pro Mobile/Tablet,
 * troca largura↔altura (mesma proporção, agora de pé). Sem isso, o upload
 * feito em Mobile era recortado (`processImage`) na moldura HORIZONTAL do
 * Desktop antes mesmo de chegar na tela — uma foto vertical ficava
 * violentamente ampliada e cortada pra caber numa caixa larga e baixa (bug
 * real reportado pelo Bruno: "a imagem ficou bem grande" no Hero mobile).
 * `background-size:cover` já preenche 100%×100% de QUALQUER contêiner
 * sozinho — o problema nunca foi a exibição, era o CROP salvo no upload. */
export function heroBgSpecForDevice(desktopSpec: ImageSpec, device: DeviceCategory): ImageSpec {
  if (device === 'desktop') return desktopSpec;
  const deviceLabel = device === 'mobile' ? 'Mobile' : 'Tablet';
  return {
    ...desktopSpec, w: desktopSpec.h, h: desktopSpec.w, shape: 'retrato',
    note: `Tela cheia — versão ${deviceLabel} (vertical, 100% da largura e altura).`,
  };
}

export interface HistoryEntry {
  id: string;
  ts: number;
  userName: string;
  userEmail: string;
  key: string;
  label: string;
  kind: FieldKind;
  /** null = valor padrão do design (sem override) */
  oldValue: string | null;
  newValue: string | null;
  restaurado?: boolean;
  /** 'publish' = linha do histórico representando um clique em "Publicar" */
  event?: 'edit' | 'publish';
}

export interface EditorUser {
  name: string;
  email: string;
}

export type PanelState =
  | { type: 'history' }
  | { type: 'image'; key: string; label: string; fallback: string; spec: ImageSpec }
  | { type: 'colors'; title: string; fields: { key: string; label: string; fallback: string }[] }
  | { type: 'icon'; key: string; label: string; defaultSize: number }
  | { type: 'buttonStyle'; key: string; label: string; colorFallback: string; circleFallback: string; linkEditable?: boolean };

interface EditorCtx {
  overrides: Record<string, string>;
  history: HistoryEntry[];
  user: EditorUser | null;
  editMode: boolean;
  panel: PanelState | null;
  /** Preset ativo do "visualizar em" da barra do editor — null = edição
   * normal (o padrão). Ver `DEVICE_PRESETS`. */
  previewDevice: DevicePreset | null;
  setPreviewDevice: (d: DevicePreset | null) => void;
  /** Dispositivo "ambiente" desta sessão do editor — vem da URL (`?device=`),
   * nunca de um botão. A sessão normal (`/editar/<slug>`) é sempre 'desktop';
   * só a sessão aberta dentro do iframe de "Visualizar em" carrega
   * `?device=mobile|tablet` e passa a editar nessa gaveta. Ver `get`/`setValue`. */
  editingDevice: DeviceCategory;
  /** Aplica o sufixo de dispositivo numa chave (`titulo` → `titulo.mobile`),
   * pros painéis conferirem override (`scopedKey(k) in overrides`) sem
   * duplicar a regra de sufixo — a regra de verdade vive em `get`/`setValue`. */
  scopedKey: (key: string) => string;
  channel: Channel;
  connected: boolean;
  publishing: boolean;
  hasUnpublished: boolean;
  /** Quantidade de campos com rascunho diferente do publicado — aproximado
   * (não sabe "de qual página" cada campo é), usado só como número geral. */
  pendingCount: number;
  /** Mensagem se a última tentativa de salvar no servidor falhou (ex.: permissão
   * do banco faltando) — a edição fica só localmente até isso ser resolvido. */
  syncError: string | null;
  get: (key: string, fallback: string) => string;
  setValue: (key: string, value: string | null, meta: { label: string; kind: FieldKind; restaurado?: boolean }) => void;
  /** Devolve null em caso de sucesso, ou a mensagem de erro (já traduzida) em caso de falha. */
  login: (name: string, email: string, password: string) => Promise<string | null>;
  logout: () => void;
  setEditMode: (on: boolean) => void;
  openPanel: (p: PanelState) => void;
  closePanel: () => void;
  publish: () => Promise<void>;
  /** Faz upload de uma dataURL pro Storage e devolve a URL final. Sem Supabase
   * configurado, devolve a própria dataURL (comportamento do modo local). */
  uploadImage: (dataUrl: string, keyHint: string) => Promise<string>;
}

/* ---------- Adaptador local (fallback sem Supabase) ---------- */

const LS_CONTENT = 'hubpan-editor-content';
const LS_HISTORY = 'hubpan-editor-history';
const LS_USER = 'hubpan-editor-user';
const HISTORY_CAP = 200;

function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function persistJSON(key: string, value: unknown): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

/** Mensagens de erro do Supabase Auth traduzidas pro que o usuário do editor entende. */
function traduzErroAuth(msg: string): string {
  if (/invalid login credentials/i.test(msg)) return 'E-mail ou senha incorretos.';
  if (/email not confirmed/i.test(msg)) return 'Este e-mail ainda não foi confirmado.';
  return msg;
}

/** Dispara um novo build/deploy na Vercel após publicar — sem isso, o HTML
 * estático (pré-renderizado pra SEO) só atualizaria no próximo push de código.
 * Opcional: sem a env var configurada, publicar continua funcionando normal
 * (só o conteúdo ao vivo muda; o HTML estático some atualiza no próximo deploy
 * manual). Configurar em Vercel → Settings → Git → Deploy Hooks.
 * Chamada "fire-and-forget": nunca deve travar nem falhar o fluxo de publicar. */
function triggerRebuild() {
  const hookUrl = import.meta.env.VITE_VERCEL_DEPLOY_HOOK as string | undefined;
  if (!hookUrl) return;
  fetch(hookUrl, { method: 'POST' }).catch((e) => console.warn('[editor] falha ao disparar rebuild:', e));
}

/* ---------- Provider ---------- */

const Ctx = createContext<EditorCtx | null>(null);

export function EditorProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const channel: Channel = (
    location.pathname.startsWith('/editar') ||
    location.pathname.startsWith('/preview') ||
    location.pathname.startsWith('/admin')
  ) ? 'draft' : 'published';

  const connected = isSupabaseConfigured;

  /* linhas cruas do banco: cada chave guarda os dois valores (rascunho e
     publicado) — assim navegar entre canais não exige novo fetch */
  const [rows, setRows] = useState<Record<string, { draft: string | null; published: string | null }>>({});
  const [history, setHistory] = useState<HistoryEntry[]>(() => (connected ? [] : loadJSON(LS_HISTORY, [])));
  const [user, setUser] = useState<EditorUser | null>(() => loadJSON(LS_USER, null));
  const [editMode, setEditModeState] = useState(false);
  const [panel, setPanel] = useState<PanelState | null>(null);
  const [previewDevice, setPreviewDevice] = useState<DevicePreset | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  /* dispositivo desta sessão de EDIÇÃO — só a URL decide (ver
   * `EditorCtx.editingDevice`), usado só pra decidir ONDE GRAVAR
   * (`setValue`/`scopedKey`). NUNCA usar isso pra decidir o que MOSTRAR —
   * ver a nota grande em `get`, logo abaixo, sobre o bug real que isso
   * causou (edição em Mobile funcionava só dentro do editor; publicado, o
   * visitante real via a versão Desktop sempre, porque a URL dele nunca
   * tem `?device=`). */
  const editingDevice: DeviceCategory = useMemo(() => {
    const p = new URLSearchParams(location.search).get('device');
    return p === 'mobile' || p === 'tablet' ? p : 'desktop';
  }, [location.search]);
  const dSuffix = editingDevice === 'desktop' ? '' : `.${editingDevice}`;
  const scopedKey = useCallback((key: string) => (dSuffix ? `${key}${dSuffix}` : key), [dSuffix]);

  /* dispositivo de EXIBIÇÃO — largura REAL da janela (`useDeviceBreakpoint`,
   * matchMedia), usado por `get` pra decidir O QUE MOSTRAR. Dentro do
   * editor os dois sempre coincidem (a sessão de Mobile roda de fato num
   * iframe de 375px) — fora dele (site publicado), `editingDevice` é
   * sempre 'desktop' (a URL de um visitante real nunca tem `?device=`),
   * então só este aqui reflete a tela de quem está vendo de verdade. */
  const displayDevice = useDeviceBreakpoint();
  const readSuffix = displayDevice === 'desktop' ? '' : `.${displayDevice}`;

  const rowsRef = useRef(rows);
  useEffect(() => { rowsRef.current = rows; }, [rows]);

  /* Flag no <body> pro CSS do modo edição (outlines, bloqueio de links) */
  useEffect(() => {
    if (editMode) document.body.dataset.editMode = '1';
    else delete document.body.dataset.editMode;
    return () => { delete document.body.dataset.editMode; };
  }, [editMode]);

  /* ---------- Carga inicial + tempo real (Supabase) ---------- */

  useEffect(() => {
    if (!connected || !supabase) return;
    const sb = supabase; // captura local — evita perder o narrowing de null dentro dos closures abaixo

    let mounted = true;

    sb.from('content_overrides').select('key,draft_value,published_value').then(({ data }) => {
      if (!mounted || !data) return;
      const map: typeof rows = {};
      for (const r of data) map[r.key] = { draft: r.draft_value, published: r.published_value };
      setRows(map);
    });

    sb.from('edit_history').select('*').order('ts', { ascending: false }).limit(HISTORY_CAP).then(({ data }) => {
      if (!mounted || !data) return;
      setHistory(data.map((h) => ({
        id: h.id, ts: new Date(h.ts).getTime(), userName: h.user_name, userEmail: h.user_email,
        key: h.key, label: h.label, kind: h.kind, oldValue: h.old_value, newValue: h.new_value,
        restaurado: h.restaurado, event: h.event,
      })));
    });

    const channelSub = sb
      .channel('content_overrides_live')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'content_overrides' }, (payload) => {
        const row = payload.new as { key: string; draft_value: string | null; published_value: string | null } | undefined;
        if (!row?.key) return;
        setRows((prev) => ({ ...prev, [row.key]: { draft: row.draft_value, published: row.published_value } }));
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'edit_history' }, (payload) => {
        const h = payload.new as { id: string; ts: string; user_name: string; user_email: string; key: string; label: string; kind: FieldKind; old_value: string | null; new_value: string | null; restaurado: boolean; event: 'edit' | 'publish' };
        setHistory((prev) => (prev.some((e) => e.id === h.id) ? prev : [{
          id: h.id, ts: new Date(h.ts).getTime(), userName: h.user_name, userEmail: h.user_email,
          key: h.key, label: h.label, kind: h.kind, oldValue: h.old_value, newValue: h.new_value,
          restaurado: h.restaurado, event: h.event,
        }, ...prev].slice(0, HISTORY_CAP)));
      })
      .subscribe();

    return () => { mounted = false; void sb.removeChannel(channelSub); };
  }, [connected]);

  /** Leitura crua de UMA chave literal — sem sufixo de dispositivo. */
  const readRaw = useCallback((key: string): string | null | undefined => {
    if (!connected) return rows[key]?.draft;
    const r = rows[key];
    return channel === 'draft' ? r?.draft : r?.published;
  }, [connected, rows, channel]);

  /** Toda leitura passa pela "gaveta" do dispositivo de EXIBIÇÃO primeiro
   * (`${key}.mobile`) — sem valor lá, cai pra chave base (Desktop), que é
   * sempre o valor "herdado" até alguém definir um específico.
   *
   * Usa `readSuffix` (largura REAL da janela), NÃO `dSuffix`
   * (`editingDevice`, vindo da URL) — bug real reportado pelo Bruno: com
   * `dSuffix` aqui, a edição em Mobile aparecia certa DENTRO do editor
   * (onde a URL tem `?device=mobile`) mas sumia no site publicado — um
   * visitante real nunca tem esse `?device=` na URL, então a leitura caía
   * sempre em `editingDevice: 'desktop'` e ignorava tudo que foi salvo pra
   * Mobile/Tablet. `readSuffix` resolve pela tela de verdade de quem está
   * vendo, dentro ou fora do editor (dentro do editor os dois SEMPRE
   * coincidem, já que a sessão de Mobile roda de fato num iframe de
   * 375px — corrigir aqui não muda nada do jeito que editar já funciona,
   * só conserta o que estava quebrado no site publicado). */
  const get = useCallback((key: string, fallback: string) => {
    if (readSuffix) {
      const scoped = readRaw(`${key}${readSuffix}`);
      if (scoped != null) return scoped;
    }
    return readRaw(key) ?? fallback;
  }, [readRaw, readSuffix]);

  const setValue = useCallback<EditorCtx['setValue']>((key, value, meta) => {
    if (channel !== 'draft') return; // edição só faz sentido em /editar (ou /preview, mas lá não há UI de edição)
    const finalKey = scopedKey(key);
    const oldValue = rowsRef.current[finalKey]?.draft ?? null;
    if (oldValue === value) return;

    const nextRows = { ...rowsRef.current, [finalKey]: { draft: value, published: rowsRef.current[finalKey]?.published ?? null } };
    rowsRef.current = nextRows;
    setRows(nextRows);

    const deviceLabel = editingDevice === 'mobile' ? ' — Mobile' : editingDevice === 'tablet' ? ' — Tablet' : '';
    const entry: HistoryEntry = {
      id: crypto.randomUUID(), ts: Date.now(),
      userName: user?.name ?? 'Desconhecido', userEmail: user?.email ?? '',
      key: finalKey, label: `${meta.label}${deviceLabel}`, kind: meta.kind, oldValue, newValue: value, restaurado: meta.restaurado, event: 'edit',
    };
    setHistory((h) => [entry, ...h].slice(0, HISTORY_CAP));

    if (connected && supabase) {
      // Gravação assíncrona — precisa checar o erro explicitamente, senão uma
      // falha (ex.: permissão do banco faltando) fica invisível: a edição some
      // ao recarregar mesmo o editor tendo mostrado "Salvo" (já aconteceu em
      // produção — ver nota de GRANT em supabase/schema.sql).
      void supabase.from('content_overrides')
        .upsert({ key: finalKey, draft_value: value, updated_at: new Date().toISOString(), updated_by: user?.email ?? null }, { onConflict: 'key' })
        .then(({ error }) => {
          if (error) { console.error('[editor] falha ao salvar conteúdo:', error); setSyncError(error.message); }
          else setSyncError(null);
        });
      void supabase.from('edit_history').insert({
        id: entry.id, ts: new Date(entry.ts).toISOString(), user_name: entry.userName, user_email: entry.userEmail,
        key: entry.key, label: entry.label, kind: entry.kind, old_value: entry.oldValue, new_value: entry.newValue,
        restaurado: entry.restaurado ?? false, event: 'edit',
      }).then(({ error }) => {
        if (error) console.error('[editor] falha ao salvar histórico:', error);
      });
    } else {
      const ok = persistJSON(LS_CONTENT, (() => { const f: Record<string, string> = {}; for (const [k, v] of Object.entries(nextRows)) if (v.draft !== null) f[k] = v.draft; return f; })());
      persistJSON(LS_HISTORY, [entry, ...history].slice(0, HISTORY_CAP));
      if (!ok) alert('Não foi possível salvar: o armazenamento local deste navegador está cheio.');
    }
  }, [channel, connected, user, history]);

  const login = useCallback(async (name: string, email: string, password: string): Promise<string | null> => {
    if (!connected || !supabase) {
      const u = { name, email };
      setUser(u);
      persistJSON(LS_USER, u);
      return null;
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return traduzErroAuth(error.message);
    const u = { name, email };
    setUser(u);
    persistJSON(LS_USER, u);
    return null;
  }, [connected]);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(LS_USER);
    if (supabase) void supabase.auth.signOut();
    setPanel(null);
    setEditModeState(false);
  }, []);

  const setEditMode = useCallback((on: boolean) => {
    setEditModeState(on);
    if (!on) setPanel(null);
  }, []);

  const openPanel = useCallback((p: PanelState) => setPanel(p), []);
  const closePanel = useCallback(() => setPanel(null), []);

  const publish = useCallback(async () => {
    if (!user) return;
    if (!connected || !supabase) { alert('Publicar requer o Supabase conectado — no modo local as edições já são o que aparece.'); return; }
    setPublishing(true);
    try {
      const { error } = await supabase.rpc('publish_all');
      if (error) throw error;
      const entry: HistoryEntry = {
        id: crypto.randomUUID(), ts: Date.now(), userName: user.name, userEmail: user.email,
        key: '*', label: 'Site publicado', kind: 'text', oldValue: null, newValue: null, event: 'publish',
      };
      await supabase.from('edit_history').insert({
        id: entry.id, ts: new Date(entry.ts).toISOString(), user_name: entry.userName, user_email: entry.userEmail,
        key: entry.key, label: entry.label, kind: entry.kind, old_value: null, new_value: null, restaurado: false, event: 'publish',
      });
      setHistory((h) => [entry, ...h].slice(0, HISTORY_CAP));
      setRows((prev) => {
        const next: typeof prev = {};
        for (const [k, v] of Object.entries(prev)) next[k] = { ...v, published: v.draft };
        return next;
      });
      triggerRebuild();
    } catch (e) {
      alert('Não foi possível publicar. Tente novamente em instantes.');
      console.error(e);
    } finally {
      setPublishing(false);
    }
  }, [connected, user]);

  const uploadImage = useCallback(async (dataUrl: string, keyHint: string): Promise<string> => {
    if (!connected || !supabase) return dataUrl;
    try {
      const blob = await (await fetch(dataUrl)).blob();
      const ext = blob.type === 'image/svg+xml' ? 'svg' : 'webp';
      const path = `${keyHint.replace(/[^a-z0-9.]/gi, '_')}-${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from('editor-images').upload(path, blob, { contentType: blob.type, upsert: true });
      if (error) throw error;
      const { data } = supabase.storage.from('editor-images').getPublicUrl(path);
      return data.publicUrl;
    } catch (e) {
      console.error(e);
      alert('Não foi possível enviar a imagem pro servidor. Ela foi aplicada só localmente por enquanto.');
      return dataUrl;
    }
  }, [connected]);

  const flatOverrides = useMemo(() => {
    const f: Record<string, string> = {};
    for (const [k, v] of Object.entries(rows)) {
      const val = connected ? (channel === 'draft' ? v.draft : v.published) : v.draft;
      if (val !== null && val !== undefined) f[k] = val;
    }
    return f;
  }, [rows, connected, channel]);

  const hasUnpublished = useMemo(
    () => Object.values(rows).some((v) => v.draft !== v.published),
    [rows]
  );

  const pendingCount = useMemo(
    () => Object.values(rows).filter((v) => v.draft !== v.published).length,
    [rows]
  );

  const value = useMemo<EditorCtx>(() => ({
    overrides: flatOverrides, history, user, editMode, panel, previewDevice, setPreviewDevice, editingDevice, scopedKey, channel, connected, publishing, hasUnpublished, pendingCount, syncError,
    get, setValue, login, logout, setEditMode, openPanel, closePanel, publish, uploadImage,
  }), [flatOverrides, history, user, editMode, panel, previewDevice, editingDevice, scopedKey, channel, connected, publishing, hasUnpublished, pendingCount, syncError,
      get, setValue, login, logout, setEditMode, openPanel, closePanel, publish, uploadImage]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useEditorStore(): EditorCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useEditorStore precisa estar dentro de <EditorProvider>');
  return ctx;
}

/* ---------- Utilidades compartilhadas ---------- */

/* Dentro do iframe de "Visualizar em" (mesma origem, sempre — é a mesma
 * aplicação), a UI flutuante do editor (barra de formatação, painel
 * lateral) precisa renderizar na janela DE CIMA, não presa aos poucos
 * pixels de largura do preset simulado — senão parte dos botões fica
 * fora da área visível e inacessível (bug real reportado pelo Bruno). */

/** Documento onde portar a UI flutuante — o da janela de cima quando
 * estamos dentro do iframe, senão o de sempre. */
export function editorPortalTarget(): HTMLElement {
  try {
    if (window.top && window.top !== window.self) return window.top.document.body;
  } catch { /* nunca deveria acontecer aqui (mesma origem sempre) */ }
  return document.body;
}

/** Retângulo do próprio `<iframe>` dentro da janela de cima — converte uma
 * coordenada medida DENTRO do iframe (`getBoundingClientRect` de um
 * elemento da página) pra coordenada da janela de cima, onde a barra é de
 * fato desenhada. `{x:0,y:0}` fora do iframe (não precisa converter nada). */
export function frameOffset(): { x: number; y: number } {
  try {
    const fe = window.frameElement as HTMLElement | null;
    if (fe) { const r = fe.getBoundingClientRect(); return { x: r.left, y: r.top }; }
  } catch { /* ok */ }
  return { x: 0, y: 0 };
}

/** Largura/altura disponíveis pra posicionar a UI flutuante — as da janela
 * de cima quando embutido no iframe, senão as da própria janela. */
export function editorViewport(): { w: number; h: number } {
  try {
    if (window.top && window.top !== window.self) return { w: window.top.innerWidth, h: window.top.innerHeight };
  } catch { /* ok */ }
  return { w: window.innerWidth, h: window.innerHeight };
}

/** Converte qualquer cor CSS (hex de 6 dígitos ou rgb/rgba) num par
 * {hex, opacity 0-100} — usado pra inicializar o painel de cor+opacidade
 * do círculo do botão a partir do valor atual (override salvo ou o padrão
 * do design, que muitas vezes já vem como `rgba(0,0,0,0.1)`). */
export function parseColorToHexOpacity(css: string): { hex: string; opacity: number } {
  const m = css.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+))?\)/i);
  if (m) {
    const [, r, g, b, a] = m;
    const hex = '#' + [r, g, b].map((n) => Math.max(0, Math.min(255, +n)).toString(16).padStart(2, '0')).join('');
    return { hex, opacity: a !== undefined ? Math.round(+a * 100) : 100 };
  }
  if (/^#[0-9a-f]{6}$/i.test(css)) return { hex: css, opacity: 100 };
  return { hex: '#000000', opacity: 100 };
}

/** hex (#rrggbb) + opacidade (0-100) → string `rgba()` pronta pro CSS. */
export function hexOpacityToRgba(hex: string, opacity: number): string {
  const m = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex);
  const r = m ? parseInt(m[1], 16) : 0;
  const g = m ? parseInt(m[2], 16) : 0;
  const b = m ? parseInt(m[3], 16) : 0;
  return `rgba(${r}, ${g}, ${b}, ${Math.max(0, Math.min(100, opacity)) / 100})`;
}

/** "há 5 min" / "há 3 h" / data completa — pt-BR, curto e legível */
export function formatWhen(ts: number): string {
  const diff = Date.now() - ts;
  if (diff < 60_000) return 'agora mesmo';
  if (diff < 3_600_000) return `há ${Math.floor(diff / 60_000)} min`;
  if (diff < 86_400_000) return `há ${Math.floor(diff / 3_600_000)} h`;
  const d = new Date(ts);
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }) +
    ' às ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

/** Redimensiona a imagem para cobrir exatamente o spec (crop central) e devolve WebP otimizado.
 * SVG passa direto, sem rasterizar — mantém qualidade em qualquer tamanho. */
export function processImage(file: File, spec: ImageSpec): Promise<string> {
  if (file.type === 'image/svg+xml') {
    return new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result as string);
      r.onerror = () => reject(new Error('svg inválido'));
      r.readAsDataURL(file);
    });
  }
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement('canvas');
      canvas.width = spec.w;
      canvas.height = spec.h;
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('canvas'));
      const fit = spec.fit ?? 'cover';
      const scale = fit === 'cover'
        ? Math.max(spec.w / img.width, spec.h / img.height)
        : Math.min(spec.w / img.width, spec.h / img.height);
      const dw = img.width * scale;
      const dh = img.height * scale;
      ctx.drawImage(img, (spec.w - dw) / 2, (spec.h - dh) / 2, dw, dh);
      resolve(canvas.toDataURL('image/webp', 0.88));
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('imagem inválida')); };
    img.src = url;
  });
}
