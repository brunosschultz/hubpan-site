import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useReveal } from './useReveal';

interface Crumb {
  label: string;
  to?: string;
}

interface PageHeroProps {
  /** Trilha de navegação — o último item é a página atual (sem link) */
  breadcrumb: Crumb[];
  eyebrow: string;
  /** Título — use <span> com cor lime (#d2e718) para os trechos de destaque */
  title: ReactNode;
  sub?: ReactNode;
  /** CTAs (HubButtons) exibidos abaixo do texto */
  actions?: ReactNode;
  /** Conteúdo opcional à direita (número gigante, imagem, card) — some no mobile */
  aside?: ReactNode;
}

/**
 * Hero escuro padrão das páginas internas: fundo navy900 + grade sutil,
 * breadcrumb, rótulo, título Luxenta 65px e CTAs. A NavBar global (absoluta)
 * fica por cima — por isso o padding-top alto.
 */
export default function PageHero({ breadcrumb, eyebrow, title, sub, actions, aside }: PageHeroProps) {
  const ref = useReveal<HTMLElement>();

  return (
    <section ref={ref} className="relative w-full bg-navy900 overflow-hidden">
      {/* Grade decorativa sutil */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.035) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
      <div className="relative gutter pt-[180px] lg:pt-[240px] pb-16 lg:pb-20">
        {/* Breadcrumb */}
        <p className="mb-8" style={{ fontFamily: 'Inter', fontSize: 13, color: 'rgba(255,255,255,0.4)' }} data-animate>
          {breadcrumb.map((c, i) => (
            <span key={i}>
              {c.to ? (
                <Link to={c.to} className="hover:text-lime transition-colors">{c.label}</Link>
              ) : (
                <span style={{ color: 'rgba(255,255,255,0.75)' }}>{c.label}</span>
              )}
              {i < breadcrumb.length - 1 && <span className="mx-2" style={{ color: 'rgba(255,255,255,0.25)' }}>/</span>}
            </span>
          ))}
        </p>

        <div className="flex flex-col lg:flex-row lg:items-center gap-12">
          <div className="max-w-[820px]">
            <p className="eyebrow mb-6" style={{ color: 'rgba(255,255,255,0.69)' }} data-animate>{eyebrow}</p>
            <h1
              className="mb-7 text-white"
              style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 'clamp(32px, 3vw + 18px, 60px)', lineHeight: 1, letterSpacing: '-1px' }}
              data-animate
            >
              {title}
            </h1>
            {sub && (
              <div className="mb-9" style={{ fontFamily: 'Inter', fontSize: 17, lineHeight: '30px', color: '#d6d6d6', maxWidth: 700 }} data-animate>
                {sub}
              </div>
            )}
            {actions && <div className="flex flex-wrap gap-4" data-animate>{actions}</div>}
          </div>
          {aside && <div className="hidden lg:block lg:ml-auto shrink-0" data-animate>{aside}</div>}
        </div>
      </div>
    </section>
  );
}
