import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import HubButton from '../components/HubButton';
import { useSplitTitle } from '../components/useSplitTitle';
import { BgEditChip, EImg, ERich, ET, useEditImage } from '../editor/fields';
import { heroBgSpecForDevice, useEditorStore } from '../editor/store';

/* Glass card — pill ou accent. `data-tilt-card`/`data-tilt-inner` marcam os
 * dois níveis do efeito de profundidade (ver useLayoutEffect do S1Hero,
 * abaixo): o card inteiro gira (rotationX/Y) e o conteúdo dentro dele
 * desliza um pouco por cima (x/y) — mesma dupla camada do exemplo GSAP que
 * o Bruno passou (outer = rotação, inner = translate), só adaptada pra 4
 * cards reagindo cada um à SUA própria posição na tela, não em conjunto. */
function GlassCard({
  variant, accent, children, className = '', style,
}: {
  variant: 'pill' | 'accent';
  accent?: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      data-tilt-card
      className={`absolute ${className}`}
      style={{
        width: 233, height: 115,
        backdropFilter: 'blur(17.6px)', WebkitBackdropFilter: 'blur(17.6px)',
        background: 'rgba(250,255,202,0.10)',
        /* As duas variantes (pill e accent) usam a MESMA borda geral do
         * design system ("glass-stat", DESIGN-SYSTEM.md §1.8) — o accent só
         * soma a barra colorida à esquerda por cima. Antes só a pill tinha
         * essa borda (esquecimento, não decisão de design). */
        border: '0.88px solid rgba(255,255,255,0.15)',
        borderRadius: variant === 'pill' ? 57 : '20px 57px 20px 57px',
        borderLeft: variant === 'accent' ? `10px solid ${accent}` : undefined,
        ...style,
      }}
      data-animate
    >
      <div data-tilt-inner className="w-full h-full flex items-center justify-center gap-[14px] px-5">
        {children}
      </div>
    </div>
  );
}

const num: React.CSSProperties = { fontFamily: 'Luxenta', fontWeight: 400, fontSize: 82, lineHeight: 1, color: '#fff' };
const lbl: React.CSSProperties = { fontFamily: 'Inter', fontSize: 18, lineHeight: 1.3, color: '#fff', fontWeight: 400 };

const HERO_BG_SPEC = { w: 2560, h: 1440, shape: 'paisagem' as const, note: 'Tela cheia. A área mais importante fica à direita — o texto cobre a metade esquerda.' };

/* Ajustes do efeito dos glass cards — mexer só nesses números pra regular
 * a "força" (o Bruno já pediu isso 1x, deixa fácil de achar da próxima). */
const TILT_MAX_ROT = 12;     // graus — o quanto o card gira quando o cursor está bem perto
const TILT_MAX_SHIFT = 4;    // px — quanto o conteúdo interno desliza por cima do card
                              // (mantido bem menor que o giro do card — o deslize em px "lê"
                              // mais forte visualmente que o mesmo tanto em graus de rotação,
                              // por isso precisa de menos força pra sentir equilibrado)
const TILT_FALLOFF = 420;    // px — distância (do centro do card) onde o efeito já chega a zero;
                              // menor = precisa do cursor bem mais perto pra sentir; maior = reage de mais longe

