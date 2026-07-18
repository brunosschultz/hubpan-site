import { useState } from 'react';
import { useReveal } from '../components/useReveal';

export default function S11Newsletter() {
  const ref = useReveal<HTMLElement>();
  const [email, setEmail] = useState('');

  return (
    <section ref={ref} className="relative w-full py-24 gutter bg-white">
      <div className="grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <p className="eyebrow text-muted mb-6" data-animate>HUB PAN INSIGHTS · NEWSLETTER</p>
          <h2 className="mb-4" style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 'clamp(32px,4vw,50px)', lineHeight: 1, color: '#152852' }} data-animate>
            Fique conectado ao ecossistema.
          </h2>
          <p style={{ fontFamily: 'Inter', fontSize: 16, color: '#152852', maxWidth: 527 }} data-animate>
            Análises, oportunidades e atualizações — sem ruído, com relevância.
          </p>
        </div>

        <div className="lg:justify-self-end w-full max-w-[590px]" data-animate>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="flex-1 px-6 outline-none"
              style={{ height: 50, borderRadius: 60, background: '#ebebeb', fontFamily: 'Inter', fontSize: 16, color: '#797979' }}
            />
            <button
              className="px-8 text-white hover:brightness-95 transition"
              style={{ height: 50, borderRadius: 60, background: '#2d4ebf', fontFamily: 'Inter', fontSize: 16, minWidth: 167 }}
            >
              Inscreva-se
            </button>
          </div>
          <p className="mt-4" style={{ fontFamily: 'Inter', fontSize: 16, color: '#a7a4a4' }}>
            Sem spam. Cancele quando quiser.
          </p>
        </div>
      </div>
    </section>
  );
}
