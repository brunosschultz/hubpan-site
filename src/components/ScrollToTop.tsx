import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';

/**
 * Ao trocar de rota: volta o scroll pro topo (via ScrollSmoother, se ativo)
 * e recalcula os ScrollTriggers (a altura do conteúdo muda por página).
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    const smoother = ScrollSmoother.get();
    if (smoother) smoother.scrollTop(0);
    window.scrollTo(0, 0);
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, [pathname]);

  return null;
}
