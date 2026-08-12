import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import ArrowIcon from './ArrowIcon';
import { EIcon } from '../editor/fields';
import { useEditorStore } from '../editor/store';

type Size = 'lg' | 'md' | 'sm' | 'xs';
type Variant = 'blue' | 'lime' | 'navy' | 'cyan' | 'outline-light' | 'outline-dark';

/** Fallback padrão pra qualquer botão/CTA sem destino próprio de verdade
 * (nenhuma página/seção real pra apontar) — pedido explícito do Bruno.
 * Pode mudar mais pra frente; ele avisa quando isso acontecer. */
export const WHATSAPP_URL = 'https://api.whatsapp.com/send/?phone=%2B5511914018533&text=Ol%C3%A1%21+Gostaria+de+receber+mais+informa%C3%A7%C3%B5es+sobre+o+HUB+PAN.&type=phone_number&app_absent=0';

/** Vídeo institucional do HUB PAN no YouTube — "HUB PAN | Onde o Futuro se
 * Conecta", canal @hubpan (link enviado pelo cliente em 06/08/2026).
 * Centralizado aqui, como o WhatsApp: se o vídeo for trocado, muda num
 * lugar só e vale pra todos os botões que apontam pra ele.
 * ATENÇÃO: é o vídeo institucional do HUB PAN como um todo — NÃO é o vídeo
 * de uma EXPO específica. Os cards de vídeo da página EXPOs seguem
 * aguardando os vídeos próprios de cada edição. */
export const VIDEO_INSTITUCIONAL_URL = 'https://www.youtube.com/watch?v=nepTzvtGtSo';

interface HubButtonProps {
  children: ReactNode;
  size?: Size;
  variant?: Variant;
  withIcon?: boolean;
  /** Sobrescreve a cor de fundo do círculo (ex: lime nos botões do Manifesto/ProInter) */
  circleColor?: string;
  /** Sobrescreve a cor da seta */
  arrowColor?: string;
  /** Sobrescreve a cor do texto do botão */
  textColor?: string;
  /** Sobrescreve o diâmetro do círculo (px) — ex: botões "Explorar" dos cards de plataforma têm círculo maior que o padrão da escala */
  circleSize?: number;
  /** Sobrescreve o tamanho da seta (px) */
  arrowSize?: number;
  /** Ícone customizado no lugar da seta (ex: Play) — sobrescreve `iconKey` se os dois forem passados */
  icon?: ReactNode;
  /** Chave editável do ícone (abre o seletor de ícones Lucide no editor) —
   * cada botão do site precisa de uma chave única. Sem essa prop, o botão
   * continua com a seta fixa de sempre (compatível com uso já existente). */
  iconKey?: string;
  /** Rótulo mostrado no painel do editor pra esse ícone — obrigatório junto com `iconKey` */
  iconLabel?: string;
  /** Chave editável de cor de fundo + link (abre os dois no mesmo painel/clique).
   * Sem essa prop, o fundo do botão continua fixo pela `variant` e o botão
   * continua 100% como hoje — compatível com uso já existente. */
  styleKey?: string;
  /** Rótulo mostrado no painel do editor — obrigatório junto com `styleKey` */
  styleLabel?: string;
  /** Botão de ENVIO DE FORMULÁRIO de verdade (ex: Contato, GovIA demonstração) —
   * ganha cor editável junto com `styleKey`, mas nunca a opção de link (isso
   * substituiria o envio do formulário). */
  noLink?: boolean;
  className?: string;
  onClick?: () => void;
  as?: 'button' | 'a';
  href?: string;
  /** Caminho interno padrão (react-router) — substitui envolver o `<HubButton>`
   * externamente com `<Link to="...">`; precisa viver dentro do componente
   * pra o link poder ser sobrescrito pelo editor via `styleKey`. */
  to?: string;
}

// Proporções exatas do Figma por escala
const SCALES: Record<Size, {
  height: number; pl: number; pr: number; gap: number;
  circle: number; arrow: number; text: number;
}> = {
  lg: { height: 62, pl: 40, pr: 10, gap: 15, circle: 36, arrow: 13, text: 18 },
  md: { height: 52, pl: 34, pr: 8, gap: 13, circle: 30, arrow: 11, text: 15 },
  sm: { height: 45, pl: 29, pr: 7, gap: 11, circle: 26, arrow: 9, text: 13 },
  xs: { height: 34, pl: 22, pr: 5, gap: 8, circle: 20, arrow: 7, text: 12 },
};

// Fundo escuro → seta branca; fundo claro → seta navy
const VARIANTS: Record<Variant, { bg: string; text: string; arrow: string; border?: string }> = {
  blue: { bg: '#2d4ebf', text: '#ffffff', arrow: '#ffffff' },
  lime: { bg: '#d2e718', text: '#152852', arrow: '#152852' },
  navy: { bg: '#152852', text: '#ffffff', arrow: '#ffffff' },
  cyan: { bg: '#00e4ff', text: '#152852', arrow: '#152852' },
  'outline-light': { bg: 'transparent', text: '#ffffff', arrow: '#ffffff', border: '1px solid rgba(255,255,255,0.7)' },
  'outline-dark': { bg: 'transparent', text: '#152852', arrow: '#152852', border: '1px solid rgba(21,40,82,0.3)' },
};

