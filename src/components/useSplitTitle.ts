import { useLayoutEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(SplitText);

// `location.key` da 1ª entrada de rota da aba — ver comentário abaixo sobre
// por que a página do carregamento inicial nunca anima.
let initialLocationKey: string | null = null;

/**
 * Título grande de Hero — efeito GSAP SplitText "revert after animation"
 * (receita que o Bruno passou): quebra o texto em caracteres, anima cada um
 * entrando (fade + scale + rotationX, ease "back", stagger) e ao terminar
 * desfaz o split (`SplitText.revert()`), devolvendo o texto original ao
 * DOM — sem <span> por caractere permanentes atrapalhando seleção de
 * texto/leitor de tela depois que a animação já rodou uma vez.
 *
 * Dispara ao MONTAR a página, não no scroll — o Hero já está na tela
 * quando ela abre, então não depende de IntersectionObserver/scroll (que
 * sob o ScrollSmoother deste site não é confiável de simular/testar e
 * complica à toa um efeito que só precisa acontecer uma vez, no load).
 *
 * Nunca anima na página do carregamento inicial da aba (acesso direto/
 * reload) — o HTML de cada rota já vem pré-renderizado com o título visível
 * (`scripts/prerender.mjs` força opacity:1), e o `hydrateRoot` em
 * `main.tsx` reaproveita esse HTML sem reconstruir. Esconder o texto pra
 * reanimar bem nesse momento é exatamente o bug real de LCP já corrigido no
 * Hero da Home (ver comentário em `S1Hero.tsx`) — o Google mede o LCP no
 * momento em que o conteúdo fica visível "de vez", então esconder→reaparecer
 * o maior texto da tela ao carregar infla a métrica em segundos, mesmo com
 * o HTML já pronto no primeiro paint. Só anima em navegações SEGUINTES
 * dentro da mesma aba (troca de rota via SPA) — nesse caso o LCP da página
 * já foi medido há muito tempo, sem risco.
 *
 * Comparar `location.key` (não contar montagens) é o jeito robusto de saber
 * "ainda é a página do load inicial": esse Hero chega a montar 2x de
 * verdade num único carregamento (StrictMode + o próprio ciclo de resolução
 * de rota), então um contador/flag de "1ª montagem" ou um `setTimeout`
 * pra marcar isso tarde demais — a 2ª montagem real ainda cai na janela
 * antes do timer disparar, entra no ramo de animação enquanto outra coisa
 * (ex.: overrides do editor carregando) mexe na mesma árvore, e o React
 * tenta remover um nó que o SplitText já tinha substituído
 * (`NotFoundError: removeChild`, causa raiz real já vista e corrigida
 * nesta sessão). `location.key` não muda entre remontagens da MESMA
 * navegação — só uma troca de rota de verdade gera uma chave nova.
 */
export function useSplitTitle<T extends HTMLElement = HTMLHeadingElement>() {
  const ref = useRef<T>(null);
  const location = useLocation();

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (initialLocationKey === null) initialLocationKey = location.key;
    if (location.key === initialLocationKey) return;

    let split: SplitText | null = null;
    let cancelled = false;

    // esconde o título de cara — evita o "flash" do texto inteiro, sem
    // quebra, antes da fonte carregar e o split ficar pronto
    gsap.set(el, { opacity: 0 });

    document.fonts.ready.then(() => {
      if (cancelled || !ref.current) return;
      split = SplitText.create(ref.current, { type: 'chars, words', charsClass: 'char' });
      gsap.set(split.chars, { opacity: 0, scale: 0, y: 60, rotationX: 90, transformOrigin: '0% 50% -30' });
      gsap.set(ref.current, { opacity: 1 }); // libera o container; cada char continua oculto individualmente
      gsap.to(split.chars, {
        opacity: 1, scale: 1, y: 0, rotationX: 0,
        duration: 0.6,
        // `amount` (tempo TOTAL do stagger, dividido entre os chars) em vez de
        // um valor fixo por char — com um valor fixo, título longo (mais
        // chars) demorava proporcionalmente mais pra terminar. `amount`
        // mantém a duração total parecida não importa o tamanho do título.
        stagger: { amount: 0.4, from: 'start' },
        ease: 'back',
        onComplete: () => split?.revert(),
      });
    });

    return () => {
      cancelled = true;
      split?.revert();
    };
  }, [location.key]);

  return ref;
}
