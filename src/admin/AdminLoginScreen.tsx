import { useState, type CSSProperties, type FormEvent } from 'react';
import { useEditorStore } from '../editor/store';
import { t, ADMIN_SITE_NAME } from './theme';
import './theme.css';

/**
 * Tela de login do Painel Admin — visual isolado do editor visual
 * (`editor/ui.tsx`'s `<LoginScreen/>`, que é intencionalmente navy/lime/
 * Luxenta, a identidade do site). Aqui usa só os tokens de `theme.ts`, pra
 * poder virar um painel white-label reusável noutros projetos.
 */
export default function AdminLoginScreen() {
  const { login, connected } = useEditorStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setErr('');
    if (name.trim().length < 2) return setErr('Informe seu nome — ele aparece no histórico de edições.');
    if (!/^\S+@\S+\.\S+$/.test(email)) return setErr('Informe um e-mail válido.');
    if (pass.length < 4) return setErr('Senha muito curta.');
    setBusy(true);
    const erro = await login(name.trim(), email.trim().toLowerCase(), pass);
    setBusy(false);
    if (erro) setErr(erro);
  };

  const input: CSSProperties = {
    height: 46, borderRadius: t.radius, background: t.muted,
    border: `1px solid ${t.border}`, fontFamily: 'Inter', fontSize: 14.5,
    color: t.foreground, padding: '0 14px', width: '100%', outline: 'none',
  };

  return (
    <section className="admin-shell relative w-full min-h-screen flex items-center justify-center" style={{ background: t.muted }}>
      <form onSubmit={submit} className="relative w-full mx-6" style={{ maxWidth: 400 }}>
        <div className="p-8" style={{ borderRadius: t.radius, background: t.card, border: `1px solid ${t.border}` }}>
          <p style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 20, lineHeight: 1, color: t.foreground }}>
            {ADMIN_SITE_NAME}
          </p>
          <p className="mb-7 mt-2" style={{ fontFamily: 'Inter', fontSize: 13.5, color: t.mutedForeground }}>
            Painel administrativo — acesso restrito
          </p>
          <div className="space-y-3">
            <input placeholder="Nome completo" value={name} onChange={(e) => setName(e.target.value)} style={input} />
            <input placeholder="E-mail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={input} />
            <input placeholder="Senha" type="password" value={pass} onChange={(e) => setPass(e.target.value)} style={input} />
          </div>
          {err && <p className="mt-3" style={{ fontFamily: 'Inter', fontSize: 13, color: t.destructive }}>{err}</p>}
          <button
            type="submit"
            disabled={busy}
            className="w-full mt-5 transition hover:opacity-90 disabled:opacity-60"
            style={{ height: 46, borderRadius: t.radius, background: t.primary, fontFamily: 'Inter', fontWeight: 600, fontSize: 14.5, color: t.primaryForeground }}
          >
            {busy ? 'Entrando…' : 'Entrar no painel'}
          </button>
          {connected ? (
            <div className="mt-5 flex items-center gap-2 justify-center">
              <span className="rounded-full" style={{ width: 6, height: 6, background: t.success }} />
              <p style={{ fontFamily: 'Inter', fontSize: 12, color: t.mutedForeground }}>Conectado — edições ficam salvas na nuvem</p>
            </div>
          ) : (
            <div className="mt-5" style={{ borderRadius: t.radius, padding: 12, background: t.muted, border: `1px solid ${t.border}` }}>
              <p style={{ fontFamily: 'Inter', fontSize: 12, lineHeight: '18px', color: t.mutedForeground }}>
                Modo local de demonstração — qualquer senha entra e as edições ficam salvas só neste navegador.
              </p>
            </div>
          )}
        </div>
      </form>
    </section>
  );
}
