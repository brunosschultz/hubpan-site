import { useReveal } from '../components/useReveal';
import HubButton from '../components/HubButton';

const TAGS = [
  ['NAÇÕES UNIDAS - NY', 'HARVARD SQUARE - CAMBRIDGE', 'MIPAD ONU'],
  ['EXPO BOSTON', 'EXPO NEW YORK', 'AV. PAULISTA - SP'],
];

const LOGOS = ['s4-logo-1', 's4-logo-2', 's4-logo-3', 's4-logo-4', 's4-logo-5'];

export default function S4Autoridade() {
  const ref = useReveal<HTMLElement>();

  return (
    <section ref={ref} className="relative w-full min-h-screen bg-hubblue overflow-hidden">
      <div className="relative grid lg:grid-cols-2 min-h-screen">
        {/* Esquerda: conteúdo */}
        <div className="flex flex-col justify-center gutter py-20 lg:py-0">
          <p className="eyebrow mb-8" style={{ color: 'rgba(255,255,255,0.69)' }} data-animate>AUTORIDADE & PRESENÇA</p>
          <h2 className="mb-10" style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 'clamp(38px,4.2vw,60px)', lineHeight: 1, maxWidth: 738 }} data-animate>
            <span className="text-white">Quase uma década construindo relações institucionais concretas </span>
            <span style={{ color: '#d2e718' }}>nos ambientes mais estratégicos do mundo.</span>
          </h2>

          {/* Tags */}
          <div className="flex flex-col gap-3 mb-12" data-animate>
            {TAGS.map((row, r) => (
              <div key={r} className="flex flex-wrap gap-3">
                {row.map((t) => (
                  <span key={t} className="inline-flex items-center justify-center px-5" style={{ height: 40, border: '1.16px solid rgba(255,255,255,0.69)', borderRadius: 58, fontFamily: 'Inter', fontWeight: 500, fontSize: 16, color: '#fff', whiteSpace: 'nowrap' }}>
                    {t}
                  </span>
                ))}
              </div>
            ))}
          </div>

          <div data-animate>
            <HubButton size="lg" variant="lime">Conheça a nossa História</HubButton>
          </div>
        </div>

        {/* Direita: vídeo + logos */}
        <div className="relative hidden lg:block">
          <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover" style={{ width: 'calc(100% - 160px)' }}>
            <source src="/images/s4-autoridade-video.webm" type="video/webm" />
          </video>
          {/* Logos coluna direita */}
          <div className="absolute right-[40px] top-0 bottom-0 flex flex-col justify-center gap-10 z-10">
            {LOGOS.map((l) => (
              <img key={l} src={`/images/${l}.png`} alt="" style={{ width: 115, height: 'auto', objectFit: 'contain', mixBlendMode: 'luminosity', opacity: 0.9 }} data-animate />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
