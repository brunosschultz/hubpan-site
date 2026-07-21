import { useState } from 'react';
import { useReveal } from '../components/useReveal';
import { ERich, ET, useEditColor } from '../editor/fields';
import { supabase } from '../editor/supabaseClient';

const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

export default function S11Newsletter() {
  const ref = useReveal<HTMLElement>();
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bg, bgProps] = useEditColor('s11.bg', '#ffffff', 'Fundo da seção Newsletter');

  async function handleSubscribe() {
    if (sending || sent) return;
    if (!isValidEmail(email)) { setError('Digite um e-mail válido.'); return; }
    if (!supabase) { setError('Não foi possível inscrever. Tente novamente mais tarde.'); return; }

    setSending(true);
    setError(null);
    const { error: insertError } = await supabase.from('leads').insert({ source: 'newsletter', email });
    setSending(false);

    if (insertError) { setError('Não foi possível inscrever. Tente novamente.'); return; }
    setSent(true);
  }

  return (
    <section ref={ref} id="newsletter" className="relative w-full py-24 gutter" {...bgProps} style={{ background: bg }}>
      <div className="grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <p className="eyebrow text-muted mb-6" data-animate>
            <ET k="s11.eyebrow" v="HUB PAN INSIGHTS · NEWSLETTER" l="Newsletter — selo da seção" />
          </p>
          <h2 className="mb-4" style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 'clamp(32px,4vw,50px)', lineHeight: 1, color: '#152852' }} data-animate>
            <ERich k="s11.titulo" l="Newsletter — título">Fique conectado ao ecossistema.</ERich>
          </h2>
          <p style={{ fontFamily: 'Inter', fontSize: 16, color: '#152852' }} data-animate>
            <ERich k="s11.desc" l="Newsletter — texto de apoio" baseW={527}>
              Análises, oportunidades e atualizações — sem ruído, com relevância.
            </ERich>
          </p>
        </div>

        <div className="lg:justify-self-end w-full max-w-[590px]" data-animate>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={sent}
              placeholder="seu@email.com"
              className="flex-1 px-6 outline-none disabled:opacity-60"
              style={{ height: 50, borderRadius: 60, background: '#ebebeb', fontFamily: 'Inter', fontSize: 16, color: '#797979' }}
            />
            <button
              onClick={handleSubscribe}
              disabled={sending || sent}
              className="px-8 text-white hover:brightness-95 transition disabled:opacity-60"
              style={{ height: 50, borderRadius: 60, background: sent ? '#3fa855' : '#2d4ebf', fontFamily: 'Inter', fontSize: 16, minWidth: 167 }}
            >
              {sent ? 'Inscrito!' : <ET k="s11.btn" v={sending ? 'Enviando…' : 'Inscreva-se'} l="Newsletter — botão" />}
            </button>
          </div>
          <p className="mt-4" style={{ fontFamily: 'Inter', fontSize: 16, color: error ? '#c0392b' : '#a7a4a4' }}>
            {error ?? <ET k="s11.aviso" v="Sem spam. Cancele quando quiser." l="Newsletter — aviso" />}
          </p>
        </div>
      </div>
    </section>
  );
}
