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

export type FieldKind = 'text' | 'color' | 'image';
export type Channel = 'draft' | 'published';

export interface ImageSpec {
  w: number;
  h: number;
  shape: 'paisagem' | 'retrato' | 'quadrada';
  /** cover = corta pra preencher (fotos) · contain = cabe inteira com fundo transparente (logos) */
  fit?: 'cover' | 'contain';
  note?: string;
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
  | { type: 'icon'; key: string; label: string; defaultSize: number };

interface EditorCtx {
  overrides: Record<string, string>;
  history: HistoryEntry[];
  user: EditorUser | null;
  editMode: boolean;
  panel: PanelState | null;
  channel: Channel;
  connected: boolean;
  publishing: boolean;
  hasUnpublished: boolean;
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
  const channel: Channel = (location.pathname.startsWith('/editar') || location.pathname.startsWith('/preview'))
    ? 'draft' : 'published';

  const connected = isSupabaseConfigured;

  /* linhas cruas do banco: cada chave guarda os dois valores (rascunho e
     publicado) — assim navegar entre canais não exige novo fetch */
  const [rows, setRows] = useState<Record<string, { draft: string | null; published: string | null }>>({});
  const [history, setHistory] = useState<HistoryEntry[]>(() => (connected ? [] : loadJSON(LS_HISTORY, [])));
  const [user, setUser] = useState<EditorUser | null>(() => loadJSON(LS_USER, null));
  const [editMode, setEditModeState] = useState(false);
  const [panel, setPanel] = useState<PanelState | null>(null);
  const [publishing, setPublishing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);

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

  const get = useCallback((key: string, fallback: string) => {
    if (!connected) return rows[key]?.draft ?? fallback; // modo local: um pool só
    const r = rows[key];
    const v = channel === 'draft' ? r?.draft : r?.published;
    return v ?? fallback;
  }, [connected, rows, channel]);

  const setValue = useCallback<EditorCtx['setValue']>((key, value, meta) => {
    if (channel !== 'draft') return; // edição só faz sentido em /editar (ou /preview, mas lá não há UI de edição)
    const oldValue = rowsRef.current[key]?.draft ?? null;
    if (oldValue === value) return;

    const nextRows = { ...rowsRef.current, [key]: { draft: value, published: rowsRef.current[key]?.published ?? null } };
    rowsRef.current = nextRows;
    setRows(nextRows);

    const entry: HistoryEntry = {
      id: crypto.randomUUID(), ts: Date.now(),
      userName: user?.name ?? 'Desconhecido', userEmail: user?.email ?? '',
      key, label: meta.label, kind: meta.kind, oldValue, newValue: value, restaurado: meta.restaurado, event: 'edit',
    };
    setHistory((h) => [entry, ...h].slice(0, HISTORY_CAP));

    if (connected && supabase) {
      // Gravação assíncrona — precisa checar o erro explicitamente, senão uma
      // falha (ex.: permissão do banco faltando) fica invisível: a edição some
      // ao recarregar mesmo o editor tendo mostrado "Salvo" (já aconteceu em
      // produção — ver nota de GRANT em supabase/schema.sql).
      void supabase.from('content_overrides')
        .upsert({ key, draft_value: value, updated_at: new Date().toISOString(), updated_by: user?.email ?? null }, { onConflict: 'key' })
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

  const value = useMemo<EditorCtx>(() => ({
    overrides: flatOverrides, history, user, editMode, panel, channel, connected, publishing, hasUnpublished, syncError,
    get, setValue, login, logout, setEditMode, openPanel, closePanel, publish, uploadImage,
  }), [flatOverrides, history, user, editMode, panel, channel, connected, publishing, hasUnpublished, syncError,
      get, setValue, login, logout, setEditMode, openPanel, closePanel, publish, uploadImage]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useEditorStore(): EditorCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useEditorStore precisa estar dentro de <EditorProvider>');
  return ctx;
}

/* ---------- Utilidades compartilhadas ---------- */

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
