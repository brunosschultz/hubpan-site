import { useLayoutEffect, useRef } from 'react';
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
 *
 * `navKey` (não `pathname`/`hash`) é a dependência que dispara o efeito —
 * o React Router muda `location.key` a CADA navegação, mesmo quando o
 * destino é idêntico ao atual (clicar duas vezes no mesmo botão de âncora:
 * desce, o usuário rola pra cima manualmente, clica de novo). Se a
 * dependência fosse só `[pathname, hash]`, o segundo clique não mudaria
 * nenhum dos dois valores (já estavam nesse hash) e o efeito simplesmente
 * não rodava de novo — bug real reportado pelo Bruno.
 */
export default function ScrollToTop() {
  const { pathname, hash, key: navKey } = useLocation();
  const prevPathname = useRef(pathname);

  useLayoutEffect(() => {
    const pageChanged = prevPathname.current !== pathname;
    prevPathname.current = pathname;

    if (hash) {
      const id = hash.slice(1);
      let attempts = 0;
      let cancelled = false;
      const tryScroll = () => {
        if (cancelled) return;
        const el = document.getElementById(id);
        if (el) {
          /* refresh só quando a rota realmente mudou (conteúdo novo montado,
           * posições dos triggers podem ter mudado) — e sempre ANTES do
           * scrollTo, nunca depois. scrollTo(id, true) é um tween animado
           * (~1s); um refresh() logo em seguida interrompe esse tween em
           * andamento (achado real, reportado pelo Bruno: clicar num botão
           * com âncora na MESMA página mudava a URL mas não rolava — só um
           * scroll manual do usuário fazia a página "pular" pro lugar certo,
           * ou seja, o valor final já estava certo internamente, só a
           * animação até lá tinha sido cancelada pelo refresh). Numa âncora
           * da mesma página nada no layout mudou, então nem precisa de
           * refresh — pular ele evita o risco por completo nesse caso. */
          if (pageChanged) ScrollTrigger.refresh();
          const smoother = ScrollSmoother.get();
          if (smoother) smoother.scrollTo(`#${id}`, true);
          else el.scrollIntoView();
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
  }, [pathname, hash, navKey]);

  return null;
}
