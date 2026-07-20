import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';

/**
 * Perspective tilt guiado pelo cursor (GSAP quickTo — fluido, sem jank).
 * O card inclina seguindo a posição do mouse e volta suavemente ao sair.
 * maxX/maxY = inclinação máxima em graus (eixo X = vertical, Y = horizontal).
 */
export function useTilt<T extends HTMLElement = HTMLDivElement>(maxX = 8, maxY = 10) {
  const ref = useRef<T>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    gsap.set(el, { transformPerspective: 900 });
    const rX = gsap.quickTo(el, 'rotationX', { duration: 0.5, ease: 'power2.out' });
    const rY = gsap.quickTo(el, 'rotationY', { duration: 0.5, ease: 'power2.out' });

    /* `getBoundingClientRect()` a cada mousemove força o navegador a
     * recalcular o layout (reflow) dezenas de vezes por segundo — medir só
     * uma vez ao entrar no card (a posição não muda durante o hover) e
     * reaproveitar resolve isso, achado real da auditoria de velocidade. */
    let r: DOMRect | null = null;
    const enter = () => { r = el.getBoundingClientRect(); };
    const move = (e: MouseEvent) => {
      if (!r) r = el.getBoundingClientRect();
      rX(-((e.clientY - r.top) / r.height - 0.5) * maxX);
      rY(((e.clientX - r.left) / r.width - 0.5) * maxY);
    };
    const leave = () => { rX(0); rY(0); r = null; };

    el.addEventListener('mouseenter', enter);
    el.addEventListener('mousemove', move);
    el.addEventListener('mouseleave', leave);
    return () => {
      el.removeEventListener('mouseenter', enter);
      el.removeEventListener('mousemove', move);
      el.removeEventListener('mouseleave', leave);
      gsap.killTweensOf(el, 'rotationX,rotationY');
    };
  }, [maxX, maxY]);

  return ref;
}
