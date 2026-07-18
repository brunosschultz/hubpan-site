import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';

/**
 * Hook de scroll reveal. Anima elementos com [data-animate] dentro do ref:
 * fade + translateY(16px), stagger.
 *
 * Implementado com IntersectionObserver (não ScrollTrigger): triggers de
 * scroll vinculados a tween congelavam com ScrollTrigger.refresh() no meio
 * da animação, e triggers perto do fim da página falhavam sob o
 * ScrollSmoother após trocas de rota. O IO observa a posição REAL do
 * elemento na viewport (inclusive sob transform do smoother) e dispara uma
 * tween comum, imune a refresh/kill de triggers.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(stagger = 0.1) {
  const ref = useRef<T>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const targets = Array.from(el.querySelectorAll('[data-animate]'));
    if (!targets.length) return;

    gsap.set(targets, { y: 16, opacity: 0 });

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          gsap.to(targets, { y: 0, opacity: 1, duration: 0.4, stagger, ease: 'power2.out', overwrite: 'auto' });
        }
      },
      // dispara quando ~15% do fim da viewport é cruzado (≈ 'top 85%')
      { rootMargin: '0px 0px -15% 0px' }
    );
    io.observe(el);

    return () => {
      io.disconnect();
      gsap.killTweensOf(targets);
      gsap.set(targets, { clearProps: 'opacity,transform' });
    };
  }, [stagger]);

  return ref;
}

/**
 * Variante bidirecional: revela ao entrar na viewport (scroll pra baixo) e
 * esconde de novo quando o elemento sai pela PARTE DE BAIXO (scroll pra cima)
 * — o inverso acontece naturalmente. Elementos que saem pelo topo permanecem
 * visíveis. Usado em timelines e listas com animação vinculada ao scroll.
 */
export function useRevealBidirectional<T extends HTMLElement = HTMLDivElement>(stagger = 0.08) {
  const ref = useRef<T>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const targets = Array.from(el.querySelectorAll('[data-animate]'));
    if (!targets.length) return;

    gsap.set(targets, { y: 24, opacity: 0 });

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            gsap.to(targets, { y: 0, opacity: 1, duration: 0.5, stagger, ease: 'power2.out', overwrite: 'auto' });
          } else if (e.boundingClientRect.top > 0) {
            gsap.to(targets, { y: 24, opacity: 0, duration: 0.35, ease: 'power2.in', overwrite: 'auto' });
          }
        });
      },
      { rootMargin: '0px 0px -10% 0px' }
    );
    io.observe(el);

    return () => {
      io.disconnect();
      gsap.killTweensOf(targets);
      gsap.set(targets, { clearProps: 'opacity,transform' });
    };
  }, [stagger]);

  return ref;
}
