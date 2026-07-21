import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';

/**
 * Ao trocar de rota: volta o scroll pro topo (via ScrollSmoother, se ativo)
 * e recalcula os ScrollTriggers (a altura do conteúdo muda por página).
 *
 * Com `#âncora` na URL (ex.: um HubButton com link pra "GovIA, seção
 * govia-planos" clicado de OUTRA página): em vez de resetar pro topo, tenta
 * rolar até o elemento. A página de destino pode ser um chunk lazy ainda
 * carregando quando este efeito roda, então tenta de novo por alguns frames
 * até o elemento existir (ou desiste e cai no topo normal).
 */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useLayoutEffect(() => {
    if (hash) {
      const id = hash.slice(1);
      let attempts = 0;
      let cancelled = false;
      const tryScroll = () => {
        if (cancelled) return;
        const el = document.getElementById(id);
        if (el) {
          const smoother = ScrollSmoother.get();
          if (smoother) smoother.scrollTo(`#${id}`, true);
          else el.scrollIntoView();
          requestAnimationFrame(() => ScrollTrigger.refresh());
          return;
        }
        if (attempts++ < 40) requestAnimationFrame(tryScroll);
      };
      tryScroll();
      return () => { cancelled = true; };
    }
    const smoother = ScrollSmoother.get();
    if (smoother) smoother.scrollTop(0);
    window.scrollTo(0, 0);
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, [pathname, hash]);

  return null;
}
