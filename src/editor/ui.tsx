import { useEffect, useMemo, useRef, useState, type CSSProperties, type FormEvent } from 'react';
import { createPortal } from 'react-dom';
import { Check, CloudUpload, ExternalLink, History, Loader2, LogOut, RotateCcw, Ruler, Undo2, Upload, WifiOff, X } from 'lucide-react';
import { formatWhen, processImage, useEditorStore, type HistoryEntry, type PanelState } from './store';
import { parseIconValue } from './fields';
import { LUCIDE_CHOICES, LUCIDE_NAMES } from './editorIcons';
import { glass, initials, label11, PALETTE, text13 } from './theme';

/* ═══════════════════════════════════════════════════════════════════
   UI do editor — login, toolbar flutuante, painéis (cor / imagem /
   ícone / histórico) e o chip de cor que aparece no hover dos textos.
   Tudo via portal no <body>, fora do ScrollSmoother.
   ═══════════════════════════════════════════════════════════════════ */

/* ═══════════ Login ═══════════ */

export function LoginScreen() {
  const { login, connected } = useEditorStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setErr('');
    if (name.trim().length < 2) return setErr('Informe seu nome — ele aparece no histórico de edições.');
    if (!/^\S+@\S+\.\S+$/.test(email)) return setErr('Informe um e-mail válido.');
    if (pass.length < 4) return setErr('Senha muito curta.');
    setBusy(true);
    const erro = await login(name.trim(), email.trim().toLowerCase(), pass);
    setBusy(false);
    if (erro) setErr(erro);
  };

  const input: CSSProperties = {
    height: 48, borderRadius: 12, background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.1)', fontFamily: 'Inter', fontSize: 14.5,
    color: '#fff', padding: '0 16px', width: '100%', outline: 'none',
  };

  return (
    <section className="relative w-full min-h-screen bg-navy900 flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.035) 1px, transparent 1px)', backgroundSize: '48px 48px' }}
      />
      <form onSubmit={submit} className="relative w-full mx-6" style={{ maxWidth: 420 }}>
        <div className="rounded-[24px] p-9" style={glass}>
          <p style={{ fontFamily: 'Luxenta', fontWeight: 600, fontSize: 30, lineHeight: 1, color: '#fff' }}>
            HUB <span style={{ color: '#d2e718' }}>PAN</span>
          </p>
          <p className="mb-8 mt-2" style={{ fontFamily: 'Inter', fontSize: 14, color: '#8b90a3' }}>
            Editor de conteúdo — acesso restrito
          </p>
          <div className="space-y-3.5">
            <input placeholder="Nome completo" value={name} onChange={(e) => setName(e.target.value)} style={input} />
            <input placeholder="E-mail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={input} />
            <input placeholder="Senha" type="password" value={pass} onChange={(e) => setPass(e.target.value)} style={input} />
          </div>
          {err && <p className="mt-3" style={{ fontFamily: 'Inter', fontSize: 13, color: '#ff8a8a' }}>{err}</p>}
          <button
            type="submit"
            disabled={busy}
            className="w-full mt-6 hover:brightness-95 transition disabled:opacity-60"
            style={{ height: 50, borderRadius: 60, background: '#d2e718', fontFamily: 'Inter', fontWeight: 600, fontSize: 15, color: '#152852' }}
          >
            {busy ? 'Entrando…' : 'Entrar no editor'}
          </button>
          {connected ? (
            <div className="mt-6 flex items-center gap-2 justify-center">
              <span className="rounded-full" style={{ width: 7, height: 7, background: '#d2e718' }} />
              <p style={{ fontFamily: 'Inter', fontSize: 12, color: '#8b90a3' }}>Conectado ao Supabase — edições ficam salvas na nuvem</p>
            </div>
          ) : (
            <div className="mt-6 rounded-[12px] p-4" style={{ background: 'rgba(210,231,24,0.07)', border: '1px solid rgba(210,231,24,0.25)' }}>
              <p style={{ fontFamily: 'Inter', fontSize: 12.5, lineHeight: '19px', color: 'rgba(255,255,255,0.75)' }}>
                <b style={{ color: '#d2e718' }}>Modo local de demonstração</b> — qualquer senha entra e as edições
                ficam salvas só neste navegador. Ver SETUP-EDITOR.md pra conectar o Supabase.
              </p>
            </div>
          )}
        </div>
      </form>
    </section>
  );
}

