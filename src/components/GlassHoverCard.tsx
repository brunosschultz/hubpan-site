import { useLayoutEffect } from 'react';
import type { ReactNode } from 'react';
import gsap from 'gsap';
import { useTilt } from './useTilt';

export type HoverColor = 'white' | 'lime' | 'blue';

const TARGET = {
  white: { bg: '#ffffff', border: '#ecedf0', title: '#152852', desc: '#797979', tag: '#2d4ebf', circleBg: '#152852', iconColor: '#d2e718' },
  lime: { bg: '#d2e718', border: 'rgba(21,40,82,0.15)', title: '#152852', desc: 'rgba(21,40,82,0.75)', tag: '#152852', circleBg: '#152852', iconColor: '#d2e718' },
  blue: { bg: '#2d4ebf', border: 'rgba(255,255,255,0.2)', title: '#ffffff', desc: 'rgba(255,255,255,0.85)', tag: '#d2e718', circleBg: '#d2e718', iconColor: '#152852' },
} as const;

const BASE = { bg: 'rgba(255,255,255,0.06)', border: 'rgba(255,255,255,0.12)', title: '#ffffff', desc: 'rgba(255,255,255,0.78)', tag: '#d2e718', circleBg: 'rgba(210,231,24,0.12)', iconColor: '#d2e718' };

interface GlassHoverCardProps {
  /** cor para a qual o card recolore no hover — alterne white/lime/blue entre os cards de uma grade pra variar o visual */
  hoverColor: HoverColor;
  icon: ReactNode;
  tag?: ReactNode;
  titulo: ReactNode;
  desc: ReactNode;
  itens?: ReactNode[];
  className?: string;
}

/**
 * Card glass translúcido sobre fundo escuro — no hover recolore inteiro (fundo,
 * título, texto, círculo do ícone) pra uma das cores do DS, com tilt de
 * perspectiva. Mesmo padrão do GovCard da Governança Global (institucional).
 * Não usar número gigante de fundo como marca d'água — vira ruído visual.
 */
export default function GlassHoverCard({ hoverColor, icon, tag, titulo, desc, itens, className = '' }: GlassHoverCardProps) {
  const tiltRef = useTilt<HTMLDivElement>(6, 8);

  useLayoutEffect(() => {
    const el = tiltRef.current;
    if (!el) return;
    const q = gsap.utils.selector(el);
    const t = TARGET[hoverColor];
    const D = 0.35;
    const targets = () => [...q('.ghc-title'), ...q('.ghc-desc'), ...q('.ghc-tag'), ...q('.ghc-item')];
    const enter = () => {
      gsap.to(el, { backgroundColor: t.bg, borderColor: t.border, duration: D, ease: 'power2.out' });
      gsap.to(q('.ghc-title'), { color: t.title, duration: D, ease: 'power2.out' });
      gsap.to(q('.ghc-desc'), { color: t.desc, duration: D, ease: 'power2.out' });
      gsap.to(q('.ghc-tag'), { color: t.tag, duration: D, ease: 'power2.out' });
      gsap.to(q('.ghc-item'), { color: t.desc, duration: D, ease: 'power2.out' });
      gsap.to(q('.ghc-dot'), { backgroundColor: t.tag, duration: D, ease: 'power2.out' });
      gsap.to(q('.ghc-circle'), { backgroundColor: t.circleBg, color: t.iconColor, duration: D, ease: 'power2.out' });
    };
    const leave = () => {
      gsap.to(el, { backgroundColor: BASE.bg, borderColor: BASE.border, duration: 0.45, ease: 'power2.out' });
      gsap.to(q('.ghc-title'), { color: BASE.title, duration: 0.45, ease: 'power2.out' });
      gsap.to(q('.ghc-desc'), { color: BASE.desc, duration: 0.45, ease: 'power2.out' });
      gsap.to(q('.ghc-tag'), { color: BASE.tag, duration: 0.45, ease: 'power2.out' });
      gsap.to(q('.ghc-item'), { color: BASE.desc, duration: 0.45, ease: 'power2.out' });
      gsap.to(q('.ghc-dot'), { backgroundColor: '#d2e718', duration: 0.45, ease: 'power2.out' });
      gsap.to(q('.ghc-circle'), { backgroundColor: BASE.circleBg, color: BASE.iconColor, duration: 0.45, ease: 'power2.out' });
    };
    el.addEventListener('mouseenter', enter);
    el.addEventListener('mouseleave', leave);
    return () => {
      el.removeEventListener('mouseenter', enter);
      el.removeEventListener('mouseleave', leave);
      gsap.killTweensOf([el, ...targets()]);
    };
  }, [tiltRef, hoverColor]);

  return (
    <div
      ref={tiltRef}
      className={`rounded-[20px] p-7 lg:p-8 flex flex-col cursor-default ${className}`}
      style={{ backdropFilter: 'blur(15px)', WebkitBackdropFilter: 'blur(15px)', background: BASE.bg, border: `1px solid ${BASE.border}` }}
      data-animate
    >
      <span className="ghc-circle flex items-center justify-center rounded-full mb-6" style={{ width: 52, height: 52, background: BASE.circleBg, color: BASE.iconColor }}>
        {icon}
      </span>
      {tag && <p className="ghc-tag mb-2" style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 10.5, letterSpacing: '1.8px', textTransform: 'uppercase', color: BASE.tag }}>{tag}</p>}
      <h3 className="ghc-title mb-3" style={{ fontFamily: 'Luxenta', fontWeight: 600, fontSize: 21, lineHeight: 1.1, color: BASE.title }}>{titulo}</h3>
      <p className="ghc-desc" style={{ fontFamily: 'Inter', fontSize: 14, lineHeight: '23px', color: BASE.desc }}>{desc}</p>
      {itens && (
        <ul className="space-y-2 mt-5 pt-5 border-t" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
          {itens.map((it, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="ghc-dot mt-[8px] w-[5px] h-[5px] rounded-full shrink-0" style={{ background: '#d2e718' }} />
              <span className="ghc-item" style={{ fontFamily: 'Inter', fontSize: 13, lineHeight: '20px', color: BASE.desc }}>{it}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
