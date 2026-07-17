import { useReveal } from '../components/useReveal';
import HubButton from '../components/HubButton';

interface NumCard {
  num: string; img: string; desc: string; btn: string; edicoes?: boolean;
}

const CARDS: NumCard[] = [
  { num: '15', img: 's6-numero-1', desc: 'Edições do Fórum Pan-Americano', btn: 'Saiba mais', edicoes: true },
  { num: '04', img: 's6-numero-2', desc: 'Edições em Nova York', btn: 'Explorar', edicoes: true },
  { num: '2017', img: 's6-numero-3', desc: 'Início em Belo Horizonte', btn: 'Explorar' },
  { num: '+100', img: 's6-numero-4', desc: 'Projetos de inovação abrigados', btn: 'Explorar' },
];

export default function S6Numeros() {
  const ref = useReveal<HTMLElement>();

  return (
    <section ref={ref} className="relative w-full py-20 gutter" style={{ background: '#ecedf0' }}>
      <p className="eyebrow text-muted mb-6" data-animate>NÚMEROS VALIDADOS</p>
      <h2 className="mb-12" style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 'clamp(32px,4vw,50px)', color: '#152852' }} data-animate>
        O que foi construído é real.
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {CARDS.map((c) => {
          const fontSize = c.num.length >= 4 ? 140 : 150;
          const tracking = c.num.length >= 4 ? '-7px' : '-7.5px';
          return (
            <div key={c.num} className="flex flex-col bg-white overflow-hidden" style={{ borderRadius: 20, height: 380 }} data-animate>
              {/* Imagem full-bleed + número */}
              <div className="relative flex items-end overflow-hidden shrink-0" style={{ height: 205, borderRadius: '0 0 20px 20px' }}>
                <img src={`/images/${c.img}.webp`} alt="" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 32%, rgba(0,0,0,0.4))' }} />
                <div className="relative flex items-end px-5 w-full">
                  <span style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize, letterSpacing: tracking, color: '#fff', lineHeight: 0.72, marginBottom: -13 }}>{c.num}</span>
                  {c.edicoes && (
                    <span className="mb-4 ml-2" style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 20, letterSpacing: '3px', textTransform: 'uppercase', color: '#fff' }}>Edições</span>
                  )}
                </div>
              </div>
              {/* Descrição + botão */}
              <div className="flex flex-col flex-1" style={{ padding: '16px 20px 20px' }}>
                <p style={{ fontFamily: 'Inter', fontSize: 16, lineHeight: '24px', color: '#152852' }}>{c.desc}</p>
                <div style={{ flex: 1 }} />
                <div className="self-start">
                  <HubButton size="sm" variant="lime">{c.btn}</HubButton>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
