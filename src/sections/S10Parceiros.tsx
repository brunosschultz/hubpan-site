import { useReveal } from '../components/useReveal';
import HubButton from '../components/HubButton';

const LOGOS = [
  { img: 's10-logo-parceiro-1', name: 'MIPAD ONU', bg: '#d1b810' },
  { img: 's10-logo-parceiro-2', name: 'Nações Unidas' },
  { img: 's10-logo-parceiro-3', name: 'Brasil Master®' },
  { img: 's10-logo-parceiro-4', name: 'Premier Niveau®' },
  { img: 's10-logo-parceiro-5', name: 'eGov Tecnologia®' },
  { img: 's10-logo-parceiro-6', name: 'Pacto Global ONU' },
];

export default function S10Parceiros() {
  const ref = useReveal<HTMLElement>();

  return (
    <section ref={ref} className="relative w-full py-20 overflow-hidden" style={{ background: '#f5f5f5' }}>
      <div className="gutter flex flex-wrap items-end justify-between gap-6 mb-16">
        <div>
          <p className="eyebrow text-muted mb-6" data-animate>PARCEIROS ESTRATÉGICOS</p>
          <h2 style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 'clamp(30px,3.6vw,50px)', lineHeight: '60px', color: '#152852', maxWidth: 950 }} data-animate>
            Organizações, movimentos e instituições que constroem o ecossistema HUB PAN.
          </h2>
        </div>
        <div data-animate>
          <HubButton size="lg" variant="navy">Conheça a nossa História</HubButton>
        </div>
      </div>

      {/* Carrossel */}
      <div className="marquee-mask overflow-hidden" data-animate>
        <div className="marquee-track flex gap-6 w-max">
          {[...LOGOS, ...LOGOS].map((l, i) => (
            <div key={i} className="flex flex-col items-center shrink-0" style={{ width: 303 }}>
              <div className="w-full flex items-center justify-center overflow-hidden hover:scale-105 transition-transform duration-200" style={{ height: 125, borderRadius: 10, background: l.bg ?? '#fff' }}>
                <img src={`/images/${l.img}.png`} alt={l.name} className="max-w-[70%] max-h-[70%] object-contain" style={l.bg ? { mixBlendMode: 'luminosity' } : undefined} />
              </div>
              <p className="mt-3" style={{ fontFamily: 'Inter', fontSize: 16, color: '#000' }}>{l.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
