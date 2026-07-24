import { useEffect, useRef, useState, type CSSProperties, type MouseEvent, type PointerEvent as RPointerEvent, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { ALargeSmall, ArrowLeftRight, ArrowUpDown, Baseline, Bold, Check, Eraser, Italic, Maximize2, Minus, Move, Plus, Underline } from 'lucide-react';
import { useEditorStore, deviceCategoryForWidth, editorPortalTarget, editorViewport, frameOffset, DEVICE_BREAKPOINTS, type ImageSpec, type DeviceCategory } from './store';
import { LUCIDE_CHOICES } from './editorIcons';
import { glass, PALETTE } from './theme';

/* ═══════════════════════════════════════════════════════════════════
   Campos editáveis usados dentro das seções.

   - <ET>            texto inline (rótulos, botões, números) — clique edita,
                     com a MESMA toolbar de formatação dos blocos
   - <ERich>         bloco de texto (títulos, descrições) — caixa inteira,
                     toolbar de formatação e largura arrastável (`baseW`)
   - <EImg>          <img> editável (SVG/PNG/JPG; otimização automática)
   - useEditImage    imagem editável usada como background CSS
   - <BgEditChip>    chip "trocar imagem de fundo" pra bgs cobertos por conteúdo
   - <EIcon>         ícone editável — picker Lucide (tamanho/espessura/cor)
   - useEditColor(s) cores de fundos/cards (clique → paleta)

   Toolbar de formatação: negrito/itálico/sublinhado (com estado ativo),
   tamanho em px e cor — tudo aplicável à seleção. Fora do modo edição,
   tudo renderiza o design original sem handlers.
   ═══════════════════════════════════════════════════════════════════ */

/* ---------- Sanitização do HTML editado ---------- */

const FONT_SIZE_EM: Record<string, string> = {
  '1': '0.7em', '2': '0.85em', '3': '1em', '4': '1.15em', '5': '1.3em', '6': '1.6em', '7': '2em',
};

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** Mantém só a formatação segura: span/b/i/u/br + estilos de cor, peso e tamanho. */
function sanitizeRich(html: string): string {
  const doc = new DOMParser().parseFromString(`<div id="__r">${html}</div>`, 'text/html');
  const root = doc.getElementById('__r');
  if (!root) return '';

  const walk = (node: Node): string => {
    if (node.nodeType === Node.TEXT_NODE) return escapeHtml(node.textContent ?? '');
    if (node.nodeType !== Node.ELEMENT_NODE) return '';
    const el = node as HTMLElement;
    const tag = el.tagName.toLowerCase();
    const inner = [...el.childNodes].map(walk).join('');

    if (tag === 'br') return '<br>';
    if (tag === 'div' || tag === 'p') return inner + '<br>';
    if (tag === 'b' || tag === 'strong') return `<b>${inner}</b>`;
    if (tag === 'i' || tag === 'em') return `<i>${inner}</i>`;
    if (tag === 'u') return `<u>${inner}</u>`;

    /* font (execCommand legado) → span com font-size relativo */
    if (tag === 'font') {
      const size = el.getAttribute('size');
      const color = el.getAttribute('color');
      const styles: string[] = [];
      if (size && FONT_SIZE_EM[size]) styles.push(`font-size:${FONT_SIZE_EM[size]}`);
      if (color) styles.push(`color:${color}`);
      return styles.length ? `<span style="${styles.join(';')}">${inner}</span>` : inner;
    }

    if (tag === 'span') {
      const s = el.style;
      const keep: string[] = [];
      if (s.color) keep.push(`color:${s.color}`);
      if (s.fontSize) keep.push(`font-size:${s.fontSize}`);
      if (s.letterSpacing) keep.push(`letter-spacing:${s.letterSpacing}`);
      /* line-height NÃO é preservado em spans internos: entrelinhas é propriedade
         da caixa (override .lh) — um span interno com line-height maior vira um
         "piso" invisível que impede a caixa de diminuir o espaçamento */
      if (s.fontWeight && s.fontWeight !== 'normal' && s.fontWeight !== '400') keep.push(`font-weight:${s.fontWeight}`);
      if (s.fontStyle === 'italic') keep.push('font-style:italic');
      if (s.textDecorationLine.includes('underline') || s.textDecoration.includes('underline')) keep.push('text-decoration:underline');
      return keep.length ? `<span style="${keep.join(';')}">${inner}</span>` : inner;
    }

    return inner; // qualquer outra tag: mantém só o conteúdo
  };

  return [...root.childNodes].map(walk).join('').replace(/(<br>)+$/, '');
}

/** A barra de formatação pode estar portada pra fora do iframe, na janela
 * de cima (ver `editorPortalTarget`) — o `relatedTarget` do evento `blur`
 * não é confiável atravessando documentos diferentes, então em vez de
 * decidir na hora, adia um tick (`requestAnimationFrame`) e confere o
 * foco de verdade em QUALQUER um dos dois documentos possíveis. */
function toolbarHasFocus(): boolean {
  const focado = (doc: Document) => !!doc.activeElement?.closest?.('[data-rich-toolbar]');
  if (focado(document)) return true;
  try {
    if (window.top && window.top !== window.self && window.top.document !== document) {
      return focado(window.top.document);
    }
  } catch { /* ok */ }
  return false;
}

/** onBlur do campo editável (ET/ERich) — não encerra a edição quando o
 * foco foi pra dentro da própria barra (ex.: campo numérico de tamanho). */
function onEditableBlur(commit: () => void) {
  return () => { requestAnimationFrame(() => { if (!toolbarHasFocus()) commit(); }); };
}

/* ---------- Campo numérico da toolbar (−/input/+, aplicação imediata) ---------- */

interface NumFieldProps {
  icon: ReactNode;
  title: string;
  value: number;
  step: number;
  min: number;
  max: number;
  decimals?: boolean;
  apply: (v: number) => void;
  highlightOn: () => void;
  highlightOff: () => void;
}

function NumField({ icon, title, value, step, min, max, decimals, apply, highlightOn, highlightOff }: NumFieldProps) {
  const fmt = (n: number) => (decimals ? String(Math.round(n * 10) / 10) : String(Math.round(n)));
  const [text, setText] = useState(fmt(value));
  const cur = useRef(value);           // valor "vivo" — síncrono, sem lag de estado
  const inputRef = useRef<HTMLInputElement>(null);

  /* sincroniza quando a seleção muda de lugar (novo trecho = novos valores) */
  useEffect(() => {
    if (document.activeElement === inputRef.current) return; // digitando: não sobrescreve
    cur.current = value;
    setText(fmt(value));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const applyNow = (v: number, fromTyping = false) => {
    const clamped = Math.min(max, Math.max(min, v));
    cur.current = clamped;
    if (!fromTyping) setText(fmt(clamped));
    const el = inputRef.current;
    const caret = el ? el.selectionStart : null;
    apply(clamped);                    // foca o editável e aplica na seleção
    if (fromTyping && el) {            // devolve o foco pro input pra seguir digitando
      el.focus({ preventScroll: true });
      if (caret !== null) { try { el.setSelectionRange(caret, caret); } catch { /* ok */ } }
      highlightOn();
    }
  };

  const stepBtn: CSSProperties = {
    width: 22, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center',
    borderRadius: 6, color: '#fff',
  };

  return (
    <span className="flex items-center gap-0.5" title={title}>
      <span style={{ color: '#8b90a3', display: 'flex' }}>{icon}</span>
      <button style={stepBtn} className="hover:bg-white/10" onClick={() => applyNow(cur.current - step)}><Minus size={12} /></button>
      <input
        ref={inputRef}
        value={text}
        onChange={(e) => {
          const raw = e.target.value.replace(/[^\d.,-]/g, '').replace(',', '.');
          setText(raw);
          const v = parseFloat(raw);
          if (Number.isFinite(v) && v >= min && v <= max) applyNow(v, true); // aplica em tempo real enquanto digita
        }}
        onFocus={highlightOn}
        onBlur={() => { highlightOff(); setText(fmt(cur.current)); }}
        onKeyDown={(e) => {
          e.stopPropagation();
          if (e.key === 'Enter') { e.preventDefault(); (e.target as HTMLInputElement).blur(); }
          if (e.key === 'ArrowUp') { e.preventDefault(); applyNow(cur.current + step, true); setText(fmt(cur.current)); }
          if (e.key === 'ArrowDown') { e.preventDefault(); applyNow(cur.current - step, true); setText(fmt(cur.current)); }
        }}
        className="text-center outline-none"
        style={{ width: 42, height: 26, borderRadius: 6, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.14)', fontFamily: 'Inter', fontSize: 12, color: '#fff' }}
      />
      <button style={stepBtn} className="hover:bg-white/10" onClick={() => applyNow(cur.current + step)}><Plus size={12} /></button>
    </span>
  );
}

/* ---------- Toolbar de formatação (compartilhada por ET e ERich) ---------- */

interface RichToolbarProps {
  anchor: HTMLElement;
  editHost: HTMLElement;
  /** entrelinhas é propriedade da CAIXA (não da seleção): inline nunca consegue
   * ENCOLHER abaixo do strut do bloco — só na caixa aumenta e diminui de verdade */
  onLeading: (px: number) => void;
  onDone: () => void;
}

function RichToolbar({ anchor, editHost, onLeading, onDone }: RichToolbarProps) {
  const [pos, setPos] = useState(() => anchor.getBoundingClientRect());
  const [showColors, setShowColors] = useState(false);
  const [active, setActive] = useState({ b: false, i: false, u: false });
  const [metrics, setMetrics] = useState({ size: 16, track: 0, lead: 19 });
  const savedRange = useRef<Range | null>(null);
  const tbRef = useRef<HTMLDivElement>(null);
  const [tbW, setTbW] = useState(640);

  useEffect(() => {
    if (tbRef.current) setTbW(tbRef.current.offsetWidth);
  }, []);

  useEffect(() => {
    const update = () => setPos(anchor.getBoundingClientRect());
    window.addEventListener('scroll', update, true);
    window.addEventListener('resize', update);
    /* dentro do iframe, a barra é portada pra janela de cima (ver
     * `editorPortalTarget`) — rolar/redimensionar a JANELA DE CIMA também
     * precisa reposicionar a barra (o fundo escurecido do overlay rola). */
    let top: Window | null = null;
    try { top = window.top !== window.self ? window.top : null; } catch { top = null; }
    top?.addEventListener('scroll', update, true);
    top?.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update, true);
      window.removeEventListener('resize', update);
      top?.removeEventListener('scroll', update, true);
      top?.removeEventListener('resize', update);
    };
  }, [anchor]);

  const leadDe = () => {
    const cs = getComputedStyle(editHost);
    return cs.lineHeight === 'normal' ? Math.round(parseFloat(cs.fontSize) * 1.2) : Math.round(parseFloat(cs.lineHeight));
  };

  /* acompanha a seleção: guarda o range, atualiza estados ativos e os valores atuais */
  useEffect(() => {
    const onSel = () => {
      const sel = getSelection();
      if (!sel || sel.rangeCount === 0) return;
      const r = sel.getRangeAt(0);
      if (!editHost.contains(r.commonAncestorContainer)) return;
      savedRange.current = r.cloneRange();
      try {
        setActive({
          b: document.queryCommandState('bold'),
          i: document.queryCommandState('italic'),
          u: document.queryCommandState('underline'),
        });
      } catch { /* ok */ }
      const node = r.startContainer.nodeType === Node.TEXT_NODE
        ? r.startContainer.parentElement
        : (r.startContainer as Element);
      if (node) {
        const cs = getComputedStyle(node);
        setMetrics({
          size: Math.round(parseFloat(cs.fontSize)),
          track: cs.letterSpacing === 'normal' ? 0 : Math.round(parseFloat(cs.letterSpacing) * 10) / 10,
          lead: leadDe(),
        });
      }
    };
    document.addEventListener('selectionchange', onSel);
    onSel();
    return () => document.removeEventListener('selectionchange', onSel);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editHost]);

  const restoreSel = () => {
    const r = savedRange.current;
    if (!r) return;
    const sel = getSelection();
    sel?.removeAllRanges();
    sel?.addRange(r);
  };

  /* ── Preservação de seleção por offsets de texto ──
     Formatação via execCommand reconstrói nós do DOM e mata o Range vivo.
     Como o TEXTO não muda em operação de formatação, medimos a seleção em
     offsets de caracteres antes, e a recriamos sobre os nós novos depois —
     assim o texto CONTINUA selecionado após cada clique da toolbar. */
  const offsetsOf = (): [number, number] | null => {
    const sel = getSelection();
    if (!sel || sel.rangeCount === 0) return null;
    const r = sel.getRangeAt(0);
    if (!editHost.contains(r.commonAncestorContainer)) return null;
    const pre = r.cloneRange();
    pre.selectNodeContents(editHost);
    pre.setEnd(r.startContainer, r.startOffset);
    const start = pre.toString().length;
    return [start, start + r.toString().length];
  };

  const selectOffsets = (start: number, end: number) => {
    const walker = document.createTreeWalker(editHost, NodeFilter.SHOW_TEXT);
    let pos = 0;
    let sNode: Text | null = null; let sOff = 0;
    let eNode: Text | null = null; let eOff = 0;
    while (walker.nextNode()) {
      const t = walker.currentNode as Text;
      const len = t.textContent?.length ?? 0;
      if (!sNode && start <= pos + len) { sNode = t; sOff = start - pos; }
      if (!eNode && end <= pos + len) { eNode = t; eOff = end - pos; break; }
      pos += len;
    }
    if (!sNode || !eNode) return;
    const range = document.createRange();
    range.setStart(sNode, sOff);
    range.setEnd(eNode, eOff);
    const sel = getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);
    savedRange.current = range.cloneRange();
  };

  /* Executa uma operação de formatação mantendo o texto selecionado no final */
  const comSelecaoMantida = (fn: () => void) => {
    (editHost as HTMLElement).focus({ preventScroll: true });
    restoreSel();
    const off = offsetsOf();
    fn();
    if (off) selectOffsets(off[0], off[1]);
    try {
      setActive({
        b: document.queryCommandState('bold'),
        i: document.queryCommandState('italic'),
        u: document.queryCommandState('underline'),
      });
    } catch { /* ok */ }
  };

  const cmd = (name: string, val?: string) => comSelecaoMantida(() => document.execCommand(name, false, val));

  /* Estilo arbitrário na seleção: usa fontSize 7 como marcador e troca por span
     com os estilos pedidos. styleWithCSS precisa estar DESLIGADO na hora do
     comando — ligado, o Chrome gera span "xxx-large" em vez do <font size="7">.
     Aplicações repetidas (cliques seguidos no ±) fundem no span existente em
     vez de aninhar um novo a cada clique. */
  const applySpanStyle = (styles: Record<string, string>) => {
    comSelecaoMantida(() => {
      try {
        document.execCommand('styleWithCSS', false, 'false');
        document.execCommand('fontSize', false, '7');
      } finally {
        document.execCommand('styleWithCSS', false, 'true');
      }
      editHost.querySelectorAll('font[size="7"]').forEach((f) => {
        const pai = f.parentElement;
        if (pai && pai !== editHost && pai.tagName === 'SPAN' && pai.childNodes.length === 1) {
          Object.assign(pai.style, styles);          // funde no span existente
          f.replaceWith(...f.childNodes);
        } else {
          const span = document.createElement('span');
          Object.assign(span.style, styles);
          span.innerHTML = (f as HTMLElement).innerHTML;
          f.replaceWith(span);
        }
      });
    });
  };

  const applySize = (px: number) => applySpanStyle({ fontSize: `${px}px` });

  /* Espaçamento entre letras: embrulha o Range direto num span (extract + insert)
     em vez do marcador fontSize — o comando fontSize do Chrome APAGA font-size
     existente na seleção, então usá-lo aqui perdia o tamanho já aplicado.
     Limpa a mesma propriedade dos spans internos pra edição repetida sobrescrever. */
  const applyTracking = (px: number) => {
    comSelecaoMantida(() => {
      const sel = getSelection();
      if (!sel || sel.rangeCount === 0 || sel.isCollapsed) return;
      const r = sel.getRangeAt(0);
      const span = document.createElement('span');
      span.style.letterSpacing = `${px}px`;
      span.appendChild(r.extractContents());
      span.querySelectorAll('span').forEach((s) => { s.style.letterSpacing = ''; });
      r.insertNode(span);
    });
  };

  /* Entrelinhas: propriedade da caixa toda — aplicada pelo campo (ET/ERich),
     senão o strut do bloco impede DIMINUIR o espaçamento (inline só aumenta) */
  const applyLeading = (px: number) => {
    (editHost as HTMLElement).focus({ preventScroll: true });
    restoreSel();
    onLeading(px);
    setMetrics((m) => ({ ...m, lead: px }));
  };

  /* Enquanto o foco está no input de px, o navegador esconde a seleção do texto —
     um destaque visual (CSS Highlight API) mantém o trecho marcado à vista. */
  const highlightOn = () => {
    const r = savedRange.current;
    const H = (window as unknown as { Highlight?: new (r: Range) => unknown }).Highlight;
    if (r && H && 'highlights' in CSS) {
      (CSS as unknown as { highlights: Map<string, unknown> }).highlights.set('hubpan-sel', new H(r));
    }
  };
  const highlightOff = () => {
    if ('highlights' in CSS) (CSS as unknown as { highlights: Map<string, unknown> }).highlights.delete('hubpan-sel');
  };

  const btn = (isActive?: boolean): CSSProperties => ({
    width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center',
    borderRadius: 8, color: isActive ? '#00e4ff' : '#fff',
    background: isActive ? 'rgba(0,228,255,0.16)' : 'transparent',
  });

  /* posição: acima do bloco; se não couber, abaixo — e sempre 100% dentro da
   * tela DISPONÍVEL. Dentro do iframe de "Visualizar em", a barra (~640px de
   * botões) é portada pra JANELA DE CIMA (`editorPortalTarget`) em vez de
   * ficar presa aos poucos pixels do preset simulado — daí ela "extrapola"
   * visualmente o quadrinho do celular/tablet, com toda a tela real
   * disponível pra se posicionar. `pos` vem de `anchor.getBoundingClientRect()`
   * — coordenadas DENTRO do iframe — por isso soma `frameOffset()` (a
   * posição do próprio `<iframe>` na janela de cima) antes de usar; fora do
   * iframe os dois valores são `{x:0,y:0}`/iguais aos de sempre. */
  const offset = frameOffset();
  const viewport = editorViewport();
  const maxTbW = Math.max(200, viewport.w - 16);
  const shownW = Math.min(tbW, maxTbW);
  const anchorTop = pos.top + offset.y;
  const anchorBottom = pos.bottom + offset.y;
  const anchorLeft = pos.left + offset.x;
  const top = anchorTop - 50 >= 8 ? anchorTop - 50 : Math.min(anchorBottom + 8, viewport.h - 52);
  const left = Math.min(Math.max(8, anchorLeft), Math.max(8, viewport.w - shownW - 8));
  const divider = <span style={{ width: 1, height: 18, background: 'rgba(255,255,255,0.15)', margin: '0 3px' }} />;

  return createPortal(
    <div
      ref={tbRef}
      data-editor-ui
      data-rich-toolbar
      tabIndex={-1}
      className="fixed z-[1001] flex items-center gap-0.5 px-1.5 py-1.5 rounded-[12px] whitespace-nowrap"
      style={{ top, left, maxWidth: maxTbW, overflowX: tbW > maxTbW ? 'auto' : 'visible', ...glass }}
      /* preventDefault mantém a seleção do texto — exceto nos inputs, que precisam de foco */
      onMouseDown={(e) => { if (!(e.target as Element).closest('input')) e.preventDefault(); }}
    >
      <button style={btn(active.b)} className="hover:bg-white/10" title="Negrito" onClick={() => cmd('bold')}><Bold size={14} /></button>
      <button style={btn(active.i)} className="hover:bg-white/10" title="Itálico" onClick={() => cmd('italic')}><Italic size={14} /></button>
      <button style={btn(active.u)} className="hover:bg-white/10" title="Sublinhado" onClick={() => cmd('underline')}><Underline size={14} /></button>

      {divider}

      <NumField
        icon={<ALargeSmall size={14} />} title="Tamanho da fonte (px)"
        value={metrics.size} step={1} min={6} max={300}
        apply={applySize} highlightOn={highlightOn} highlightOff={highlightOff}
      />
      {divider}
      <NumField
        icon={<ArrowLeftRight size={13} />} title="Espaçamento entre letras (px)"
        value={metrics.track} step={0.5} min={-20} max={60} decimals
        apply={applyTracking} highlightOn={highlightOn} highlightOff={highlightOff}
      />
      {divider}
      <NumField
        icon={<ArrowUpDown size={13} />} title="Espaçamento entre linhas (px) — caixa inteira"
        value={metrics.lead} step={1} min={6} max={400}
        apply={applyLeading} highlightOn={highlightOn} highlightOff={highlightOff}
      />

      {divider}

      <div className="relative">
        <button style={btn(showColors)} className="hover:bg-white/10" title="Cor do texto selecionado" onClick={() => setShowColors((s) => !s)}>
          <Baseline size={14} color="#d2e718" />
        </button>
        {showColors && (
          <div className="absolute right-0 flex gap-1 p-1.5 rounded-[10px]" style={{ top: 34, ...glass }}>
            {PALETTE.map((c) => (
              <button
                key={c.hex}
                title={c.name}
                onClick={() => { cmd('foreColor', c.hex); setShowColors(false); }}
                className="rounded-[6px] hover:scale-110 transition-transform"
                style={{ width: 20, height: 20, background: c.hex, border: '1px solid rgba(255,255,255,0.25)' }}
              />
            ))}
          </div>
        )}
      </div>
      <button style={btn()} className="hover:bg-white/10" title="Limpar formatação" onClick={() => cmd('removeFormat')}><Eraser size={14} /></button>

      {divider}

      <button
        className="flex items-center gap-1.5 px-3 rounded-[8px] hover:brightness-95"
        style={{ height: 28, background: '#d2e718', fontFamily: 'Inter', fontWeight: 600, fontSize: 12, color: '#152852' }}
        onClick={onDone}
      >
        <Check size={13} strokeWidth={3} /> Concluir
      </button>
    </div>,
    editorPortalTarget()
  );
}

/* ---------- Texto inline ---------- */

interface ETProps {
  k: string;
  v: string;
  l: string;
  multiline?: boolean;
  className?: string;
  style?: CSSProperties;
}

export function ET({ k, v, l, multiline, className, style }: ETProps) {
  const { get, setValue, editMode } = useEditorStore();
  const html = get(k, '');
  const lh = get(`${k}.lh`, '');
  const [editing, setEditing] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const beforeEditRef = useRef('');
  const lhInicialRef = useRef('');

  useEffect(() => {
    if (!editing || !ref.current) return;
    const el = ref.current;
    beforeEditRef.current = el.innerHTML;
    lhInicialRef.current = el.style.lineHeight;
    try { document.execCommand('styleWithCSS', false, 'true'); } catch { /* ok */ }
    el.focus({ preventScroll: true });
    const range = document.createRange();
    range.selectNodeContents(el);
    const sel = window.getSelection();
    sel?.removeAllRanges();
    sel?.addRange(range);
  }, [editing]);

  const commit = () => {
    const el = ref.current;
    if (!el) { setEditing(false); return; }
    setEditing(false);
    /* entrelinhas é propriedade da caixa — salva separado do conteúdo */
    const lhAgora = el.style.lineHeight;
    if (lhAgora !== lhInicialRef.current) {
      setValue(`${k}.lh`, lhAgora.endsWith('px') ? String(Math.round(parseFloat(lhAgora))) : null, { label: `${l} (entrelinhas)`, kind: 'text' });
    }
    const clean = sanitizeRich(el.innerHTML);
    if (clean === '') { el.innerHTML = beforeEditRef.current; return; }
    if (clean === sanitizeRich(beforeEditRef.current)) return; // nada mudou
    setValue(k, clean === escapeHtml(v) ? null : clean, { label: l, kind: 'text' });
  };

  const cancel = () => {
    const el = ref.current;
    if (el) {
      el.innerHTML = beforeEditRef.current;
      el.style.lineHeight = lhInicialRef.current;
    }
    setEditing(false);
  };

  const mergedStyle: CSSProperties = {
    ...(multiline ? { whiteSpace: 'pre-line' as const } : {}),
    ...style,
    ...(lh ? { lineHeight: `${lh}px` } : {}),
  };

  return (
    <>
      <span
        ref={ref}
        data-et={editMode ? '' : undefined}
        data-ek={editMode ? k : undefined}
        className={className}
        style={mergedStyle}
        contentEditable={editing || undefined}
        suppressContentEditableWarning
        onClick={editMode ? (e) => { e.stopPropagation(); e.preventDefault(); if (!editing) setEditing(true); } : undefined}
        onBlur={editing ? onEditableBlur(commit) : undefined}
        onKeyDown={editing ? (e) => {
          if (e.key === 'Enter' && !multiline) { e.preventDefault(); commit(); }
          if (e.key === 'Escape') cancel();
          e.stopPropagation();
        } : undefined}
        {...(html ? { dangerouslySetInnerHTML: { __html: html } } : {})}
      >
        {html ? undefined : v}
      </span>
      {editing && ref.current && (
        <RichToolbar
          anchor={ref.current}
          editHost={ref.current}
          onLeading={(px) => {
            const el = ref.current;
            if (!el) return;
            el.style.lineHeight = `${px}px`;
            /* remove line-height legado de spans internos — senão eles viram piso e travam a diminuição */
            el.querySelectorAll('span').forEach((s) => { if (s.style.lineHeight) s.style.lineHeight = ''; });
          }}
          onDone={commit}
        />
      )}
    </>
  );
}

/* ---------- Bloco de texto (títulos e descrições — caixa inteira) ---------- */

interface ERichProps {
  k: string;
  l: string;
  children: ReactNode;   // design original (fallback)
  baseW?: number;        // largura máxima padrão → habilita arrastar a largura
  className?: string;
  style?: CSSProperties;
}

export function ERich({ k, l, children, baseW, className, style }: ERichProps) {
  const { get, setValue, editMode } = useEditorStore();
  const html = get(k, '');
  const wOverride = get(`${k}.w`, '');
  const lh = get(`${k}.lh`, '');
  const [editing, setEditing] = useState(false);
  const [dragW, setDragW] = useState<number | null>(null);
  const wrapRef = useRef<HTMLSpanElement>(null);
  const innerRef = useRef<HTMLSpanElement>(null);
  const beforeEditRef = useRef('');
  const lhInicialRef = useRef('');

  useEffect(() => {
    if (!editing || !innerRef.current) return;
    const el = innerRef.current;
    beforeEditRef.current = el.innerHTML;
    lhInicialRef.current = el.style.lineHeight;
    try { document.execCommand('styleWithCSS', false, 'true'); } catch { /* ok */ }
    el.focus({ preventScroll: true });
  }, [editing]);

  const commit = () => {
    const el = innerRef.current;
    if (!el) { setEditing(false); return; }
    setEditing(false);
    /* entrelinhas é propriedade da caixa — salva separado do conteúdo */
    const lhAgora = el.style.lineHeight;
    if (lhAgora !== lhInicialRef.current) {
      setValue(`${k}.lh`, lhAgora.endsWith('px') ? String(Math.round(parseFloat(lhAgora))) : null, { label: `${l} (entrelinhas)`, kind: 'text' });
    }
    const clean = sanitizeRich(el.innerHTML);
    if (clean === '') { el.innerHTML = beforeEditRef.current; return; }
    if (clean === sanitizeRich(beforeEditRef.current)) return; // nada mudou
    setValue(k, clean, { label: l, kind: 'text' });
  };

  const cancel = () => {
    const el = innerRef.current;
    if (el) {
      el.innerHTML = beforeEditRef.current;
      el.style.lineHeight = lhInicialRef.current;
    }
    setEditing(false);
  };

  /* arrastar a largura da caixa (handle na borda direita) */
  const startDrag = (e: RPointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const el = wrapRef.current;
    if (!el) return;
    const startX = e.clientX;
    const startW = el.getBoundingClientRect().width;
    const move = (ev: PointerEvent) => setDragW(Math.max(120, Math.round(startW + ev.clientX - startX)));
    const up = (ev: PointerEvent) => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      const final = Math.max(120, Math.round(startW + ev.clientX - startX));
      setDragW(null);
      if (Math.abs(final - startW) > 2) {
        setValue(`${k}.w`, final === baseW ? null : String(final), { label: `${l} (largura)`, kind: 'text' });
      }
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };

  const maxW = dragW ?? (wOverride ? +wOverride : baseW);

  return (
    <span
      ref={wrapRef}
      data-erich={editMode ? '' : undefined}
      data-ek={editMode ? k : undefined}
      className={className}
      style={{ display: 'block', position: 'relative', ...style, ...(maxW ? { maxWidth: maxW } : {}) }}
      onClick={editMode ? (e) => { e.stopPropagation(); e.preventDefault(); if (!editing) setEditing(true); } : undefined}
    >
      <span
        ref={innerRef}
        style={{ display: 'block', outline: 'none', ...(lh ? { lineHeight: `${lh}px` } : {}) }}
        contentEditable={editing || undefined}
        suppressContentEditableWarning
        onBlur={editing ? onEditableBlur(commit) : undefined}
        onKeyDown={editing ? (e) => {
          if (e.key === 'Escape') { e.preventDefault(); cancel(); }
          e.stopPropagation();
        } : undefined}
        /* com override, o HTML salvo (sanitizado) é a fonte; sem override, o design
           original. Durante a digitação não há re-render, então o DOM editado não
           é sobrescrito até o commit. */
        {...(html ? { dangerouslySetInnerHTML: { __html: html } } : {})}
      >
        {html ? undefined : children}
      </span>
      {editing && wrapRef.current && innerRef.current && (
        <RichToolbar
          anchor={wrapRef.current}
          editHost={innerRef.current}
          onLeading={(px) => {
            const el = innerRef.current;
            if (!el) return;
            el.style.lineHeight = `${px}px`;
            /* remove line-height legado de spans internos — senão eles viram piso e travam a diminuição */
            el.querySelectorAll('span').forEach((s) => { if (s.style.lineHeight) s.style.lineHeight = ''; });
          }}
          onDone={commit}
        />
      )}
      {/* handle de largura em TODOS os blocos — arrastar re-quebra o texto ao vivo
          (2 linhas ↔ 1 linha conforme a caixa abre ou fecha) */}
      {editMode && !editing ? (
        <span
          data-resize-handle
          onPointerDown={startDrag}
          onClick={(e) => e.stopPropagation()}
          title="Arrastar pra ajustar a largura da caixa de texto"
        />
      ) : null}
    </span>
  );
}

/* ---------- Imagem (<img>) ---------- */

/** Categoria de dispositivo da largura REAL da janela (não simulada) —
 * usada só onde não dá pra resolver a imagem certa via CSS puro (fundo via
 * `useEditImage`, e o painel do editor pra escolher a aba inicial). Pra
 * `<EImg>` (a maioria dos casos) a troca é 100% CSS via `<picture>`, sem
 * JS — ver `EImg` abaixo. */
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

/* ---------- Layout por dispositivo: ordem e posição fina ---------- */

/** Resolve o valor de uma chave-satélite por dispositivo PRA EXIBIÇÃO —
 * decide pela largura REAL da tela de quem está vendo (`useDeviceBreakpoint`),
 * nunca por `editingDevice` (que só existe DENTRO do editor, vindo da URL
 * `?device=`; um visitante real do site nunca tem isso). Mesmo padrão que já
 * resolve a imagem de fundo por dispositivo em `useEditImage`, generalizado
 * pra qualquer valor textual (ordem, deslocamento, etc.). `get()` já resolve
 * a chave `.tablet`/`.mobile` sozinha mesmo estando "errada" pro
 * `editingDevice` atual (a leitura cai pra chave literal quando a
 * combinada não existe) — ver `get` em `store.tsx`. Sem override pro
 * dispositivo atual, HERDA o valor base (Desktop). */
function useDeviceScopedValue(baseKey: string, fallback: string): string {
  const { get } = useEditorStore();
  const bp = useDeviceBreakpoint();
  const mobile = get(`${baseKey}.mobile`, '');
  const tablet = get(`${baseKey}.tablet`, '');
  if (bp === 'mobile' && mobile) return mobile;
  if (bp === 'tablet' && tablet) return tablet;
  return get(baseKey, fallback);
}

/** Inverte a ordem visual (CSS `order`) de 2 elementos irmãos — mesma
 * gaveta por dispositivo de tudo mais no editor: inverter no Mobile não
 * mexe no Tablet nem no Desktop. Funciona tanto em `flex` quanto em
 * `grid` (ambos respeitam `order`), então cobre o padrão comum do site de
 * "flex-col no mobile, grid-cols-2 no desktop" sem precisar de 2 lógicas. */
export function useEditOrder(k: string, label: string): { inverted: boolean; toggle: () => void } {
  const { get, setValue, editMode } = useEditorStore();
  const inverted = useDeviceScopedValue(k, '0') === '1';
  const toggle = () => {
    if (!editMode) return;
    const current = get(k, '0') === '1';
    setValue(k, current ? null : '1', { label, kind: 'text' });
  };
  return { inverted, toggle };
}

/** Chip flutuante "inverter ordem" — só existe em modo edição. Posicionar
 * via `style` (mesmo padrão do `BgEditChip`), em algum canto livre da
 * seção; não precisa acompanhar visualmente o elemento que reordena. */
export function OrderEditChip({ k, label, style }: { k: string; label: string; style?: CSSProperties }) {
  const { editMode } = useEditorStore();
  const { inverted, toggle } = useEditOrder(k, label);
  if (!editMode) return null;
  return (
    <button
      data-editor-ui
      onClick={(e) => { e.stopPropagation(); toggle(); }}
      className="absolute z-30 flex items-center gap-2 rounded-full px-4 hover:brightness-110 transition"
      style={{ height: 36, ...glass, fontFamily: 'Inter', fontWeight: 500, fontSize: 12.5, color: '#fff', ...style }}
      title="Inverte a ordem entre imagem e conteúdo — só nesta versão de tela (Mobile/Tablet/Desktop)"
    >
      <ArrowLeftRight size={14} color={inverted ? '#d2e718' : '#00e4ff'} />
      {inverted ? 'Ordem invertida' : 'Inverter ordem'}
    </button>
  );
}

/** Desloca um elemento (`transform: translate`) em X/Y, arrastando uma
 * alça dedicada — mesma gaveta por dispositivo: arrastar em Mobile não
 * mexe no Tablet nem no Desktop. Chaves-satélite `${k}.dx`/`${k}.dy` (px),
 * mesmo padrão de `.w` da largura de caixa de texto (`ERich`). A alça é
 * separada do elemento em si (não o elemento inteiro) pra não conflitar
 * com o clique-pra-editar que ele já tem (ex.: `EImg` abre o painel de
 * imagem ao clicar) — arrastar vs. clicar ficaria ambíguo no mesmo alvo. */
export function useEditOffset(k: string, label: string): { dx: number; dy: number; dragProps: Record<string, unknown> } {
  const { get, setValue, editMode } = useEditorStore();
  const dxBase = +useDeviceScopedValue(`${k}.dx`, '0') || 0;
  const dyBase = +useDeviceScopedValue(`${k}.dy`, '0') || 0;
  const [drag, setDrag] = useState<{ x: number; y: number } | null>(null);
  const dx = drag ? drag.x : dxBase;
  const dy = drag ? drag.y : dyBase;

  const startDrag = (e: RPointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;
    const startY = e.clientY;
    const baseX = +get(`${k}.dx`, '0') || 0;
    const baseY = +get(`${k}.dy`, '0') || 0;
    const move = (ev: PointerEvent) => setDrag({ x: baseX + ev.clientX - startX, y: baseY + ev.clientY - startY });
    const up = (ev: PointerEvent) => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      const finalX = Math.round(baseX + ev.clientX - startX);
      const finalY = Math.round(baseY + ev.clientY - startY);
      setDrag(null);
      setValue(`${k}.dx`, finalX === 0 ? null : String(finalX), { label: `${label} (posição X)`, kind: 'text' });
      setValue(`${k}.dy`, finalY === 0 ? null : String(finalY), { label: `${label} (posição Y)`, kind: 'text' });
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };

  return { dx, dy, dragProps: editMode ? { onPointerDown: startDrag } : {} };
}

/** Alça flutuante "arrastar pra posicionar" — só existe em modo edição.
 * Posicionar via `style` num canto livre; arrastar ela move o elemento
 * (o chamador aplica `transform: translate(dx,dy)` usando o retorno de
 * `useEditOffset`), não a alça em si. */
export function OffsetDragHandle({ k, label, style }: { k: string; label: string; style?: CSSProperties }) {
  const { editMode } = useEditorStore();
  const { dragProps } = useEditOffset(k, label);
  if (!editMode) return null;
  return (
    <div
      data-editor-ui
      {...dragProps}
      className="absolute z-30 flex items-center justify-center rounded-full hover:brightness-110 transition"
      style={{ width: 36, height: 36, ...glass, color: '#00e4ff', cursor: 'grab', touchAction: 'none', ...style }}
      title="Arrastar pra ajustar a posição — só nesta versão de tela (Mobile/Tablet/Desktop)"
    >
      <Move size={16} />
    </div>
  );
}

/** px arrastados na horizontal por 1% de escala — menor = mais sensível
 * (mesma ideia dos ajustes de "força" do tilt do Hero, constante única
 * fácil de achar se precisar recalibrar). */
const SCALE_DRAG_SENSITIVITY = 3;

/** Redimensiona um elemento (`transform: scale`) arrastando uma alça
 * dedicada — mesma gaveta por dispositivo e mesmo motivo de alça separada
 * do `useEditOffset` (não conflitar com o clique-pra-editar do elemento).
 * Chave-satélite `${k}.scale` (percentual, "100" = tamanho original).
 * `min`/`max` limitam o quanto dá pra encolher/ampliar (padrão 50%–200%). */
export function useEditScale(k: string, label: string, opts?: { min?: number; max?: number }): { scale: number; dragProps: Record<string, unknown> } {
  const { get, setValue, editMode } = useEditorStore();
  const min = opts?.min ?? 50;
  const max = opts?.max ?? 200;
  const scaleBase = +useDeviceScopedValue(`${k}.scale`, '100') || 100;
  const [drag, setDrag] = useState<number | null>(null);
  const scale = drag ?? scaleBase;

  const clamp = (v: number) => Math.min(max, Math.max(min, Math.round(v)));

  const startDrag = (e: RPointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;
    const baseScale = +get(`${k}.scale`, '100') || 100;
    const move = (ev: PointerEvent) => setDrag(clamp(baseScale + (ev.clientX - startX) / SCALE_DRAG_SENSITIVITY));
    const up = (ev: PointerEvent) => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      const final = clamp(baseScale + (ev.clientX - startX) / SCALE_DRAG_SENSITIVITY);
      setDrag(null);
      setValue(`${k}.scale`, final === 100 ? null : String(final), { label: `${label} (tamanho)`, kind: 'text' });
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };

  return { scale, dragProps: editMode ? { onPointerDown: startDrag } : {} };
}

/** Alça flutuante "arrastar pra redimensionar" — só existe em modo
 * edição. Posicionar via `style` num canto livre; arrastar pra
 * direita/esquerda aumenta/diminui (o chamador aplica `transform:
 * scale(...)` usando o retorno de `useEditScale`), não a alça em si. */
export function ScaleDragHandle({ k, label, style }: { k: string; label: string; style?: CSSProperties }) {
  const { editMode } = useEditorStore();
  const { scale, dragProps } = useEditScale(k, label);
  if (!editMode) return null;
  return (
    <div
      data-editor-ui
      {...dragProps}
      className="absolute z-30 flex items-center justify-center rounded-full hover:brightness-110 transition"
      style={{ width: 36, height: 36, ...glass, color: '#d2e718', cursor: 'ew-resize', touchAction: 'none', ...style }}
      title={`Arrastar pra ajustar o tamanho (${scale}%) — só nesta versão de tela (Mobile/Tablet/Desktop)`}
    >
      <Maximize2 size={16} />
    </div>
  );
}

interface EImgProps {
  k: string;
  v: string;
  l: string;
  spec: ImageSpec;
  alt?: string;
  className?: string;
  style?: CSSProperties;
}

/** Imagem editável, com variante opcional por dispositivo (chaves-satélite
 * `${k}.tablet`/`${k}.mobile` — mesmo padrão de `.w`/`.lh` do ERich, sem
 * override elas simplesmente não existem e a imagem de sempre é usada).
 * Sem nenhuma variante definida (o caso de ~100% das imagens do site hoje),
 * renderiza um `<img>` puro, idêntico ao de antes — zero mudança de
 * comportamento. Com variante, vira um `<picture>` com media query nos
 * mesmos pontos de quebra do Tailwind (`DEVICE_BREAKPOINTS`) — a troca
 * acontece via CSS, sem JS, então funciona igual no HTML pré-renderizado. */
export function EImg({ k, v, l, spec, alt = '', className, style }: EImgProps) {
  const { get, editMode, openPanel } = useEditorStore();
  const desktopSrc = get(k, v);
  const tabletSrc = get(`${k}.tablet`, '');
  const mobileSrc = get(`${k}.mobile`, '');
  const openImagePanel = (e: MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    openPanel({ type: 'image', key: k, label: l, fallback: v, spec });
  };

  if (!tabletSrc && !mobileSrc) {
    return (
      <img
        src={desktopSrc} alt={alt} className={className} style={style}
        width={spec.w} height={spec.h}
        data-eimg={editMode ? '' : undefined}
        onClick={editMode ? openImagePanel : undefined}
      />
    );
  }

  return (
    <picture data-eimg={editMode ? '' : undefined} onClick={editMode ? openImagePanel : undefined}>
      {mobileSrc && <source media={`(max-width: ${DEVICE_BREAKPOINTS.mobileMax}px)`} srcSet={mobileSrc} />}
      {tabletSrc && <source media={`(min-width: ${DEVICE_BREAKPOINTS.mobileMax + 1}px) and (max-width: ${DEVICE_BREAKPOINTS.tabletMax}px)`} srcSet={tabletSrc} />}
      <img src={desktopSrc} alt={alt} className={className} style={style} width={spec.w} height={spec.h} />
    </picture>
  );
}

/** Imagem editável aplicada como background CSS — não dá pra usar
 * `<picture>` num background, então a variante por dispositivo é resolvida
 * via JS (`useDeviceBreakpoint`), nos MESMOS pontos de quebra. */
export function useEditImage(k: string, v: string, l: string, spec: ImageSpec): [string, Record<string, unknown>] {
  const { get, editMode, openPanel } = useEditorStore();
  const device = useDeviceBreakpoint();
  const desktopSrc = get(k, v);
  const tabletSrc = get(`${k}.tablet`, '');
  const mobileSrc = get(`${k}.mobile`, '');
  const src = device === 'mobile' && mobileSrc ? mobileSrc : device === 'tablet' && tabletSrc ? tabletSrc : desktopSrc;
  const props = editMode ? {
    'data-eimg': '',
    onClick: (e: MouseEvent) => {
      e.stopPropagation();
      openPanel({ type: 'image', key: k, label: l, fallback: v, spec });
    },
  } : {};
  return [src, props];
}

/** Chip flutuante "trocar imagem de fundo" — pra bgs cobertos pelo conteúdo
 * (ex.: hero), onde clicar direto na imagem é difícil. Só existe em modo edição. */
export function BgEditChip({ k, v, l, spec, style }: { k: string; v: string; l: string; spec: ImageSpec; style?: CSSProperties }) {
  const { editMode, openPanel } = useEditorStore();
  if (!editMode) return null;
  return (
    <button
      data-editor-ui
      onClick={(e) => { e.stopPropagation(); openPanel({ type: 'image', key: k, label: l, fallback: v, spec }); }}
      className="absolute z-30 flex items-center gap-2 rounded-full px-4 hover:brightness-110 transition"
      style={{ height: 36, ...glass, fontFamily: 'Inter', fontWeight: 500, fontSize: 12.5, color: '#fff', ...style }}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00e4ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
      </svg>
      Trocar imagem de fundo
    </button>
  );
}

/* ---------- Ícone (Lucide ou SVG enviado) ---------- */

export interface IconOverride {
  kind: 'lucide' | 'img';
  name?: string;
  url?: string;
  size: number;
  stroke: number;
  color?: string;
}

export function parseIconValue(v: string): IconOverride | null {
  if (v.startsWith('lucide:')) {
    const [, name, size, stroke, color] = v.split(':');
    return { kind: 'lucide', name, size: +size || 24, stroke: +stroke || 2, color: color || undefined };
  }
  if (v.startsWith('img|')) {
    const [, size, url] = v.split('|');
    return { kind: 'img', url, size: +size || 24, stroke: 2 };
  }
  return null;
}

interface EIconProps {
  k: string;
  l: string;
  children: ReactNode;   // ícone/SVG original do design
  defaultSize?: number;
  className?: string;
  style?: CSSProperties;
}

export function EIcon({ k, l, children, defaultSize = 24, className, style }: EIconProps) {
  const { get, editMode, openPanel } = useEditorStore();
  const parsed = parseIconValue(get(k, ''));

  let content: ReactNode = children;
  if (parsed?.kind === 'lucide' && parsed.name && LUCIDE_CHOICES[parsed.name]) {
    const Cmp = LUCIDE_CHOICES[parsed.name];
    content = <Cmp size={parsed.size} strokeWidth={parsed.stroke} color={parsed.color ?? 'currentColor'} />;
  } else if (parsed?.kind === 'img' && parsed.url) {
    content = <img src={parsed.url} alt="" style={{ width: parsed.size, height: parsed.size, objectFit: 'contain' }} />;
  }

  return (
    <span
      data-eicon={editMode ? '' : undefined}
      className={className}
      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', ...style }}
      onClick={editMode ? (e) => {
        e.stopPropagation();
        e.preventDefault();
        openPanel({ type: 'icon', key: k, label: l, defaultSize });
      } : undefined}
    >
      {content}
    </span>
  );
}

/* ---------- Cores (fundos de seções e cards) ---------- */

export interface ColorDef { key: string; label: string; fallback: string }

export function useEditColors(title: string, defs: ColorDef[]): [string[], Record<string, unknown>] {
  const { get, editMode, openPanel } = useEditorStore();
  const values = defs.map((d) => get(d.key, d.fallback));
  const props = editMode ? {
    'data-esurface': '',
    onClick: (e: MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      openPanel({ type: 'colors', title, fields: defs });
    },
  } : {};
  return [values, props];
}

export function useEditColor(key: string, fallback: string, label: string, title?: string): [string, Record<string, unknown>] {
  const [values, props] = useEditColors(title ?? label, [{ key, label, fallback }]);
  return [values[0], props];
}

/* ---------- Estilo de botão (cor de fundo + link, no mesmo clique/painel) ---------- */

export interface ButtonStyleValue {
  bg: string;
  circleBg: string;
  /** '' = sem override — o botão usa o comportamento padrão (to/onClick já existente) */
  href: string;
  target: '_self' | '_blank';
}

/** Cor de fundo do botão + cor do círculo + link (externo ou página do site),
 * combinados no mesmo painel/clique — pedido explícito do Bruno. Sem
 * override de link, `href` volta vazio e o HubButton usa seu comportamento
 * padrão de sempre. */
export function useButtonStyle(key: string, label: string, colorFallback: string, circleFallback = 'rgba(0,0,0,0.1)'): [ButtonStyleValue, Record<string, unknown>] {
  const { get, editMode, openPanel } = useEditorStore();
  const bg = get(`${key}.bg`, colorFallback);
  const circleBg = get(`${key}.circleBg`, circleFallback);
  const href = get(`${key}.href`, '');
  const target = get(`${key}.target`, '_self') === '_blank' ? '_blank' : '_self';
  const props = editMode ? {
    'data-ebuttonstyle': '',
    onClick: (e: MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      openPanel({ type: 'buttonStyle', key, label, colorFallback, circleFallback });
    },
  } : {};
  return [{ bg, circleBg, href, target }, props];
}
