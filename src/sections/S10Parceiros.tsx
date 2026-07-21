import { useReveal } from '../components/useReveal';
import HubButton from '../components/HubButton';
import { EImg, ERich, ET, useEditColor } from '../editor/fields';

const LOGOS: { img: string; name: string; bg?: string }[] = [
  { img: 's10-logo-parceiro-1', name: 'MIPAD ONU', bg: '#d1b810' },
  { img: 's10-logo-parceiro-2', name: 'Nações Unidas' },
  { img: 's10-logo-parceiro-3', name: 'Brasil Master®' },
  { img: 's10-logo-parceiro-4', name: 'Premier Niveau®' },
  { img: 's10-logo-parceiro-5', name: 'eGov Tecnologia®' },
  { img: 's10-logo-parceiro-6', name: 'Pacto Global ONU' },
];

export default function S10Parceiros() {
  const ref = useReveal<HTMLElement>();
  const [bg, bgProps] = useEditColor('s10.bg', '#f5f5f5', 'Fundo da seção Parceiros');

  return (
    <section ref={ref} id="home-parceiros" className="relative w-full py-20 overflow-hidden" {...bgProps} style={{ background: bg }}>
      <div className="gutter flex flex-wrap items-end justify-between gap-6 mb-16">
        <div>
          <p className="eyebrow text-muted mb-6" data-animate>
            <ET k="s10.eyebrow" v="PARCEIROS ESTRATÉGICOS" l="Parceiros — selo da seção" />
          </p>
          <h2 style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 'clamp(30px,3.6vw,50px)', lineHeight: '60px', color: '#152852' }} data-animate>
            <ERich k="s10.titulo" l="Parceiros — título da seção" baseW={950}>
              Organizações, movimentos e instituições que constroem o ecossistema HUB PAN.
            </ERich>
          </h2>
        </div>
        <div data-animate>
          <HubButton size="lg" variant="navy" iconKey="s10.btn.icone" iconLabel="Parceiros — botão, ícone" styleKey="s10.btn" styleLabel="Parceiros — botão" to="/o-hub-pan#inst-fundador">
            <ET k="s10.btn" v="Conheça a nossa História" l="Parceiros — botão" />
          </HubButton>
        </div>
      </div>

      {/* Carrossel — a lista é duplicada pro loop infinito; as duas cópias usam as
          MESMAS chaves de edição, então trocar uma logo atualiza as duas. */}
      <div className="marquee-mask overflow-hidden" data-animate>
        <div className="marquee-track flex gap-6 w-max">
          {[...LOGOS, ...LOGOS].map((l, i) => {
            const idx = i % LOGOS.length;
            return (
              <div key={i} className="flex flex-col items-center shrink-0" style={{ width: 303 }}>
                <EImg
                  k={`s10.logo.${idx}.img`} v={`/images/${l.img}.png`}
                  l={`Parceiros — logo "${l.name}"`}
                  spec={{ w: 606, h: 250, shape: 'paisagem', fit: 'contain', note: 'Logo do parceiro com fundo transparente (PNG ou SVG).' }}
                  alt={l.name}
                  className="hover:scale-105 transition-transform duration-200 object-contain"
                  style={{ width: '100%', height: 125, ...(l.bg ? { mixBlendMode: 'luminosity' } : undefined) }}
                />
                <p className="mt-3" style={{ fontFamily: 'Inter', fontSize: 16, color: '#000' }}>
                  <ET k={`s10.logo.${idx}.nome`} v={l.name} l={`Parceiros — nome "${l.name}"`} />
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
