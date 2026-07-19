import { useLayoutEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import gsap from 'gsap';
import { useReveal } from './useReveal';

/* ═══════════ Contador animado (conta de 0 até o valor ao entrar na viewport) ═══════════ */

export function Counter({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((es) => {
      if (es.some((e) => e.isIntersecting)) {
        io.disconnect();
        const obj = { v: 0 };
        gsap.to(obj, {
          v: value, duration: 1.4, ease: 'power2.out', delay: 0.15,
          onUpdate: () => { el.textContent = prefix + String(Math.round(obj.v)) + suffix; },
        });
      }
    });
    io.observe(el);
    return () => io.disconnect();
  }, [value, prefix, suffix]);
  return <span ref={ref}>{prefix}0{suffix}</span>;
}

/* ═══════════ Hero 80vh (imagem) + faixa de números 20vh (cor variável por página) ═══════════ */

export interface HeroStat {
  value: number | string;
  prefix?: string;
  suffix?: string;
  label: string;
  /** valor em destaque — usa a cor accent do tema da faixa */
  accent?: boolean;
}

export interface StripTheme {
  bg: string;
  num: string;
  accent: string;
  /** peso do valor em destaque (padrão 400) — usado quando o destaque é só peso, ex. faixa lime */
  accentWeight?: number;
  label: string;
  divider: string;
  borderTop?: string;
}

/** Temas prontos da faixa de números — tabela do DESIGN-SYSTEM.md §5.5.5 */
export const STRIP_THEMES: Record<'navy900' | 'blue' | 'navy' | 'lime' | 'light', StripTheme> = {
  navy900: { bg: '#060919', num: '#fff', accent: '#d2e718', label: '#a7a4a4', divider: 'rgba(255,255,255,0.1)', borderTop: '1px solid rgba(255,255,255,0.1)' },
  blue:    { bg: '#2d4ebf', num: '#fff', accent: '#d2e718', label: 'rgba(255,255,255,0.6)', divider: 'rgba(255,255,255,0.16)', borderTop: '1px solid rgba(255,255,255,0.16)' },
  navy:    { bg: '#152852', num: '#fff', accent: '#00e4ff', label: 'rgba(255,255,255,0.55)', divider: 'rgba(255,255,255,0.12)', borderTop: '1px solid rgba(255,255,255,0.12)' },
  lime:    { bg: '#d2e718', num: '#152852', accent: '#152852', accentWeight: 600, label: 'rgba(21,40,82,0.6)', divider: 'rgba(21,40,82,0.15)', borderTop: '1px solid rgba(21,40,82,0.15)' },
  light:   { bg: '#f5f5f5', num: '#152852', accent: '#2d4ebf', label: '#797979', divider: 'rgba(21,40,82,0.1)', borderTop: '1px solid rgba(21,40,82,0.1)' },
};

interface Hero80Props {
  img: string;
  imgAlt?: string;
  eyebrow: string;
  /** Use <br /> pra quebras manuais e <span style={{color:'#d2e718'}}> no trecho lime */
  title: ReactNode;
  sub: ReactNode;
  /** conteúdo extra abaixo do sub (ex: selo de parceria) — opcional */
  badge?: ReactNode;
  actions?: ReactNode;
  stats: HeroStat[];
  strip: StripTheme;
  /** posição do foco da imagem (object-position) */
  imgPosition?: string;
}

/** Grid responsivo conforme a quantidade real de stats — nem toda página tem 6 */
function statsGridClass(n: number): string {
  if (n <= 3) return 'grid-cols-3';
  if (n === 4) return 'grid-cols-2 sm:grid-cols-4';
  if (n === 5) return 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5';
  return 'grid-cols-3 lg:grid-cols-6';
}

export default function Hero80({ img, imgAlt = '', eyebrow, title, sub, badge, actions, stats, strip, imgPosition }: Hero80Props) {
  const ref = useReveal<HTMLElement>();
  return (
    <section ref={ref} className="relative w-full">
      <div className="relative w-full h-[80vh] min-h-[560px] flex items-center overflow-hidden">
        <img src={img} alt={imgAlt} className="absolute inset-0 w-full h-full object-cover" style={imgPosition ? { objectPosition: imgPosition } : undefined} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(6,9,25,0.93) 0%, rgba(6,9,25,0.72) 45%, rgba(6,9,25,0.35) 100%)' }} />
        <div className="absolute inset-x-0 bottom-0 h-40" style={{ background: 'linear-gradient(to top, rgba(6,9,25,0.9), transparent)' }} />

        <div className="relative gutter w-full pt-[150px] lg:pt-[190px] pb-12">
          {/* Rótulo no padrão do hero da home: Inter 500 13px, tracking 5.85px, branco 50% */}
          <p className="text-[13px] font-medium uppercase mb-6" style={{ fontFamily: 'Inter', letterSpacing: '5.85px', color: 'rgba(255,255,255,0.5)' }} data-animate>
            {eyebrow}
          </p>
          <h1 className="mb-7 text-white" style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 'clamp(32px, 3vw + 18px, 62px)', lineHeight: 1, letterSpacing: '-1.2px' }} data-animate>
            {title}
          </h1>
          <p className="mb-9" style={{ fontFamily: 'Inter', fontSize: 17, lineHeight: '29px', color: '#d6d6d6', maxWidth: 660 }} data-animate>
            {sub}
          </p>
          {actions && <div className="flex flex-wrap gap-4 mb-8" data-animate>{actions}</div>}
          {badge && <div data-animate>{badge}</div>}
        </div>
      </div>

      {/* Faixa de números — 20vh, cor por página (DESIGN-SYSTEM.md §5.5.5) */}
      <div className="w-full h-[20vh] min-h-[150px] flex items-center" style={{ background: strip.bg, borderTop: strip.borderTop }}>
        <div className="gutter w-full">
          <div className={`grid ${statsGridClass(stats.length)} gap-y-6`}>
            {stats.map((s, i) => (
              <div key={s.label} className="text-center px-2" style={i > 0 ? { borderLeft: `1px solid ${strip.divider}` } : undefined}>
                <p style={{
                  fontFamily: 'Luxenta',
                  fontWeight: s.accent ? (strip.accentWeight ?? 400) : 400,
                  fontSize: 'clamp(34px, 3vw, 56px)',
                  lineHeight: 1,
                  color: s.accent ? strip.accent : strip.num,
                }}>
                  {typeof s.value === 'number' ? <Counter value={s.value} prefix={s.prefix ?? ''} suffix={s.suffix ?? ''} /> : s.value}
                </p>
                <p className="mt-2" style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 10.5, letterSpacing: '1.6px', textTransform: 'uppercase', color: strip.label }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
