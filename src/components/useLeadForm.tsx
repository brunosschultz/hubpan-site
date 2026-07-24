import { useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { supabase } from '../editor/supabaseClient';
import type { LeadSource } from '../admin/leads';

export const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

/**
 * Estado + envio de um formulário de lead (grava em `leads` no Supabase,
 * mesma tabela/fluxo já usado por Contato e Newsletter — ver
 * `src/pages/contato/index.tsx`). Cada página só declara os campos que usa
 * (`initial`) e quais são obrigatórios — o hook cuida de state, validação
 * mínima (obrigatórios preenchidos + e-mail válido se houver campo `email`),
 * envio e os 3 estados de UI (enviando/erro/sucesso).
 */
export function useLeadForm<T extends Record<string, string>>(source: LeadSource, initial: T, required: (keyof T)[]) {
  const [values, setValues] = useState<T>(initial);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (name: keyof T) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setValues((v) => ({ ...v, [name]: e.target.value }));
  };

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (sending) return;
    for (const key of required) {
      if (!String(values[key] ?? '').trim()) return;
    }
    if ('email' in values && values.email && !isValidEmail(String(values.email))) return;
    if (!supabase) { setError('Não foi possível enviar. Tente novamente mais tarde.'); return; }

    setSending(true);
    setError(null);
    const payload: Record<string, unknown> = { source };
    for (const [key, val] of Object.entries(values)) payload[key] = val ? val : null;
    const { error: insertError } = await supabase.from('leads').insert(payload);
    setSending(false);

    if (insertError) { setError('Não foi possível enviar. Tente novamente.'); return; }
    setSent(true);
  }

  return { values, set, handleSubmit, sending, sent, error };
}

/** Painel de sucesso — mesmo visual usado no Contato, reutilizado nos
 * demais formulários de lead pra manter a experiência consistente. */
export function LeadFormSuccess({ titulo, desc, minHeight = 420 }: { titulo: ReactNode; desc: ReactNode; minHeight?: number }) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 lg:p-9" style={{ minHeight }}>
      <CheckCircle2 size={56} strokeWidth={1.5} color="#d2e718" style={{ background: '#152852', borderRadius: '50%', padding: 10, width: 70, height: 70 }} />
      <h3 className="mt-7 mb-3" style={{ fontFamily: 'Luxenta', fontWeight: 600, fontSize: 22, lineHeight: 1, color: '#152852' }}>
        {titulo}
      </h3>
      <p style={{ fontFamily: 'Inter', fontSize: 14.5, lineHeight: '24px', color: '#797979', maxWidth: 320 }}>
        {desc}
      </p>
    </div>
  );
}