export default function HubButton({
  children,
  size = 'lg',
  variant = 'blue',
  withIcon = true,
  circleColor,
  arrowColor,
  textColor,
  circleSize,
  arrowSize,
  icon,
  iconKey,
  iconLabel,
  styleKey,
  styleLabel,
  noLink,
  className = '',
  onClick,
  as = 'button',
  href,
  to,
}: HubButtonProps) {
  const { get, editMode, openPanel } = useEditorStore();
  const s = SCALES[size];
  const v = VARIANTS[variant];
  const defaultArrow = <ArrowIcon color={arrowColor ?? v.arrow} size={arrowSize ?? s.arrow} />;
  const resolvedIcon = icon ?? (iconKey ? (
    <EIcon k={iconKey} l={iconLabel ?? 'Ícone do botão'} defaultSize={arrowSize ?? s.arrow}>
      {defaultArrow}
    </EIcon>
  ) : defaultArrow);

  const circleFallback = circleColor ?? 'rgba(0,0,0,0.1)';
  const bg = styleKey ? get(`${styleKey}.bg`, v.bg) : v.bg;
  const circleBg = styleKey ? get(`${styleKey}.circleBg`, circleFallback) : circleFallback;
  const linkHref = styleKey && !noLink ? get(`${styleKey}.href`, '') : '';
  const linkTarget = get(`${styleKey}.target`, '_self') === '_blank' ? '_blank' : '_self';

  /* Efeito "swap" no hover (baseado no button-01 do shadcn/ui — só o efeito
   * visual foi portado, o projeto não usa shadcn/ui de verdade): o círculo
   * do ícone desliza pro lado esquerdo (via `right` de 100%) e o texto troca
   * de padding com ele, como se os dois cruzassem de posição. `circleD`
   * (diâmetro) entra na conta da posição "voada" do círculo — precisa do
   * valor renderizado de verdade (`circleSize` sobrescrito ou o da escala),
   * não só do valor da escala. Só se aplica com ícone — botão sem ícone
   * (`withIcon=false`) continua uma pill simples, sem essa troca. */
  const circleD = circleSize ?? s.circle;
  const swapVars = withIcon ? ({
    '--btn-pl': `${s.pl}px`,
    '--btn-pr': `${circleD + s.gap + s.pr}px`,
    '--btn-pl-hover': `${circleD + s.gap + s.pr}px`,
    '--btn-pr-hover': `${s.pl}px`,
    '--btn-circle-right': `${s.pr}px`,
    '--btn-circle-right-hover': `calc(100% - ${circleD + s.pr}px)`,
  } as React.CSSProperties) : {};

  const style: React.CSSProperties = {
    height: s.height,
    borderRadius: 100,
    fontSize: s.text,
    fontWeight: 500,
    fontFamily: 'Inter, sans-serif',
    display: 'inline-flex',
    alignItems: 'center',
    background: bg,
    color: textColor ?? v.text,
    border: v.border ?? 'none',
    whiteSpace: 'nowrap',
    ...(withIcon
      ? swapVars
      : { paddingLeft: s.pl, paddingRight: s.pl, transition: 'filter 200ms ease-out' }),
  };

  const circle: React.CSSProperties = {
    width: circleD,
    height: circleD,
    borderRadius: '50%',
    background: circleBg,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  };

  const content = (
    <>
      <span className={withIcon ? 'hub-btn-label' : undefined}>{children}</span>
      {withIcon && (
        <span className="hub-btn-circle" style={circle}>
          {resolvedIcon}
        </span>
      )}
    </>
  );

  const sharedClassName = `hover:brightness-95 active:brightness-90 ${withIcon ? 'hub-btn' : ''} ${className}`;

  /* Modo edição com styleKey: o clique (fora do ícone/texto, que já têm seus
     próprios painéis) sempre abre o painel de cor+link — nunca dispara a
     ação real (navegar/rolar/enviar formulário). */
  if (styleKey && editMode) {
    return (
      <button
        style={style}
        className={sharedClassName}
        data-ebuttonstyle=""
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          openPanel({ type: 'buttonStyle', key: styleKey, label: styleLabel ?? 'Botão', colorFallback: v.bg, circleFallback, linkEditable: !noLink });
        }}
      >
        {content}
      </button>
    );
  }

  /* Link sobrescrito pelo editor: ignora `to`/`onClick` de sempre e navega/
     abre de verdade pro destino escolhido. */
  if (linkHref) {
    const isExternal = /^https?:\/\//i.test(linkHref);
    if (isExternal || linkTarget === '_blank') {
      return <a href={linkHref} target={linkTarget} rel={linkTarget === '_blank' ? 'noreferrer' : undefined} style={style} className={sharedClassName}>{content}</a>;
    }
    return <Link to={linkHref} style={style} className={sharedClassName}>{content}</Link>;
  }

  /* Sem override: comportamento padrão de sempre — inalterado. */
  const commonProps = { style, className: sharedClassName, onClick };
  if (as === 'a') {
    const isExternal = /^https?:\/\//i.test(href ?? '');
    return <a href={href} target={isExternal ? '_blank' : undefined} rel={isExternal ? 'noreferrer' : undefined} {...commonProps}>{content}</a>;
  }
  if (to) return <Link to={to} {...commonProps}>{content}</Link>;
  return <button {...commonProps}>{content}</button>;
}
