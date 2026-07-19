import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Building2, CheckCircle2, Landmark, Briefcase, GraduationCap, Newspaper } from 'lucide-react';
import HubButton from '../../components/HubButton';
import { useReveal } from '../../components/useReveal';
import { useTilt } from '../../components/useTilt';

/* ═══════════ Dados ═══════════ */

const SEDES = [
  { Icon: MapPin, tag: 'SEDE GLOBAL', nome: 'Harvard Square', desc: 'Cambridge, Massachusetts — EUA' },
  { Icon: Building2, tag: 'SEDE BRASIL', nome: 'Avenida Paulista', desc: 'São Paulo, SP — Brasil · a partir de 2026' },
];

const PORTAS = [
  { Icon: Landmark, titulo: 'Governos', desc: 'Municípios, estados e consórcios: a porta de entrada é a GovIA.', to: '/govia', link: 'Conhecer a GovIA' },
  { Icon: Briefcase, titulo: 'Empresas & investidores', desc: 'Patrocínio, delegações e rede: comece pelo Fórum Mundial de IA.', to: '/forum-mundial-ia', link: 'Conhecer o WAIF' },
  { Icon: GraduationCap, titulo: 'Educadores & profissionais', desc: 'Bolsas, formação e imersão internacional: seu caminho é o PROINTER.', to: '/prointer', link: 'Conhecer o PROINTER' },
  { Icon: Newspaper, titulo: 'Imprensa', desc: 'Releases, dados do ecossistema e kit de marca na sala de imprensa.', to: '/imprensa', link: 'Sala de imprensa' },
];

const PERFIS = ['Governo ou órgão público', 'Empresa ou investidor', 'Educador ou profissional', 'Universidade ou ICT', 'Imprensa', 'Outro'];

const INPUT_STYLE: React.CSSProperties = {
  height: 52, borderRadius: 12, background: '#f5f5f5', border: '1px solid #ecedf0',
  fontFamily: 'Inter', fontSize: 15, color: '#152852', padding: '0 18px', width: '100%', outline: 'none',
};

/* ═══════════ Formulário ═══════════ */

function FormCard() {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="rounded-[20px] bg-white p-8 lg:p-12 flex flex-col items-center justify-center text-center min-h-[560px]" style={{ border: '1px solid #ecedf0', boxShadow: '0 24px 80px rgba(6,9,25,0.12)' }}>
        <CheckCircle2 size={64} strokeWidth={1.5} color="#d2e718" style={{ background: '#152852', borderRadius: '50%', padding: 12, width: 80, height: 80 }} />
        <h3 className="mt-8 mb-3" style={{ fontFamily: 'Luxenta', fontWeight: 600, fontSize: 28, lineHeight: 1, color: '#152852' }}>Mensagem registrada!</h3>
        <p style={{ fontFamily: 'Inter', fontSize: 16, lineHeight: '27px', color: '#797979', maxWidth: 380 }}>
          Obrigado pelo contato. Nossa equipe direciona sua mensagem para a frente certa do ecossistema e retorna em breve.
        </p>
      </div>
    );
  }

  return (
    <form
      className="rounded-[20px] bg-white p-8 lg:p-10"
      style={{ border: '1px solid #ecedf0', boxShadow: '0 24px 80px rgba(6,9,25,0.12)' }}
      onSubmit={(e) => { e.preventDefault(); setSent(true); }}
    >
      <p className="mb-7" style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 11, letterSpacing: '2.2px', textTransform: 'uppercase', color: '#2d4ebf' }}>FORMULÁRIO INSTITUCIONAL</p>
      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block mb-2" style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 13, color: '#152852' }}>Nome completo *</label>
          <input required placeholder="Seu nome" style={INPUT_STYLE} />
        </div>
        <div>
          <label className="block mb-2" style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 13, color: '#152852' }}>E-mail *</label>
          <input required type="email" placeholder="seu@email.com" style={INPUT_STYLE} />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block mb-2" style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 13, color: '#152852' }}>Organização</label>
          <input placeholder="Empresa, órgão ou instituição" style={INPUT_STYLE} />
        </div>
        <div>
          <label className="block mb-2" style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 13, color: '#152852' }}>Perfil *</label>
          <select required defaultValue="" style={{ ...INPUT_STYLE, appearance: 'none', color: '#152852' }}>
            <option value="" disabled>Selecione seu perfil</option>
            {PERFIS.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </div>
      <div className="mb-7">
        <label className="block mb-2" style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 13, color: '#152852' }}>Mensagem *</label>
        <textarea required placeholder="Conte em poucas linhas o que você busca no ecossistema" rows={5} style={{ ...INPUT_STYLE, height: 'auto', padding: '14px 18px', resize: 'vertical' }} />
      </div>
      <div className="flex flex-wrap items-center gap-5">
        <HubButton size="lg" variant="blue">Enviar mensagem</HubButton>
        <p style={{ fontFamily: 'Inter', fontSize: 13, color: '#a7a4a4' }}>Respondemos em até 2 dias úteis.</p>
      </div>
    </form>
  );
}

