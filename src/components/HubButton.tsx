import type { ReactNode } from 'react';
import ArrowIcon from './ArrowIcon';
import { EIcon } from '../editor/fields';

type Size = 'lg' | 'md' | 'sm' | 'xs';
type Variant = 'blue' | 'lime' | 'navy' | 'cyan' | 'outline-light' | 'outline-dark';

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
  className?: string;
  onClick?: () => void;
  as?: 'button' | 'a';
  href?: string;
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
  className = '',
  onClick,
  as = 'button',
  href,
}: HubButtonProps) {
  const s = SCALES[size];
  const v = VARIANTS[variant];
  const defaultArrow = <ArrowIcon color={arrowColor ?? v.arrow} size={arrowSize ?? s.arrow} />;
  const resolvedIcon = icon ?? (iconKey ? (
    <EIcon k={iconKey} l={iconLabel ?? 'Ícone do botão'} defaultSize={arrowSize ?? s.arrow}>
      {defaultArrow}
    </EIcon>
  ) : defaultArrow);

  const style: React.CSSProperties = {
    height: s.height,
    borderRadius: 100,
    fontSize: s.text,
    fontWeight: 500,
    fontFamily: 'Inter, sans-serif',
    display: 'inline-flex',
    alignItems: 'center',
    gap: withIcon ? s.gap : 0,
    paddingLeft: s.pl,
    paddingRight: withIcon ? s.pr : s.pl,
    background: v.bg,
    color: textColor ?? v.text,
    border: v.border ?? 'none',
    whiteSpace: 'nowrap',
    transition: 'filter 200ms ease-out, transform 200ms ease-out',
  };

  const circle: React.CSSProperties = {
    width: circleSize ?? s.circle,
    height: circleSize ?? s.circle,
    borderRadius: '50%',
    background: circleColor ?? 'rgba(0,0,0,0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  };

  const content = (
    <>
      <span>{children}</span>
      {withIcon && (
        <span style={circle}>
          {resolvedIcon}
        </span>
      )}
    </>
  );

  const commonProps = {
    style,
    className: `hover:brightness-95 active:brightness-90 ${className}`,
    onClick,
  };

  if (as === 'a') {
    return <a href={href} {...commonProps}>{content}</a>;
  }
  return <button {...commonProps}>{content}</button>;
}
