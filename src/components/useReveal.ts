import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Hook de scroll reveal. Anima elementos com [data-animate] dentro do ref:
 * fade + translateY(16px), stagger. Cleanup automático via gsap.context.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(stagger = 0.1) {
  const ref = useRef<T>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const targets = el.querySelectorAll('[data-animate]');
      if (!targets.length) return;
      gsap.from(targets, {
        y: 16,
        opacity: 0,
        duration: 0.4,
        stagger,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 80%',
        },
      });
    }, el);
    return () => ctx.revert();
  }, [stagger]);

  return ref;
}
