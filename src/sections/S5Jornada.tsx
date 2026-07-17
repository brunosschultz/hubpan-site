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

export default function S5Jornada() {
  const ref = useReveal<HTMLElement>();
  const [active, setActive] = useState(0);

  return (
    <section
      ref={ref}
      className="relative w-full min-h-screen overflow-hidden py-20"
      style={{ background: 'linear-gradient(39.8deg, #ffffff 65.3%, #d2e718 99%)' }}
    >
      {/* "Desde 2017" decorativo */}
      <div className="hidden xl:block absolute right-[8%] top-0 text-right pointer-events-none">
        <p style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 50, color: '#152852', marginTop: 155 }}>Desde</p>
        <p style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 'min(18vw, 280px)', letterSpacing: '-5.6px', color: '#d2e718', lineHeight: 0.8 }}>2017</p>
      </div>

      <div className="gutter relative z-10">
        <p className="eyebrow text-muted mb-6" data-animate>JORNADA GLOBAL</p>
        <h2 className="mb-4" style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 'clamp(32px,4vw,50px)', color: '#152852' }} data-animate>
          De Belo Horizonte ao mundo.
        </h2>
        <p className="mb-16" style={{ fontFamily: 'Inter', fontSize: 16, lineHeight: '27px', color: '#a7a4a4', maxWidth: 420 }} data-animate>
          Uma trajetória construída cidade a cidade, relação por relação, entrega por entrega.
        </p>

        {/* Timeline */}
        <div className="relative">
          {/* Linha horizontal */}
          <div className="hidden lg:block absolute left-0 right-0 top-[90px] h-px bg-[#152852]/20" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-4">
            {CITIES.map((c, i) => (
              <div
                key={c.name}
                className="flex flex-col items-center text-center cursor-pointer"
                onMouseEnter={() => setActive(i)}
                data-animate
              >
                <div
                  className="rounded-full overflow-hidden transition-all duration-300 mb-4"
                  style={{
                    width: active === i ? 180 : 160,
                    height: active === i ? 180 : 160,
                    border: c.origin ? '3px solid #2d4ebf' : '2px solid transparent',
                  }}
                >
                  <img src={`/images/${c.img}.webp`} alt={c.name} className="w-full h-full object-cover" />
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
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
