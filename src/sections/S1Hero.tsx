import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import NavBar from '../components/NavBar';
import HubButton from '../components/HubButton';

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

export default function S1Hero() {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.from('[data-hero-text]', { y: 20, opacity: 0, duration: 0.6, stagger: 0.12, ease: 'power2.out', delay: 0.1 });
      gsap.from('[data-animate]', { opacity: 0, scale: 0.95, duration: 0.5, stagger: 0.15, ease: 'power2.out', delay: 0.5 });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="relative w-full h-screen min-h-[700px] overflow-hidden">
      {/* BG */}
      <div className="absolute inset-0 bg-navy900" style={{ backgroundImage: 'url(/images/s1-hero-bg.webp)', backgroundSize: 'cover', backgroundPosition: 'center right' }} />

      <NavBar />

      {/* Conteúdo */}
      <div className="absolute inset-0 z-10 flex flex-col justify-center gutter pt-[120px]">
        <p data-hero-text className="text-[13px] font-medium uppercase mb-6" style={{ letterSpacing: '5.85px', color: 'rgba(255,255,255,0.5)' }}>
          Plataforma Internacional
        </p>
        <h1 data-hero-text className="mb-8" style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 65, lineHeight: '65px', letterSpacing: '-1.95px', color: '#f5f4f4', maxWidth: 720 }}>
          Unimos as Américas e África ao <span style={{ color: '#fff' }}>ecossistema</span> <span style={{ color: '#d2e718' }}>global de inovação.</span>
        </h1>
        <p data-hero-text className="mb-12" style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: 18, lineHeight: '36px', letterSpacing: '-0.18px', color: '#d6d6d6', maxWidth: 593 }}>
          Uma infraestrutura global que conecta talentos, governos, empresas, universidades e territórios a ecossistemas de inovação, educação, inteligência artificial, impacto e cooperação.
        </p>
        <div data-hero-text className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start">
          <HubButton size="lg" variant="blue">Conheça o Ecossistema</HubButton>
          <HubButton size="lg" variant="lime">Explorar Plataformas</HubButton>
        </div>
      </div>

      {/* 4 Glass cards — posições % do Figma (só ≥lg) */}
      <div className="hidden lg:block absolute inset-0 z-[6]">
        <GlassCard variant="accent" accent="#00e4ff" style={{ right: '37.4%', top: '47.4%' }}>
          <span style={num}>10</span>
          <span style={lbl}>Anos de<br />trajetória</span>
        </GlassCard>
        <GlassCard variant="pill" style={{ right: '17%', top: '56%' }}>
          <img src="/images/s4-logo-1.png" alt="" style={{ width: 55, height: 55, objectFit: 'contain', flexShrink: 0 }} />
          <span style={lbl}>Presença<br />institucional</span>
        </GlassCard>
        <GlassCard variant="pill" style={{ right: '31.9%', top: '73%' }}>
          <span style={num}>4</span>
          <span style={lbl}>Edições em<br />Nova York</span>
        </GlassCard>
        <GlassCard variant="accent" accent="#d2e718" style={{ right: '12.7%', top: '81%' }}>
          <span style={num}>15</span>
          <span style={lbl}>Edições<br />realizadas</span>
        </GlassCard>
      </div>
    </section>
  );
}