/* ═══════════ Portas de entrada ═══════════ */

function PortaCard({ p }: { p: (typeof PORTAS)[number] }) {
  const tilt = useTilt<HTMLDivElement>(5, 7);
  const { Icon } = p;
  return (
    <Link to={p.to} className="block h-full">
      <div ref={tilt} className="rounded-[20px] bg-white p-7 flex flex-col h-full group cursor-pointer" style={{ border: '1px solid #ecedf0' }} data-animate>
        <span className="flex items-center justify-center rounded-full mb-6 transition-colors duration-300 group-hover:bg-lime" style={{ width: 52, height: 52, background: '#f5f5f5' }}>
          <Icon size={24} strokeWidth={2} color="#152852" />
        </span>
        <h3 className="mb-2" style={{ fontFamily: 'Luxenta', fontWeight: 600, fontSize: 21, lineHeight: 1.1, color: '#152852' }}>{p.titulo}</h3>
        <p className="mb-6" style={{ fontFamily: 'Inter', fontSize: 14, lineHeight: '23px', color: '#797979' }}>{p.desc}</p>
        <p className="mt-auto" style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 14, color: '#2d4ebf' }}>{p.link} →</p>
      </div>
    </Link>
  );
}

/* ═══════════ Página ═══════════ */

export default function Contato() {
  const heroRef = useReveal<HTMLElement>();
  const portasRef = useReveal<HTMLElement>();

  return (
    <>
      {/* Hero escuro com grade + formulário sobreposto */}
      <section ref={heroRef} className="relative w-full bg-navy900 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.035) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        <div className="relative gutter pt-[170px] lg:pt-[220px] pb-[220px]">
          <p className="text-[13px] font-medium uppercase mb-6" style={{ fontFamily: 'Inter', letterSpacing: '5.85px', color: 'rgba(255,255,255,0.5)' }} data-animate>
            CONECTE-SE · FALE COM O ECOSSISTEMA
          </p>
          <h1 className="mb-7 text-white" style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 'clamp(32px, 3vw + 18px, 62px)', lineHeight: 1, letterSpacing: '-1.2px' }} data-animate>
            Toda grande conexão<br />começa com uma<br /><span style={{ color: '#d2e718' }}>conversa simples.</span>
          </h1>
          <p style={{ fontFamily: 'Inter', fontSize: 17, lineHeight: '29px', color: '#d6d6d6', maxWidth: 620 }} data-animate>
            Governo, empresa, educador ou imprensa — conte o que você busca e nossa equipe direciona sua mensagem para a frente certa do HUB PAN.
          </p>
        </div>
      </section>

      {/* Formulário sobreposto + sedes */}
      <section className="gutter pb-24 lg:pb-32" style={{ background: '#f5f5f5' }}>
        <div className="grid lg:grid-cols-[1fr_1.25fr] gap-10 items-start -mt-[160px] relative z-10">
          {/* Sedes e contexto */}
          <div className="order-2 lg:order-1 lg:pt-[190px]">
            <div className="space-y-4 mb-10">
              {SEDES.map(({ Icon, tag, nome, desc }) => (
                <div key={nome} className="flex items-center gap-5 rounded-[20px] bg-white p-6" style={{ border: '1px solid #ecedf0' }}>
                  <span className="flex items-center justify-center rounded-full shrink-0" style={{ width: 52, height: 52, background: '#f5f5f5' }}>
                    <Icon size={24} strokeWidth={2} color="#2d4ebf" />
                  </span>
                  <div>
                    <p style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 10, letterSpacing: '1.8px', textTransform: 'uppercase', color: '#a7a4a4' }}>{tag}</p>
                    <p style={{ fontFamily: 'Luxenta', fontWeight: 600, fontSize: 20, lineHeight: 1.2, color: '#152852' }}>{nome}</p>
                    <p style={{ fontFamily: 'Inter', fontSize: 13.5, color: '#797979' }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <p style={{ fontFamily: 'Inter', fontSize: 15, lineHeight: '26px', color: '#797979', maxWidth: 420 }}>
              Prefere começar explorando? As portas de entrada por perfil estão logo abaixo — cada frente do ecossistema tem seu próprio caminho.
            </p>
          </div>

          {/* Formulário */}
          <div className="order-1 lg:order-2">
            <FormCard />
          </div>
        </div>
      </section>

      {/* Portas de entrada por perfil */}
      <section ref={portasRef} className="py-24 lg:py-32 gutter bg-white">
        <div className="mb-14 max-w-[700px]">
          <p className="eyebrow text-muted mb-6" data-animate>PORTAS DE ENTRADA</p>
          <h2 className="mb-4" style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 'clamp(32px,4vw,50px)', letterSpacing: '-0.5px', lineHeight: 1, color: '#152852' }} data-animate>
            Qual porta é a sua?
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {PORTAS.map((p) => <PortaCard key={p.titulo} p={p} />)}
        </div>
      </section>
    </>
  );
}