export default function S1Hero() {
  const ref = useRef<HTMLElement>(null);
  const titleRef = useSplitTitle<HTMLHeadingElement>();
  const { editingDevice } = useEditorStore();
  const heroBgSpec = heroBgSpecForDevice(HERO_BG_SPEC, editingDevice);
  const [bgSrc, bgProps] = useEditImage('s1.bg', '/images/s1-hero-bg.webp', 'Hero — imagem de fundo', heroBgSpec);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      /* Sem opacity aqui de propósito: o texto do Hero já vem visível no HTML
       * pré-renderizado (scripts/prerender.mjs marca isso como opacity:1 pro
       * SEO/robôs) — animar a partir de opacity:0 fazia o GSAP escondê-lo de
       * novo ao montar e só revelar depois, e o Google conta esse "reaparecer"
       * como o momento real de LCP, inflando a métrica em segundos (achado
       * real da auditoria de velocidade — o elemento de maior conteúdo
       * visível era esse parágrafo, não a imagem de fundo). Mantém o leve
       * deslizar (y) pelo acabamento visual, sem esconder o conteúdo. */
      gsap.from('[data-hero-text]', { y: 20, duration: 0.6, stagger: 0.12, ease: 'power2.out', delay: 0.1 });
      gsap.from('[data-animate]', { opacity: 0, y: 15, scale: 0.95, duration: 0.5, stagger: 0.15, ease: 'power2.out', delay: 0.5 });
    }, el);

    /* Cursor-driven perspective tilt — baseado no exemplo GSAP que o Bruno
     * passou (perspective no container pai + rotationX/Y no card + x/y no
     * conteúdo interno = sensação real de profundidade em 2 camadas).
     * Diferenças importantes em relação à 1ª tentativa (não funcionou —
     * ficava restrita a um `mouseenter/mousemove/mouseleave` só dentro do
     * card pequeno, um alvo difícil de acertar): (1) o listener é único,
     * em TODA a seção (`pointermove`), não por card — não precisa acertar
     * o card pequeno pra o efeito reagir; (2) CADA card calcula sua PRÓPRIA
     * rotação a partir da posição do cursor relativa à SUA própria posição
     * na tela — cards diferentes tiltam diferente ao mesmo tempo
     * (individual, não em conjunto como o parallax de camada única da
     * tentativa anterior).
     *
     * Proximidade de verdade: a intensidade do efeito cai suavemente
     * (curva smoothstep, não linear) conforme o cursor se afasta do
     * CENTRO de cada card, chegando a zero em `TILT_FALLOFF` px — antes
     * o valor só saturava no máximo pra qualquer card longe do cursor
     * (sem essa queda), o que parecia "todo mundo reagindo igual". A
     * DIREÇÃO do tilt (pra que lado inclina) continua vindo da posição
     * relativa ao retângulo do próprio card, só a FORÇA final é que
     * agora é multiplicada por essa intensidade. */
    let cleanupTilt: (() => void) | undefined;
    const cardEls = Array.from(el.querySelectorAll<HTMLElement>('[data-tilt-card]'));
    if (cardEls.length) {
      gsap.set(el, { perspective: 800 });
      const clampDir = gsap.utils.clamp(-1, 1);
      const clamp01 = gsap.utils.clamp(0, 1);
      const trackers = cardEls.map((card) => {
        const inner = card.querySelector<HTMLElement>('[data-tilt-inner]');
        const rect = card.getBoundingClientRect();
        return {
          card,
          rect,
          cx: rect.left + rect.width / 2,
          cy: rect.top + rect.height / 2,
          rx: gsap.quickTo(card, 'rotationX', { duration: 0.6, ease: 'power3' }),
          ry: gsap.quickTo(card, 'rotationY', { duration: 0.6, ease: 'power3' }),
          ix: inner ? gsap.quickTo(inner, 'x', { duration: 0.6, ease: 'power3' }) : null,
          iy: inner ? gsap.quickTo(inner, 'y', { duration: 0.6, ease: 'power3' }) : null,
        };
      });
      const onMove = (e: PointerEvent) => {
        for (const t of trackers) {
          const dx = e.clientX - t.cx;
          const dy = e.clientY - t.cy;
          const dist = Math.hypot(dx, dy);
          const p = clamp01(1 - dist / TILT_FALLOFF);
          const intensity = p * p * (3 - 2 * p); // smoothstep — queda mais suave que linear
          const nx = clampDir(dx / (t.rect.width / 2));
          const ny = clampDir(dy / (t.rect.height / 2));
          t.rx(-ny * TILT_MAX_ROT * intensity);
          t.ry(nx * TILT_MAX_ROT * intensity);
          t.ix?.(nx * TILT_MAX_SHIFT * intensity);
          t.iy?.(ny * TILT_MAX_SHIFT * intensity);
        }
      };
      const onLeave = () => {
        for (const t of trackers) { t.rx(0); t.ry(0); t.ix?.(0); t.iy?.(0); }
      };
      const onResize = () => {
        for (const t of trackers) {
          t.rect = t.card.getBoundingClientRect();
          t.cx = t.rect.left + t.rect.width / 2;
          t.cy = t.rect.top + t.rect.height / 2;
        }
      };
      el.addEventListener('pointermove', onMove);
      el.addEventListener('pointerleave', onLeave);
      window.addEventListener('resize', onResize);
      cleanupTilt = () => {
        el.removeEventListener('pointermove', onMove);
        el.removeEventListener('pointerleave', onLeave);
        window.removeEventListener('resize', onResize);
      };
    }

    return () => { ctx.revert(); cleanupTilt?.(); };
  }, []);

  return (
    <section ref={ref} id="home-hero" className="relative w-full h-screen min-h-[700px] overflow-hidden">
      {/* BG */}
      {/* bg-center/lg:bg-right por CLASSE (breakpoint real do CSS) — não por
          `editingDevice`, que só existe dentro do editor (a URL `?device=`
          nunca aparece pra um visitante de verdade); a posição do recorte
          tem que reagir à largura REAL da tela de quem está vendo o site. */}
      <div className="absolute inset-0 bg-navy900 bg-center lg:bg-right" {...bgProps} style={{ backgroundImage: `url(${bgSrc})`, backgroundSize: 'cover' }} />
      <BgEditChip k="s1.bg" v="/images/s1-hero-bg.webp" l="Hero — imagem de fundo" spec={heroBgSpec} style={{ bottom: 24, right: 24 }} />

      {/* Conteúdo — pointer-events none no wrapper deixa cliques em áreas vazias
          alcançarem o BG e os glass cards; os filhos reativam os próprios cliques */}
      {/* O conteúdo é centralizado na vertical (justify-center), então o
          `pt-[120px]` só reserva metade do que parece: numa tela baixa
          (notebook 1024×768, tablet deitado) o rótulo subia até y≈180 e
          passava por baixo do logo do menu, que termina em y=197 — a
          sobreposição que o cliente viu. Aumentar o padding pra todo mundo
          empurraria o hero pra baixo em monitor alto sem necessidade, então a
          correção é escopada por ALTURA de tela: abaixo de 860px de altura o
          conteúdo ancora no topo com folga fixa, acima disso nada muda. */}
      <div className="absolute inset-0 z-10 flex flex-col justify-center gutter pt-[120px] [@media(min-width:1024px)_and_(max-height:860px)]:justify-start [@media(min-width:1024px)_and_(max-height:860px)]:pt-[210px] pointer-events-none">
        <p data-hero-text className="text-[13px] font-medium uppercase mb-6 pointer-events-auto self-start" style={{ letterSpacing: '5.85px', color: 'rgba(255,255,255,0.5)' }}>
          <ET k="s1.eyebrow" v="PLATAFORMA INTERNACIONAL" l="Hero — selo superior" />
        </p>
        <h1 ref={titleRef} data-hero-text className="mb-8 pointer-events-auto self-start" style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 'clamp(32px, 4vw + 20px, 65px)', lineHeight: 1, letterSpacing: '-1.95px', color: '#f5f4f4' }}>
          <ERich k="s1.titulo" l="Hero — título" baseW={760}>
            <span style={{ fontSize: 65 }}>Conectamos as Américas e África aos <span style={{ color: 'rgb(255, 255, 255)' }}>ecossistemas</span><br /><span style={{ color: 'rgb(210, 231, 24)' }}>globais de inovação.</span></span>
          </ERich>
        </h1>
        <p data-hero-text className="mb-12 pointer-events-auto self-start" style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: 18, lineHeight: '36px', letterSpacing: '-0.18px', color: '#d6d6d6' }}>
          <ERich k="s1.sub" l="Hero — parágrafo de apoio" baseW={593}>
            Infraestrutura global que conecta talentos, organizações, governos e territórios das Américas e da África aos principais ecossistemas globais de inovação, educação, inteligência artificial e cooperação internacional.
          </ERich>
        </p>
        <div data-hero-text className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start pointer-events-auto self-start">
          <HubButton size="lg" variant="blue" iconKey="s1.btn1.icone" iconLabel="Hero — botão azul, ícone" styleKey="s1.btn1" styleLabel="Hero — botão azul" to="/o-hub-pan"><ET k="s1.btn1" v="Conheça o HUB PAN" l="Hero — botão azul" /></HubButton>
          <HubButton size="lg" variant="lime" iconKey="s1.btn2.icone" iconLabel="Hero — botão lima, ícone" styleKey="s1.btn2" styleLabel="Hero — botão lima" to="/#home-plataformas"><ET k="s1.btn2" v="Explorar Plataformas" l="Hero — botão lima" /></HubButton>
        </div>
      </div>

      {/* 4 Glass cards — posições em % do frame 1920 do Figma. Como a coluna
          de texto tem largura FIXA (título 760px, parágrafo 593px) e os cards
          são posicionados por PORCENTAGEM, quanto mais estreita a tela, mais
          os cards andam pra dentro do texto: em 1440 os dois de dentro caíam
          por cima do título, e em 1024/1280 os quatro caíam (sobreposição real
          relatada pelo cliente). Cada card tem a largura de tela a partir da
          qual ele passa a caber ao lado do texto — conta `(1 − r)·L − 233 ≥
          L/12 + largura do texto + folga`, com `r` sendo o próprio percentual
          de `right` de cada um, e confirmada medindo no navegador: 1440px pros
          dois de fora (17% e 12,7%), 1700px pro de 31,9% e 1870px pro de
          37,4%, que é o mais "pra dentro". Abaixo desses cortes o card some e
          o hero fica só com o texto — limpo, nada por cima. Em 1920 (o frame
          do Figma) os quatro aparecem, exatamente como desenhado. */}
      <div className="absolute inset-0 z-[6] pointer-events-none">
        <GlassCard variant="accent" accent="#00e4ff" className="pointer-events-auto hidden min-[1870px]:block" style={{ right: '37.4%', top: '47.4%' }}>
          <span style={num}><ET k="s1.g1.num" v="10" l="Hero — card flutuante 1, número" /></span>
          <ET k="s1.g1.lbl" v={'Anos de\ntrajetória'} l="Hero — card flutuante 1, rótulo" multiline style={lbl} />
        </GlassCard>
        <GlassCard variant="pill" className="pointer-events-auto hidden min-[1440px]:block" style={{ right: '17%', top: '56%' }}>
          <EImg
            k="s1.g2.logo" v="/images/s1-hero-logo-onu.png"
            l="Hero — card flutuante 2, logo"
            spec={{ w: 58, h: 55, shape: 'quadrada', fit: 'contain', note: 'Logo com fundo transparente, já recortada sem margem (PNG ou SVG).' }}
            style={{ width: 58, height: 55, objectFit: 'contain', flexShrink: 0 }}
            alt="Logo de parceiro institucional"
          />
          <ET k="s1.g2.lbl" v={'Presença\ninstitucional'} l="Hero — card flutuante 2, rótulo" multiline style={lbl} />
        </GlassCard>
        <GlassCard variant="pill" className="pointer-events-auto hidden min-[1700px]:block" style={{ right: '31.9%', top: '73%' }}>
          <span style={num}><ET k="s1.g3.num" v="4" l="Hero — card flutuante 3, número" /></span>
          <ET k="s1.g3.lbl" v={'Edições em\nNova York'} l="Hero — card flutuante 3, rótulo" multiline style={lbl} />
        </GlassCard>
        <GlassCard variant="accent" accent="#d2e718" className="pointer-events-auto hidden min-[1440px]:block" style={{ right: '12.7%', top: '81%' }}>
          <span style={num}><ET k="s1.g4.num" v="15" l="Hero — card flutuante 4, número" /></span>
          <ET k="s1.g4.lbl" v={'Edições\nrealizadas'} l="Hero — card flutuante 4, rótulo" multiline style={lbl} />
        </GlassCard>
      </div>
    </section>
  );
}
