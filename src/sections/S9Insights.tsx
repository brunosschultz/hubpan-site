import { useReveal } from '../components/useReveal';
import HubButton from '../components/HubButton';

const CARDS = [
  { img: 's9-insight-1', cat: 'OBSERVATÓRIO · IA', title: 'Mapeamento do uso de IA na administração pública em Minas Gerais', desc: 'Pesquisa inaugural do Observatório HUB PAN — dados inéditos sobre adoção de IA no setor público.' },
  { img: 's9-insight-2', cat: 'OBSERVATÓRIO · IA', title: 'Governança de IA nas Américas e África', desc: 'Análise comparativa de marcos regulatórios e políticas públicas de inteligência artificial.' },
  { img: 's9-insight-3', cat: 'OBSERVATÓRIO · IA', title: 'Educação e futuro do trabalho no ecossistema global', desc: 'White paper sobre capacitação, formação e as competências do profissional do futuro.' },
];

export default function S9Insights() {
  const ref = useReveal<HTMLElement>();

  return (
    <section ref={ref} className="relative w-full py-20 gutter bg-white">
      <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
        <div>
          <p className="eyebrow text-muted mb-6" data-animate>HUB PAN INSIGHTS</p>
          <h2 style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 'clamp(32px,4vw,50px)', color: '#152852' }} data-animate>
            Inteligência que orienta decisões.
          </h2>
        </div>
        <div data-animate>
          <HubButton size="md" variant="blue">Ver todos</HubButton>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {CARDS.map((c) => (
          <div key={c.title} className="flex flex-col cursor-pointer group" style={{ background: '#ebebeb', borderRadius: 20, padding: 21, minHeight: 512 }} data-animate>
            <div className="overflow-hidden mb-4" style={{ borderRadius: 20, height: 254 }}>
              <img src={`/images/${c.img}.webp`} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>
            <p style={{ fontFamily: 'Inter', fontSize: 11, fontWeight: 400, letterSpacing: '2.2px', color: '#2d4ebf', marginBottom: 12 }}>{c.cat}</p>
            <p style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 20, lineHeight: 1.3, color: '#000', marginBottom: 12 }}>{c.title}</p>
            <p style={{ fontFamily: 'Inter', fontSize: 16, color: '#a7a4a4', marginTop: 'auto' }}>{c.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