/* ═══════════ Toolbar + painéis (portal) ═══════════ */

export function EditorChrome() {
  const { user, logout, panel, openPanel, closePanel, history, connected, publish, publishing, hasUnpublished, syncError } = useEditorStore();
  const [saved, setSaved] = useState(false);
  const prevLen = useRef(history.length);

  useEffect(() => {
    if (history.length > prevLen.current) {
      setSaved(true);
      const t = setTimeout(() => setSaved(false), 1800);
      prevLen.current = history.length;
      return () => clearTimeout(t);
    }
    prevLen.current = history.length;
  }, [history.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closePanel(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [closePanel]);

  if (!user) return null;

  const tbBtn: CSSProperties = {
    fontFamily: 'Inter', fontWeight: 500, fontSize: 13, color: '#fff',
    borderRadius: 999, padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 7,
  };

  return createPortal(
    <div data-editor-ui style={{ fontFamily: 'Inter' }}>
      <div className="fixed left-1/2 -translate-x-1/2 z-[1000] flex items-center gap-1 px-2.5 py-2 rounded-full" style={{ bottom: 22, ...glass }}>
        <span
          className="flex items-center gap-2 px-3.5"
          style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 13, color: syncError ? '#ff8a8a' : '#fff' }}
          title={syncError ? `Não foi possível salvar no servidor: ${syncError}` : connected ? 'Conectado ao Supabase' : 'Modo local — sem Supabase'}
        >
          {syncError ? (
            <WifiOff size={13} color="#ff8a8a" />
          ) : connected ? (
            <span className="rounded-full" style={{ width: 8, height: 8, background: saved ? '#d2e718' : '#00e4ff', transition: 'background .3s' }} />
          ) : (
            <WifiOff size={13} color="#ff8a8a" />
          )}
          {syncError ? 'Erro ao salvar — tente de novo' : saved ? <span className="flex items-center gap-1.5" style={{ color: '#d2e718' }}><Check size={14} strokeWidth={2.5} /> Salvo</span> : 'Modo edição'}
        </span>

        <span style={{ width: 1, height: 22, background: 'rgba(255,255,255,0.12)' }} />

        <a
          href="/preview" target="_blank" rel="noreferrer"
          className="hover:bg-white/10 transition-colors"
          style={tbBtn}
          title="Abrir a pré-visualização do rascunho em outra aba — o link que dá pra mandar pro cliente"
        >
          <ExternalLink size={15} /> Pré-visualizar
        </a>

        <button
          onClick={() => (panel?.type === 'history' ? closePanel() : openPanel({ type: 'history' }))}
          className="hover:bg-white/10 transition-colors"
          style={{ ...tbBtn, background: panel?.type === 'history' ? 'rgba(255,255,255,0.12)' : 'transparent' }}
        >
          <History size={15} /> Histórico
          {history.length > 0 && (
            <span className="rounded-full px-1.5" style={{ background: 'rgba(210,231,24,0.18)', color: '#d2e718', fontSize: 11, fontWeight: 600, minWidth: 18, textAlign: 'center' }}>
              {history.length}
            </span>
          )}
        </button>

        {connected && (
          <button
            onClick={publish}
            disabled={publishing || !hasUnpublished}
            title={hasUnpublished ? 'Publicar o rascunho para o site público' : 'Tudo já está publicado'}
            className="flex items-center gap-1.5 px-3.5 rounded-full hover:brightness-95 transition disabled:opacity-40 disabled:cursor-default"
            style={{ height: 34, background: '#d2e718', fontFamily: 'Inter', fontWeight: 600, fontSize: 13, color: '#152852' }}
          >
            {publishing ? <Loader2 size={14} className="animate-spin" /> : <CloudUpload size={14} />}
            {publishing ? 'Publicando…' : hasUnpublished ? 'Publicar' : 'Publicado'}
          </button>
        )}

        <span style={{ width: 1, height: 22, background: 'rgba(255,255,255,0.12)' }} />

        <span className="flex items-center gap-2.5 px-3">
          <span className="flex items-center justify-center rounded-full shrink-0" style={{ width: 28, height: 28, background: '#d2e718', fontFamily: 'Inter', fontWeight: 700, fontSize: 11, color: '#152852' }}>
            {initials(user.name)}
          </span>
          <span style={{ fontFamily: 'Inter', fontSize: 13, color: 'rgba(255,255,255,0.85)', maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {user.name}
          </span>
        </span>

        <button onClick={logout} className="hover:bg-white/10 transition-colors" style={{ ...tbBtn, color: '#8b90a3', padding: '8px 12px' }} title="Sair do editor">
          <LogOut size={15} />
        </button>
      </div>

      {panel && <Panel panel={panel} />}
    </div>,
    document.body
  );
}

/* ═══════════ Painel lateral ═══════════ */

function Panel({ panel }: { panel: PanelState }) {
  const { closePanel } = useEditorStore();
  const title =
    panel.type === 'history' ? 'Histórico de edições' :
    panel.type === 'image' ? panel.label :
    panel.type === 'icon' ? panel.label :
    panel.title;

  return (
    <div
      className="fixed z-[1000] flex flex-col rounded-[20px] overflow-hidden"
      style={{ top: 20, right: 20, width: 340, maxHeight: 'calc(100vh - 110px)', ...glass }}
    >
      <div className="flex items-center justify-between shrink-0 px-5" style={{ height: 54, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <p style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 13.5, color: '#fff' }}>{title}</p>
        <button onClick={closePanel} className="flex items-center justify-center rounded-full hover:bg-white/10 transition-colors" style={{ width: 30, height: 30, color: '#8b90a3' }}>
          <X size={16} />
        </button>
      </div>
      <div className="overflow-y-auto p-5" style={{ scrollbarWidth: 'thin' }}>
        {panel.type === 'colors' && <ColorsBody fields={panel.fields} />}
        {panel.type === 'image' && <ImageBody panel={panel} />}
        {panel.type === 'icon' && <IconBody panel={panel} />}
        {panel.type === 'history' && <HistoryBody />}
      </div>
    </div>
  );
}

/* ---------- Cores ---------- */

function ColorsBody({ fields }: { fields: { key: string; label: string; fallback: string }[] }) {
  const { get, setValue, overrides } = useEditorStore();

  return (
    <div className="space-y-6">
      {fields.map((f) => {
        const current = get(f.key, f.fallback);
        const overridden = f.key in overrides;
        const apply = (hex: string | null) =>
          setValue(f.key, hex === f.fallback ? null : hex, { label: f.label, kind: 'color' });
        return (
          <div key={f.key}>
            <p className="mb-3" style={label11}>{f.label}</p>
            <div className="grid grid-cols-5 gap-2 mb-3">
              {PALETTE.map((c) => (
                <button
                  key={c.hex}
                  title={c.name}
                  onClick={() => apply(c.hex)}
                  className="rounded-[10px] transition-transform hover:scale-110"
                  style={{
                    height: 40, background: c.hex,
                    border: c.hex.toLowerCase() === current.toLowerCase() ? '2px solid #00e4ff' : '1px solid rgba(255,255,255,0.15)',
                  }}
                />
              ))}
              <label
                className="relative rounded-[10px] cursor-pointer overflow-hidden flex items-center justify-center transition-transform hover:scale-110"
                title="Cor personalizada"
                style={{ height: 40, border: '1px dashed rgba(255,255,255,0.3)', background: 'conic-gradient(#f00,#ff0,#0f0,#0ff,#00f,#f0f,#f00)' }}
              >
                <input
                  type="color"
                  value={/^#[0-9a-fA-F]{6}$/.test(current) ? current : '#ffffff'}
                  onChange={(e) => apply(e.target.value)}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </label>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-[8px] shrink-0" style={{ width: 26, height: 26, background: current, border: '1px solid rgba(255,255,255,0.2)' }} />
              <span style={{ fontFamily: 'Inter', fontSize: 12.5, color: '#8b90a3' }}>{current}</span>
              {overridden && (
                <button
                  onClick={() => apply(f.fallback)}
                  className="ml-auto flex items-center gap-1.5 hover:text-white transition-colors"
                  style={{ fontFamily: 'Inter', fontSize: 12, color: '#8b90a3' }}
                >
                  <RotateCcw size={12} /> Restaurar padrão
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ---------- Imagem ---------- */

function ImageBody({ panel }: { panel: Extract<PanelState, { type: 'image' }> }) {
  const { get, setValue, overrides, uploadImage } = useEditorStore();
  const [busy, setBusy] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const current = get(panel.key, panel.fallback);
  const overridden = panel.key in overrides;
  const { spec } = panel;
  const contain = spec.fit === 'contain';

  const handleFile = async (file: File | undefined | null) => {
    if (!file || !file.type.startsWith('image/')) return;
    setBusy(true);
    try {
      const dataUrl = await processImage(file, spec);
      const finalSrc = await uploadImage(dataUrl, panel.key);
      setValue(panel.key, finalSrc, { label: panel.label, kind: 'image' });
    } catch {
      alert('Não foi possível processar essa imagem. Tente outro arquivo (JPG, PNG, WebP ou SVG).');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div
        className="rounded-[12px] overflow-hidden mb-4"
        style={{
          border: '1px solid rgba(255,255,255,0.1)', aspectRatio: `${spec.w} / ${spec.h}`, maxHeight: 210,
          ...(contain ? { background: 'repeating-conic-gradient(rgba(255,255,255,0.06) 0% 25%, transparent 0% 50%) 50% / 16px 16px' } : {}),
        }}
      >
        {current ? (
          <img src={current} alt="" className={`w-full h-full ${contain ? 'object-contain' : 'object-cover'}`} />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-center px-4" style={{ background: 'rgba(255,255,255,0.03)' }}>
            <span style={{ fontFamily: 'Inter', fontSize: 12, color: '#8b90a3' }}>Nenhuma imagem — usando cor sólida</span>
          </div>
        )}
      </div>

      <div className="rounded-[12px] p-3.5 mb-4 flex gap-3" style={{ background: 'rgba(0,228,255,0.06)', border: '1px solid rgba(0,228,255,0.2)' }}>
        <Ruler size={16} color="#00e4ff" className="shrink-0 mt-0.5" />
        <div>
          <p style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 12.5, color: '#fff' }}>
            Tamanho ideal: {spec.w}×{spec.h}px · {spec.shape}
          </p>
          {spec.note && <p className="mt-0.5" style={{ fontFamily: 'Inter', fontSize: 12, lineHeight: '17px', color: 'rgba(255,255,255,0.65)' }}>{spec.note}</p>}
          <p className="mt-1" style={{ fontFamily: 'Inter', fontSize: 11.5, color: '#8b90a3' }}>
            JPG, PNG, WebP ou SVG. A imagem é ajustada e otimizada automaticamente{contain ? ' (logos: use fundo transparente)' : ''}.
          </p>
        </div>
      </div>

      <label
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files?.[0]); }}
        className="flex flex-col items-center justify-center gap-2 rounded-[12px] cursor-pointer transition-colors"
        style={{
          height: 104,
          border: `1.5px dashed ${dragOver ? '#d2e718' : 'rgba(255,255,255,0.25)'}`,
          background: dragOver ? 'rgba(210,231,24,0.06)' : 'rgba(255,255,255,0.03)',
        }}
      >
        <input type="file" accept="image/*,.svg" className="hidden" onChange={(e) => { handleFile(e.target.files?.[0]); e.target.value = ''; }} />
        <Upload size={18} color={busy ? '#8b90a3' : '#d2e718'} />
        <span style={{ fontFamily: 'Inter', fontSize: 12.5, color: busy ? '#8b90a3' : 'rgba(255,255,255,0.85)' }}>
          {busy ? 'Otimizando…' : 'Clique ou arraste a nova imagem aqui'}
        </span>
      </label>

      {overridden && (
        <button
          onClick={() => setValue(panel.key, null, { label: panel.label, kind: 'image' })}
          className="mt-4 flex items-center gap-1.5 hover:text-white transition-colors"
          style={{ fontFamily: 'Inter', fontSize: 12.5, color: '#8b90a3' }}
        >
          <RotateCcw size={13} /> Restaurar imagem original
        </button>
      )}
    </div>
  );
}

/* ---------- Ícone (picker Lucide + upload SVG) ---------- */

function IconBody({ panel }: { panel: Extract<PanelState, { type: 'icon' }> }) {
  const { get, setValue, overrides, uploadImage } = useEditorStore();
  const current = parseIconValue(get(panel.key, ''));
  const overridden = panel.key in overrides;

  const [search, setSearch] = useState('');
  const [size, setSize] = useState(current?.size ?? panel.defaultSize);
  const [stroke, setStroke] = useState(current?.stroke ?? 2);
  const [color, setColor] = useState(current?.kind === 'lucide' ? (current.color ?? '') : '');
  const [busy, setBusy] = useState(false);

  const names = useMemo(
    () => (search ? LUCIDE_NAMES.filter((n) => n.includes(search.toLowerCase().trim())) : LUCIDE_NAMES),
    [search]
  );

  const applyLucide = (name: string, s = size, st = stroke, c = color) =>
    setValue(panel.key, `lucide:${name}:${s}:${st}:${c}`, { label: panel.label, kind: 'text' });

  const activeName = current?.kind === 'lucide' ? current.name : undefined;

  const handleFile = async (file: File | undefined | null) => {
    if (!file || !file.type.startsWith('image/')) return;
    setBusy(true);
    try {
      const dataUrl = await processImage(file, { w: 240, h: 240, shape: 'quadrada', fit: 'contain' });
      const finalSrc = await uploadImage(dataUrl, panel.key);
      setValue(panel.key, `img|${size}|${finalSrc}`, { label: panel.label, kind: 'text' });
    } catch {
      alert('Arquivo inválido — envie um SVG ou PNG.');
    } finally {
      setBusy(false);
    }
  };

  const slider: CSSProperties = { width: '100%', accentColor: '#d2e718' };

  return (
    <div>
      <input
        placeholder="Buscar ícone… (em inglês, ex.: brain, globe)"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-3 outline-none"
        style={{ height: 40, borderRadius: 10, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', fontFamily: 'Inter', fontSize: 13, color: '#fff', padding: '0 14px' }}
      />

      <div className="grid grid-cols-6 gap-1.5 mb-4 overflow-y-auto pr-1" style={{ maxHeight: 200, scrollbarWidth: 'thin' }}>
        {names.map((n) => {
          const Cmp = LUCIDE_CHOICES[n];
          return (
            <button
              key={n}
              title={n}
              onClick={() => applyLucide(n)}
              className="flex items-center justify-center rounded-[8px] hover:bg-white/10 transition-colors"
              style={{ height: 42, border: activeName === n ? '1.5px solid #00e4ff' : '1px solid rgba(255,255,255,0.08)', color: '#fff' }}
            >
              <Cmp size={18} strokeWidth={1.8} />
            </button>
          );
        })}
        {names.length === 0 && <p className="col-span-6 py-4 text-center" style={{ ...text13, color: '#8b90a3' }}>Nenhum ícone encontrado.</p>}
      </div>

      <div className="space-y-3 mb-4">
        <div>
          <div className="flex justify-between mb-1">
            <span style={label11}>Tamanho</span>
            <span style={{ fontFamily: 'Inter', fontSize: 12, color: '#fff' }}>{size}px</span>
          </div>
          <input
            type="range" min={16} max={96} value={size} style={slider}
            onChange={(e) => setSize(+e.target.value)}
            onPointerUp={() => activeName && applyLucide(activeName, size, stroke, color)}
          />
        </div>
        <div>
          <div className="flex justify-between mb-1">
            <span style={label11}>Espessura do traço</span>
            <span style={{ fontFamily: 'Inter', fontSize: 12, color: '#fff' }}>{stroke}</span>
          </div>
          <input
            type="range" min={1} max={3} step={0.25} value={stroke} style={slider}
            onChange={(e) => setStroke(+e.target.value)}
            onPointerUp={() => activeName && applyLucide(activeName, size, stroke, color)}
          />
        </div>
        <div>
          <p className="mb-1.5" style={label11}>Cor do ícone</p>
          <div className="flex gap-1.5 flex-wrap">
            {PALETTE.map((c) => (
              <button
                key={c.hex}
                title={c.name}
                onClick={() => { setColor(c.hex); if (activeName) applyLucide(activeName, size, stroke, c.hex); }}
                className="rounded-[7px] hover:scale-110 transition-transform"
                style={{ width: 26, height: 26, background: c.hex, border: color === c.hex ? '2px solid #00e4ff' : '1px solid rgba(255,255,255,0.2)' }}
              />
            ))}
            <button
              title="Cor original do design"
              onClick={() => { setColor(''); if (activeName) applyLucide(activeName, size, stroke, ''); }}
              className="rounded-[7px] flex items-center justify-center hover:scale-110 transition-transform"
              style={{ width: 26, height: 26, border: color === '' ? '2px solid #00e4ff' : '1px dashed rgba(255,255,255,0.3)', color: '#8b90a3', fontSize: 10 }}
            >
              auto
            </button>
          </div>
        </div>
      </div>

      <label
        className="flex items-center justify-center gap-2 rounded-[10px] cursor-pointer hover:bg-white/5 transition-colors"
        style={{ height: 44, border: '1.5px dashed rgba(255,255,255,0.25)' }}
      >
        <input type="file" accept="image/svg+xml,image/png,.svg" className="hidden" onChange={(e) => { handleFile(e.target.files?.[0]); e.target.value = ''; }} />
        <Upload size={14} color="#d2e718" />
        <span style={{ fontFamily: 'Inter', fontSize: 12.5, color: busy ? '#8b90a3' : 'rgba(255,255,255,0.85)' }}>
          {busy ? 'Processando…' : 'Ou enviar SVG/PNG próprio'}
        </span>
      </label>

      {overridden && (
        <button
          onClick={() => setValue(panel.key, null, { label: panel.label, kind: 'text' })}
          className="mt-4 flex items-center gap-1.5 hover:text-white transition-colors"
          style={{ fontFamily: 'Inter', fontSize: 12.5, color: '#8b90a3' }}
        >
          <RotateCcw size={13} /> Restaurar ícone original
        </button>
      )}
    </div>
  );
}

/* ---------- Histórico ---------- */

function stripTags(s: string): string {
  return s.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

function ValueChip({ kind, value }: { kind: HistoryEntry['kind']; value: string | null }) {
  if (value === null) {
    return <span className="rounded-[6px] px-1.5 py-0.5 shrink-0" style={{ background: 'rgba(255,255,255,0.08)', fontFamily: 'Inter', fontSize: 11, color: '#8b90a3' }}>padrão</span>;
  }
  if (kind === 'color') {
    return (
      <span className="inline-flex items-center gap-1.5 shrink-0">
        <span className="rounded-[5px]" style={{ width: 16, height: 16, background: value, border: '1px solid rgba(255,255,255,0.25)', display: 'inline-block' }} />
        <span style={{ fontFamily: 'Inter', fontSize: 11, color: '#8b90a3' }}>{value}</span>
      </span>
    );
  }
  if (kind === 'image') {
    return <img src={value} alt="" className="rounded-[6px] object-cover shrink-0" style={{ width: 42, height: 30, border: '1px solid rgba(255,255,255,0.15)' }} />;
  }
  return (
    <span style={{ fontFamily: 'Inter', fontSize: 12, color: '#d6d6d6', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 116, display: 'inline-block' }}>
      {stripTags(value)}
    </span>
  );
}

function HistoryBody() {
  const { history, setValue } = useEditorStore();

  /* Desfazer em camadas (estilo Ctrl+Z): eventos de publicação não são
     "edições" — ficam de fora da contagem. Entre as edições, as restaurações
     feitas pelo botão acumulam no topo; a próxima edição "de verdade" a
     desfazer fica em 2×d, onde d é o nº de desfazeres consecutivos já feitos. */
  const edits = history.filter((h) => h.event !== 'publish');
  let d = 0;
  while (edits[d]?.restaurado) d++;
  const undoTarget = edits[2 * d];

  const undo = () => {
    if (!undoTarget) return;
    setValue(undoTarget.key, undoTarget.oldValue, { label: undoTarget.label, kind: undoTarget.kind, restaurado: true });
  };

  return (
    <div>
      <button
        onClick={undo}
        disabled={!undoTarget}
        className="w-full mb-4 flex items-center justify-center gap-2 rounded-[12px] transition-colors hover:bg-white/10 disabled:opacity-40 disabled:cursor-default"
        style={{ height: 44, border: '1px solid rgba(255,255,255,0.14)', fontFamily: 'Inter', fontWeight: 600, fontSize: 13, color: '#fff' }}
      >
        <Undo2 size={15} color="#d2e718" />
        {undoTarget ? `Desfazer: ${undoTarget.label}` : 'Nada para desfazer'}
      </button>

      {history.length === 0 ? (
        <div className="py-8 text-center">
          <p style={{ ...text13, color: '#8b90a3' }}>Nenhuma edição registrada ainda.</p>
          <p className="mt-1.5" style={{ fontFamily: 'Inter', fontSize: 12, color: '#5c6072' }}>
            Clique em qualquer texto, imagem, ícone ou fundo da página para editar.
          </p>
        </div>
      ) : (
        <div className="space-y-1">
          {history.map((h, i) => {
            if (h.event === 'publish') {
              return (
                <div key={h.id} className="flex items-center gap-2.5 py-3 px-1" style={{ borderBottom: i < history.length - 1 ? '1px solid rgba(255,255,255,0.06)' : undefined }}>
                  <span className="flex items-center justify-center rounded-full shrink-0" style={{ width: 26, height: 26, background: 'rgba(0,228,255,0.16)' }}>
                    <CloudUpload size={13} color="#00e4ff" />
                  </span>
                  <div className="min-w-0">
                    <p style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 12.5, color: '#00e4ff' }}>
                      {h.userName} publicou o site
                    </p>
                    <p style={{ fontFamily: 'Inter', fontSize: 11, color: '#5c6072' }}>{formatWhen(h.ts)}</p>
                  </div>
                </div>
              );
            }
            return (
              <div key={h.id} className="rounded-[14px] p-3.5 transition-colors hover:bg-white/[0.04]" style={{ borderBottom: i < history.length - 1 ? '1px solid rgba(255,255,255,0.06)' : undefined }}>
                <div className="flex items-center gap-2.5 mb-2">
                  <span className="flex items-center justify-center rounded-full shrink-0" style={{ width: 26, height: 26, background: 'rgba(210,231,24,0.16)', fontFamily: 'Inter', fontWeight: 700, fontSize: 10, color: '#d2e718' }}>
                    {initials(h.userName)}
                  </span>
                  <div className="min-w-0">
                    <p style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 12.5, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {h.userName}
                      {h.restaurado && <span style={{ fontWeight: 400, color: '#8b90a3' }}> · restauração</span>}
                    </p>
                    <p style={{ fontFamily: 'Inter', fontSize: 11, color: '#5c6072' }}>{formatWhen(h.ts)}</p>
                  </div>
                </div>
                <p className="mb-1.5" style={label11}>{h.label}</p>
                <div className="flex items-center gap-2 flex-wrap">
                  <ValueChip kind={h.kind} value={h.oldValue} />
                  <span style={{ color: '#5c6072', fontSize: 11 }}>→</span>
                  <ValueChip kind={h.kind} value={h.newValue} />
                  <button
                    onClick={() => setValue(h.key, h.oldValue, { label: h.label, kind: h.kind, restaurado: true })}
                    className="ml-auto flex items-center gap-1 hover:text-white transition-colors shrink-0"
                    title="Desfazer esta alteração — o campo volta ao valor de antes dela"
                    style={{ fontFamily: 'Inter', fontSize: 11.5, color: '#8b90a3' }}
                  >
                    <Undo2 size={11} /> Desfazer
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
