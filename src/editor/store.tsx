import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

/* ═══════════════════════════════════════════════════════════════════
   Núcleo do editor visual — estado de conteúdo, histórico e sessão.

   Os valores padrão de cada campo vivem no código das seções (fallback);
   aqui só guardamos as EDIÇÕES (overrides) + o histórico de quem mudou
   o quê e quando. Storage atual: localStorage ("modo local", edições
   valem só neste navegador). O adaptador foi isolado para que plugar o
   Supabase depois (login real + edições publicadas para todos) troque
   apenas as funções de load/persist — ver SETUP-EDITOR.md.
   ═══════════════════════════════════════════════════════════════════ */

export type FieldKind = 'text' | 'color' | 'image';

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
  get: (key: string, fallback: string) => string;
  setValue: (key: string, value: string | null, meta: { label: string; kind: FieldKind; restaurado?: boolean }) => void;
  login: (u: EditorUser) => void;
  logout: () => void;
  setEditMode: (on: boolean) => void;
  openPanel: (p: PanelState) => void;
  closePanel: () => void;
}

/* ---------- Adaptador de storage (modo local) ---------- */

const LS_CONTENT = 'hubpan-editor-content';
const LS_HISTORY = 'hubpan-editor-history';
const SS_USER = 'hubpan-editor-user';
const HISTORY_CAP = 80;

function loadJSON<T>(storage: Storage, key: string, fallback: T): T {
  try {
    const raw = storage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function persistJSON(storage: Storage, key: string, value: unknown): boolean {
  try {
    storage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

/* ---------- Provider ---------- */

const Ctx = createContext<EditorCtx | null>(null);

export function EditorProvider({ children }: { children: ReactNode }) {
  const [overrides, setOverrides] = useState<Record<string, string>>(() => loadJSON(localStorage, LS_CONTENT, {}));
  const [history, setHistory] = useState<HistoryEntry[]>(() => loadJSON(localStorage, LS_HISTORY, []));
  const [user, setUser] = useState<EditorUser | null>(() => loadJSON(sessionStorage, SS_USER, null));
  const [editMode, setEditModeState] = useState(false);
  const [panel, setPanel] = useState<PanelState | null>(null);

  /* Flag no <body> pro CSS do modo edição (outlines, bloqueio de links) */
  useEffect(() => {
    if (editMode) document.body.dataset.editMode = '1';
    else delete document.body.dataset.editMode;
    return () => { delete document.body.dataset.editMode; };
  }, [editMode]);

  const get = useCallback(
    (key: string, fallback: string) => overrides[key] ?? fallback,
    [overrides]
  );

  /* Espelho síncrono dos overrides — permite calcular o "valor antigo" fora do
     updater do React (updaters precisam ser puros; o StrictMode roda 2x em dev
     e efeitos colaterais lá dentro duplicariam entradas do histórico). */
  const overridesRef = useRef(overrides);
  useEffect(() => { overridesRef.current = overrides; }, [overrides]);

  /* Persistência fora dos updaters — roda 1x por mudança real de estado */
  const hydrated = useRef(false);
  useEffect(() => {
    if (!hydrated.current) { hydrated.current = true; return; }
    const ok = persistJSON(localStorage, LS_CONTENT, overrides);
    persistJSON(localStorage, LS_HISTORY, history);
    if (!ok) {
      alert('Não foi possível salvar: o armazenamento local deste navegador está cheio. No modo local há um limite de espaço (imagens ocupam bastante) — conectando o Supabase esse limite desaparece.');
    }
  }, [overrides, history]);

  const setValue = useCallback<EditorCtx['setValue']>((key, value, meta) => {
    const oldValue = overridesRef.current[key] ?? null;
    if (oldValue === value) return;

    const next = { ...overridesRef.current };
    if (value === null) delete next[key];
    else next[key] = value;
    overridesRef.current = next;

    const entry: HistoryEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      ts: Date.now(),
      userName: user?.name ?? 'Desconhecido',
      userEmail: user?.email ?? '',
      key,
      label: meta.label,
      kind: meta.kind,
      oldValue,
      newValue: value,
      restaurado: meta.restaurado,
    };

    setOverrides(next);
    setHistory((h) => (h[0]?.id === entry.id ? h : [entry, ...h].slice(0, HISTORY_CAP)));
  }, [user]);

  const login = useCallback((u: EditorUser) => {
    setUser(u);
    persistJSON(sessionStorage, SS_USER, u);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    sessionStorage.removeItem(SS_USER);
    setPanel(null);
    setEditModeState(false);
  }, []);

  const setEditMode = useCallback((on: boolean) => {
    setEditModeState(on);
    if (!on) setPanel(null);
  }, []);

  const openPanel = useCallback((p: PanelState) => setPanel(p), []);
  const closePanel = useCallback(() => setPanel(null), []);

  const value = useMemo<EditorCtx>(() => ({
    overrides, history, user, editMode, panel,
    get, setValue, login, logout, setEditMode, openPanel, closePanel,
  }), [overrides, history, user, editMode, panel, get, setValue, login, logout, setEditMode, openPanel, closePanel]);

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

/** Ajusta a imagem ao spec (cover corta pelo centro; contain preserva inteira com
 * transparência) e devolve WebP otimizado. SVG passa direto, sem rasterizar —
 * mantém qualidade em qualquer tamanho. */
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
