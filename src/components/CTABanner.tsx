import type { ReactNode } from 'react';
import { useReveal } from './useReveal';

/**
 * Banner de CTA no fim das páginas internas — fundo hubblue full-bleed,
 * título Luxenta à esquerda e botões à direita.
 */
export default function CTABanner({ title, sub, actions }: { title: ReactNode; sub?: string; actions: ReactNode }) {
  const ref = useReveal<HTMLElement>();

  return (
    <section ref={ref} className="w-full bg-hubblue">
      <div className="gutter py-16 lg:py-20 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div data-animate>
          <h2 className="text-white" style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 'clamp(28px,3vw,44px)', lineHeight: 1, letterSpacing: '-0.5px', maxWidth: 640 }}>
            {title}
          </h2>
          {sub && (
            <p className="mt-3" style={{ fontFamily: 'Inter', fontSize: 16, lineHeight: '26px', color: 'rgba(255,255,255,0.75)', maxWidth: 560 }}>{sub}</p>
          )}
        </div>
        <div className="flex flex-wrap gap-4 shrink-0" data-animate>
          {actions}
        </div>
      </div>
    </section>
  );
}
