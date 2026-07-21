import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import HubButton from '../components/HubButton';
import { BgEditChip, EImg, ERich, ET, useEditImage } from '../editor/fields';

/* Glass card — pill ou accent */
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
      className={`absolute flex items-center justify-center gap-[14px] px-5 ${className}`}
      style={{
        width: 233, height: 115,
        backdropFilter: 'blur(17.6px)', WebkitBackdropFilter: 'blur(17.6px)',
        background: 'rgba(250,255,202,0.10)',
        border: variant === 'pill' ? '0.88px solid rgba(255,255,255,0.15)' : undefined,
        borderRadius: variant === 'pill' ? 57 : '20px 57px 20px 57px',
        borderLeft: variant === 'accent' ? `10px solid ${accent}` : undefined,
        ...style,
      }}
      data-animate
    >
      {children}
    </div>
  );
}

const num: React.CSSProperties = { fontFamily: 'Luxenta', fontWeight: 400, fontSize: 82, lineHeight: 1, color: '#fff' };
const lbl: React.CSSProperties = { fontFamily: 'Inter', fontSize: 18, lineHeight: 1.3, color: '#fff', fontWeight: 400 };

const HERO_BG_SPEC = { w: 2560, h: 1440, shape: 'paisagem' as const, note: 'Tela cheia. A área mais importante fica à direita — o texto cobre a metade esquerda.' };

export default function S1Hero() {
  const ref = useRef<HTMLElement>(null);
  const [bgSrc, bgProps] = useEditImage('s1.bg', '/images/s1-hero-bg.webp', 'Hero — imagem de fundo', HERO_BG_SPEC);

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
      gsap.from('[data-animate]', { opacity: 0, scale: 0.95, duration: 0.5, stagger: 0.15, ease: 'power2.out', delay: 0.5 });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} id="home-hero" className="relative w-full h-screen min-h-[700px] overflow-hidden">
      {/* BG */}
      <div className="absolute inset-0 bg-navy900" {...bgProps} style={{ backgroundImage: `url(${bgSrc})`, backgroundSize: 'cover', backgroundPosition: 'center right' }} />
      <BgEditChip k="s1.bg" v="/images/s1-hero-bg.webp" l="Hero — imagem de fundo" spec={HERO_BG_SPEC} style={{ bottom: 24, right: 24 }} />

      {/* Conteúdo — pointer-events none no wrapper deixa cliques em áreas vazias
          alcançarem o BG e os glass cards; os filhos reativam os próprios cliques */}
      <div className="absolute inset-0 z-10 flex flex-col justify-center gutter pt-[120px] pointer-events-none">
        <p data-hero-text className="text-[13px] font-medium uppercase mb-6 pointer-events-auto self-start" style={{ letterSpacing: '5.85px', color: 'rgba(255,255,255,0.5)' }}>
          <ET k="s1.eyebrow" v="Plataforma Internacional" l="Hero — selo superior" />
        </p>
        <h1 data-hero-text className="mb-8 pointer-events-auto self-start" style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 'clamp(32px, 4vw + 20px, 65px)', lineHeight: 1, letterSpacing: '-1.95px', color: '#f5f4f4' }}>
          <ERich k="s1.titulo" l="Hero — título" baseW={720}>
            Unimos as Américas e África ao <span style={{ color: '#fff' }}>ecossistema</span> <span style={{ color: '#d2e718' }}>global de inovação.</span>
          </ERich>
        </h1>
        <p data-hero-text className="mb-12 pointer-events-auto self-start" style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: 18, lineHeight: '36px', letterSpacing: '-0.18px', color: '#d6d6d6' }}>
          <ERich k="s1.sub" l="Hero — parágrafo de apoio" baseW={593}>
            Uma infraestrutura global que conecta talentos, governos, empresas, universidades e territórios a ecossistemas de inovação, educação, inteligência artificial, impacto e cooperação.
          </ERich>
        </p>
        <div data-hero-text className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start pointer-events-auto self-start">
          <HubButton size="lg" variant="blue" iconKey="s1.btn1.icone" iconLabel="Hero — botão azul, ícone" styleKey="s1.btn1" styleLabel="Hero — botão azul" to="/o-hub-pan"><ET k="s1.btn1" v="Conheça o Ecossistema" l="Hero — botão azul" /></HubButton>
          <HubButton size="lg" variant="lime" iconKey="s1.btn2.icone" iconLabel="Hero — botão lima, ícone" styleKey="s1.btn2" styleLabel="Hero — botão lima" onClick={() => ScrollSmoother.get()?.scrollTo('#home-plataformas', true)}><ET k="s1.btn2" v="Explorar Plataformas" l="Hero — botão lima" /></HubButton>
        </div>
      </div>

      {/* 4 Glass cards — posições % do Figma (só ≥lg) */}
      <div className="hidden lg:block absolute inset-0 z-[6] pointer-events-none">
        <GlassCard variant="accent" accent="#00e4ff" className="pointer-events-auto" style={{ right: '37.4%', top: '47.4%' }}>
          <span style={num}><ET k="s1.g1.num" v="10" l="Hero — card flutuante 1, número" /></span>
          <ET k="s1.g1.lbl" v={'Anos de\ntrajetória'} l="Hero — card flutuante 1, rótulo" multiline style={lbl} />
        </GlassCard>
        <GlassCard variant="pill" className="pointer-events-auto" style={{ right: '17%', top: '56%' }}>
          <EImg
            k="s1.g2.logo" v="/images/s4-logo-1.png"
            l="Hero — card flutuante 2, logo"
            spec={{ w: 240, h: 240, shape: 'quadrada', fit: 'contain', note: 'Logo com fundo transparente (PNG ou SVG).' }}
            style={{ width: 55, height: 55, objectFit: 'contain', flexShrink: 0 }}
            alt="Logo de parceiro institucional"
          />
          <ET k="s1.g2.lbl" v={'Presença\ninstitucional'} l="Hero — card flutuante 2, rótulo" multiline style={lbl} />
        </GlassCard>
        <GlassCard variant="pill" className="pointer-events-auto" style={{ right: '31.9%', top: '73%' }}>
          <span style={num}><ET k="s1.g3.num" v="4" l="Hero — card flutuante 3, número" /></span>
          <ET k="s1.g3.lbl" v={'Edições em\nNova York'} l="Hero — card flutuante 3, rótulo" multiline style={lbl} />
        </GlassCard>
        <GlassCard variant="accent" accent="#d2e718" className="pointer-events-auto" style={{ right: '12.7%', top: '81%' }}>
          <span style={num}><ET k="s1.g4.num" v="15" l="Hero — card flutuante 4, número" /></span>
          <ET k="s1.g4.lbl" v={'Edições\nrealizadas'} l="Hero — card flutuante 4, rótulo" multiline style={lbl} />
        </GlassCard>
      </div>
    </section>
  );
}
