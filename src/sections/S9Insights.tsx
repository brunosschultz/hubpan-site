import { useReveal } from '../components/useReveal';
import HubButton from '../components/HubButton';
import { EImg, ERich, ET, useEditColor } from '../editor/fields';

const CARDS = [
  { id: 'mg', img: 's9-insight-1', cat: 'OBSERVATÓRIO · IA', title: 'Mapeamento do uso de IA na administração pública em Minas Gerais', desc: 'Pesquisa inaugural do Observatório HUB PAN — dados inéditos sobre adoção de IA no setor público.' },
  { id: 'americas', img: 's9-insight-2', cat: 'OBSERVATÓRIO · IA', title: 'Governança de IA nas Américas e África', desc: 'Análise comparativa de marcos regulatórios e políticas públicas de inteligência artificial.' },
  { id: 'educacao', img: 's9-insight-3', cat: 'OBSERVATÓRIO · IA', title: 'Educação e futuro do trabalho no ecossistema global', desc: 'White paper sobre capacitação, formação e as competências do profissional do futuro.' },
];

export default function S9Insights() {
  const ref = useReveal<HTMLElement>();
  const [bg, bgProps] = useEditColor('s9.bg', '#ffffff', 'Fundo da seção Insights');
  const [cardBg, cardBgProps] = useEditColor('s9.cardBg', '#ebebeb', 'Fundo dos cards de insight', 'Cards de insight');

  return (
    <section ref={ref} className="relative w-full py-20 gutter" {...bgProps} style={{ background: bg }}>
      <div className="flex flex-wrap items-end justify-between gap-6 mb-12">
        <div>
          <p className="eyebrow text-muted mb-6" data-animate>
            <ET k="s9.eyebrow" v="HUB PAN INSIGHTS" l="Insights — selo da seção" />
          </p>
          <h2 style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 'clamp(32px,4vw,50px)', color: '#152852' }} data-animate>
            <ERich k="s9.titulo" l="Insights — título da seção">Inteligência que orienta decisões.</ERich>
          </h2>
        </div>
        <div data-animate>
          <HubButton size="md" variant="blue">
            <ET k="s9.btn" v="Ver todos" l="Insights — botão" />
          </HubButton>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {CARDS.map((c) => (
          <div key={c.id} className="flex flex-col cursor-pointer group" {...cardBgProps} style={{ background: cardBg, borderRadius: 20, padding: 21, minHeight: 512 }} data-animate>
            <div className="overflow-hidden mb-4" style={{ borderRadius: 20, height: 254 }}>
              <EImg
                k={`s9.card.${c.id}.img`} v={`/images/${c.img}.webp`}
                l={`Insights — foto do card "${c.title.slice(0, 30)}…"`}
                spec={{ w: 800, h: 560, shape: 'paisagem' }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <p style={{ fontFamily: 'Inter', fontSize: 11, fontWeight: 400, letterSpacing: '2.2px', color: '#2d4ebf', marginBottom: 12 }}>
              <ET k={`s9.card.${c.id}.cat`} v={c.cat} l={`Insights — categoria do card ${c.id}`} />
            </p>
            <p style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 20, lineHeight: 1.3, color: '#000', marginBottom: 12 }}>
              <ERich k={`s9.card.${c.id}.titulo`} l={`Insights — título do card ${c.id}`}>
                {c.title}
              </ERich>
            </p>
            <p style={{ fontFamily: 'Inter', fontSize: 16, color: '#a7a4a4', marginTop: 'auto' }}>
              <ERich k={`s9.card.${c.id}.desc`} l={`Insights — descrição do card ${c.id}`}>
                {c.desc}
              </ERich>
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
