import type { ReactNode } from 'react';
import { useReveal } from './useReveal';
import { useEditColor, useEditImage, BgEditChip } from '../editor/fields';
import type { ImageSpec } from '../editor/store';

const HERO_BG_SPEC: ImageSpec = { w: 2560, h: 1200, shape: 'paisagem', note: 'Tela cheia, fundo do Hero.' };

interface PageHeroProps {
  /** id estável pra âncora de scroll (seletor de link do editor) */
  id?: string;
  /** Prefixo das chaves de fundo editável (cor + imagem), ex.: "gloss.hero" —
   * cada página que usa esse componente precisa de um prefixo próprio,
   * senão todas dividiriam a mesma cor/imagem de fundo. */
  bgKey: string;
  eyebrow: ReactNode;
  /** Título — use <span> com cor lime (#d2e718) para os trechos de destaque */
  title: ReactNode;
  sub?: ReactNode;
  /** CTAs (HubButtons) exibidos abaixo do texto */
  actions?: ReactNode;
  /** Conteúdo opcional à direita (número gigante, imagem, card) — some no mobile */
  aside?: ReactNode;
}

/**
 * Hero escuro padrão das páginas internas: fundo navy900 (ou imagem, se o
 * Bruno escolher uma) + rótulo, título Luxenta 65px e CTAs. A NavBar global
 * (absoluta) fica por cima — por isso o padding-top alto.
 *
 * Fundo cor OU imagem: sem imagem escolhida (fallback vazio), mostra só a
 * cor sólida editável; ao escolher uma imagem pelo chip, ela cobre a cor.
 * "Restaurar imagem original" (no painel) volta pro fallback vazio — sem
 * precisar de UI extra pra "remover imagem". A malha quadriculada que
 * existia antes foi removida (pedido do Bruno — não fazia sentido existir).
 */
export default function PageHero({ id, bgKey, eyebrow, title, sub, actions, aside }: PageHeroProps) {
  const ref = useReveal<HTMLElement>();
  const [bg, bgProps] = useEditColor(`${bgKey}.bg`, '#060919', 'Hero — fundo');
  const [bgImage] = useEditImage(`${bgKey}.bgImage`, '', 'Hero — imagem de fundo (opcional)', HERO_BG_SPEC);

  return (
    <section
      ref={ref}
      id={id}
      className="relative w-full overflow-hidden"
      {...bgProps}
      style={{
        background: bg,
        ...(bgImage ? { backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}),
      }}
    >
      {/* Chip dedicado pra imagem — clicar direto no fundo edita a COR
       * (useEditColor acima); o chip é o único jeito de abrir o painel de
       * imagem, evita os dois `onClick` (cor e imagem) disputando o mesmo
       * elemento. Sempre visível em modo edição, não só quando já tem
       * imagem — é como o Bruno adiciona a primeira imagem. */}
      <BgEditChip k={`${bgKey}.bgImage`} v="" l="Hero — imagem de fundo (opcional)" spec={HERO_BG_SPEC} style={{ bottom: 24, right: 24 }} />
      <div className="relative gutter pt-[180px] lg:pt-[240px] pb-16 lg:pb-20">
        <div className="flex flex-col lg:flex-row lg:items-center gap-12">
          <div className="max-w-[820px]">
            {/* Rótulo no padrão do hero da home: Inter 500 13px, tracking 5.85px, branco 50% */}
            <p className="text-[13px] font-medium uppercase mb-6" style={{ fontFamily: 'Inter', letterSpacing: '5.85px', color: 'rgba(255,255,255,0.5)' }} data-animate>{eyebrow}</p>
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
