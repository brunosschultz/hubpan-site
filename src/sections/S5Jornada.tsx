import { useState } from 'react';
import { useReveal } from '../components/useReveal';

interface City {
  img: string; name: string; label: string; sub: string; origin?: boolean;
}

const CITIES: City[] = [
  { img: 's5-timeline-1', name: 'Belo Horizonte', label: 'ORIGEM | DESDE 2017', sub: 'Marco inicial', origin: true },
  { img: 's5-timeline-2', name: 'São Paulo', label: 'SEDE BRASIL', sub: 'Av. Paulista' },
  { img: 's5-timeline-3', name: 'Cambridge', label: 'SEDE GLOBAL', sub: 'Harvard Square' },
  { img: 's5-timeline-4', name: 'Boston', label: 'INOVAÇÃO', sub: 'Ecossistemas Tech' },
  { img: 's5-timeline-5', name: 'Nova York', label: 'DIPLOMACIA · ONU', sub: 'Reconhecimento' },
  { img: 's5-timeline-6', name: 'Africa', label: 'COOPERAÇÃO', sub: 'Liderança - MIPAD' },
];

const CIRCLE_HOLDER = 180; // acomoda o maior estado (hover) sem deslocar o centro

export default function S5Jornada() {
  const ref = useReveal<HTMLElement>();
  const [active, setActive] = useState<number | null>(null);

  return (
    <section
      ref={ref}
      className="relative w-full min-h-screen overflow-hidden py-20"
      style={{ background: 'linear-gradient(39.8deg, #ffffff 65.3%, #d2e718 99%)' }}
    >
      <div className="gutter relative z-10">
        {/* Topo — 3 colunas: título | descrição (centro) | "Desde 2017" sobreposto */}
        <div className="flex flex-wrap items-start justify-between gap-10 mb-16">
          <div className="max-w-[500px]">
            <p className="eyebrow text-muted mb-6" data-animate>JORNADA GLOBAL</p>
            <h2 style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 'clamp(32px,4vw,50px)', lineHeight: '50px', color: '#152852' }} data-animate>
              De Belo Horizonte ao mundo.
            </h2>
          </div>

          <p className="hidden lg:block self-center" style={{ fontFamily: 'Inter', fontSize: 16, lineHeight: '27px', color: '#a7a4a4', maxWidth: 186 }} data-animate>
            Uma trajetória construída cidade a cidade, relação por relação, entrega por entrega.
          </p>

          {/* "Desde" sobrepõe "2017" — igual ao Figma */}
          <div className="hidden xl:block relative shrink-0" style={{ width: 420, height: 200 }}>
            <span
              className="absolute right-0 top-0"
              style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 'min(15vw, 220px)', letterSpacing: '-4.4px', color: '#d2e718', lineHeight: 0.8 }}
            >
              2017
            </span>
            <span
              className="absolute left-0"
              style={{ top: '32%', fontFamily: 'Luxenta', fontWeight: 400, fontSize: 40, color: '#152852' }}
            >
              Desde
            </span>
          </div>
        </div>

        {/* Timeline */}
        <div className="relative" style={{ marginTop: 100 }}>
          {/* Linha horizontal — lime, largura total da página (ignora o padding da sanga) */}
          <div
            className="hidden lg:block absolute bg-lime"
            style={{ top: CIRCLE_HOLDER / 2, height: 2, left: '50%', width: '100vw', transform: 'translateX(-50%)' }}
          />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-4">
            {CITIES.map((c, i) => {
              const isActive = active === i;
              return (
                <div
                  key={c.name}
                  className="flex flex-col items-center text-center cursor-pointer"
                  onMouseEnter={() => setActive(i)}
                  onMouseLeave={() => setActive(null)}
                  data-animate
                >
                  {/* Holder de altura fixa — o círculo cresce sem sair do eixo da linha */}
                  <div className="relative flex items-center justify-center shrink-0 mb-4" style={{ width: CIRCLE_HOLDER, height: CIRCLE_HOLDER }}>
                    {/* Globo decorativo — só no hover */}
                    <img
                      src="/icons/s2-selo-rotativo.svg"
                      alt=""
                      className="absolute pointer-events-none transition-opacity duration-300"
                      style={{ width: CIRCLE_HOLDER + 60, height: CIRCLE_HOLDER + 60, opacity: isActive ? 1 : 0 }}
                    />
                    <div
                      className="relative rounded-full overflow-hidden transition-all duration-300"
                      style={{
                        width: isActive ? 180 : 160,
                        height: isActive ? 180 : 160,
                      }}
                    >
                      <img src={`/images/${c.img}.webp`} alt={c.name} className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <p style={{ fontFamily: 'Luxenta', fontWeight: 600, fontSize: c.origin ? 28 : 24, lineHeight: '25px', color: c.origin ? '#2d4ebf' : '#152852', marginBottom: 6 }}>
                    {c.name}
                  </p>
                  {c.origin ? (
                    <>
                      <span className="inline-flex items-center justify-center px-3 py-1 mb-2" style={{ border: '1px solid #2d4ebf', borderRadius: 60, fontFamily: 'Inter', fontSize: 11, letterSpacing: '1.65px', textTransform: 'uppercase', color: '#2d4ebf' }}>
                        {c.label}
                      </span>
                      <span style={{ fontFamily: 'Inter', fontSize: 14, color: '#2d4ebf' }}>{c.sub}</span>
                    </>
                  ) : (
                    <>
                      <span style={{ fontFamily: 'Inter', fontSize: 12, letterSpacing: '2.4px', textTransform: 'uppercase', color: '#797979', marginBottom: 2 }}>{c.label}</span>
                      <span style={{ fontFamily: 'Inter', fontSize: 14, color: '#2d4ebf' }}>{c.sub}</span>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
