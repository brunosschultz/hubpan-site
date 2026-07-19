import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Landmark, Sparkles, HeartHandshake, MapPin, Building2, Newspaper, CheckCircle2 } from 'lucide-react';
import HubButton from '../../components/HubButton';
import { useReveal } from '../../components/useReveal';
import { useTilt } from '../../components/useTilt';

/* ═══════════ Dados — extraídos do wireframe oficial (page-contato) ═══════════ */

const CAMINHOS: { sigla: string; titulo: string; desc: string; btn: string; to: string; Icon: typeof Landmark; color: 'navy' | 'lime' | 'blue' }[] = [
  { sigla: 'GOV', titulo: 'Governos & Instituições', desc: 'Prefeituras, estados, consórcios interessados em GovIA.', btn: 'Solicitar Demo GovIA', to: '/govia', Icon: Landmark, color: 'navy' },
  { sigla: 'WAIF', titulo: 'Patrocinar o Fórum Mundial de IA', desc: 'Empresas que querem associar-se ao maior evento de IA das Américas.', btn: 'Solicitar Proposta', to: '/forum-mundial-ia', Icon: Sparkles, color: 'lime' },
  { sigla: 'PRO', titulo: 'Apoiar o PROINTER', desc: 'Pessoas físicas, empresas e fundações que querem financiar bolsas de impacto.', btn: 'Fazer uma Doação', to: '/prointer', Icon: HeartHandshake, color: 'blue' },
];

const CAMINHO_COLORS = {
  navy: { bg: '#152852', title: '#fff', desc: 'rgba(255,255,255,0.75)', sigla: '#d2e718', badgeBg: 'rgba(255,255,255,0.1)', badgeIcon: '#fff', btn: '#d2e718' },
  lime: { bg: '#d2e718', title: '#152852', desc: 'rgba(21,40,82,0.8)', sigla: '#152852', badgeBg: 'rgba(21,40,82,0.08)', badgeIcon: '#152852', btn: '#152852' },
  blue: { bg: '#2d4ebf', title: '#fff', desc: 'rgba(255,255,255,0.82)', sigla: '#d2e718', badgeBg: 'rgba(255,255,255,0.12)', badgeIcon: '#fff', btn: '#d2e718' },
} as const;

const ASSUNTOS = ['Parceria estratégica', 'Imprensa e mídia', 'HUB PAN Alliance', 'Outro assunto'];

const ENDERECOS = [
  { Icon: MapPin, tag: 'Sede Global', linha1: 'Harvard Square, Cambridge, MA', linha2: 'Massachusetts, United States', lime: true },
  { Icon: Building2, tag: 'Sede Brasil', linha1: 'Avenida Paulista, São Paulo, SP', linha2: 'Centro econômico e institucional do Brasil', lime: false },
];

const INPUT_STYLE: React.CSSProperties = {
  height: 52, borderRadius: 12, background: '#f5f5f5', border: '1px solid #ecedf0',
  fontFamily: 'Inter', fontSize: 15, color: '#152852', padding: '0 18px', width: '100%', outline: 'none',
};

/* ═══════════ Caminho rápido por perfil ═══════════ */

function CaminhoCard({ c }: { c: (typeof CAMINHOS)[number] }) {
  const tilt = useTilt<HTMLDivElement>(4, 6);
  const { Icon } = c;
  const col = CAMINHO_COLORS[c.color];
  return (
    <Link to={c.to} className="block h-full">
      <div ref={tilt} className="flex flex-col rounded-[20px] p-7 h-full group cursor-pointer" style={{ background: col.bg }} data-animate>
        <div className="flex items-center gap-3 mb-6">
          <span className="flex items-center justify-center rounded-full shrink-0" style={{ width: 48, height: 48, background: col.badgeBg }}>
            <Icon size={22} strokeWidth={2} color={col.badgeIcon} />
          </span>
          <span style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 12, letterSpacing: '1px', color: col.sigla }}>{c.sigla}</span>
        </div>
        <h3 className="mb-2" style={{ fontFamily: 'Luxenta', fontWeight: 600, fontSize: 21, lineHeight: 1.15, color: col.title }}>{c.titulo}</h3>
        <p className="mb-6" style={{ fontFamily: 'Inter', fontSize: 14, lineHeight: '23px', color: col.desc }}>{c.desc}</p>
        <p className="mt-auto" style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 14, color: col.btn }}>{c.btn} →</p>
      </div>
    </Link>
  );
}

/* ═══════════ Formulário ═══════════ */

function FormCard() {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="rounded-[20px] bg-white p-8 lg:p-12 flex flex-col items-center justify-center text-center min-h-[480px]" style={{ border: '1px solid #ecedf0' }}>
        <CheckCircle2 size={64} strokeWidth={1.5} color="#d2e718" style={{ background: '#152852', borderRadius: '50%', padding: 12, width: 80, height: 80 }} />
        <h3 className="mt-8 mb-3" style={{ fontFamily: 'Luxenta', fontWeight: 600, fontSize: 26, lineHeight: 1, color: '#152852' }}>Mensagem enviada!</h3>
        <p style={{ fontFamily: 'Inter', fontSize: 15.5, lineHeight: '26px', color: '#797979', maxWidth: 360 }}>
          Obrigado pelo contato. Nossa equipe retorna em breve.
        </p>
      </div>
    );
  }

  return (
    <form className="rounded-[20px] bg-white p-8 lg:p-9" style={{ border: '1px solid #ecedf0' }} onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
      <h3 className="mb-2" style={{ fontFamily: 'Luxenta', fontWeight: 600, fontSize: 24, lineHeight: 1.1, color: '#152852' }}>Fale com nossa equipe</h3>
      <p className="mb-7" style={{ fontFamily: 'Inter', fontSize: 14.5, lineHeight: '23px', color: '#797979' }}>Para parcerias estratégicas, imprensa ou qualquer assunto institucional.</p>
      <div className="space-y-4">
        <input required placeholder="Nome completo" style={INPUT_STYLE} />
        <div className="grid sm:grid-cols-2 gap-4">
          <input required type="email" placeholder="E-mail" style={INPUT_STYLE} />
          <input placeholder="Organização" style={INPUT_STYLE} />
        </div>
        <select required defaultValue="" style={{ ...INPUT_STYLE, color: '#152852' }}>
          <option value="" disabled>Assunto</option>
          {ASSUNTOS.map((a) => <option key={a}>{a}</option>)}
        </select>
        <textarea required placeholder="Mensagem" rows={5} style={{ ...INPUT_STYLE, height: 'auto', padding: '14px 18px', resize: 'vertical' }} />
        <HubButton size="lg" variant="blue" className="w-full justify-center">Enviar mensagem</HubButton>
      </div>
    </form>
  );
}

/* ═══════════ Página ═══════════ */

export default function Contato() {
  const heroRef = useReveal<HTMLElement>();
  const caminhosRef = useReveal<HTMLElement>();

  return (
    <>
      <section ref={heroRef} className="relative w-full bg-navy900 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.035) 1px, transparent 1px)', backgroundSize: '48px 48px' }}
        />
        <div className="relative gutter pt-[170px] lg:pt-[220px] pb-[200px] lg:pb-[260px]">
          <p className="text-[13px] font-medium uppercase mb-6" style={{ fontFamily: 'Inter', letterSpacing: '5.85px', color: 'rgba(255,255,255,0.5)' }} data-animate>
            CONTATO & CONEXÕES
          </p>
          <h1 className="mb-5 text-white" style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 'clamp(32px, 3vw + 18px, 62px)', lineHeight: 1, letterSpacing: '-1.2px' }} data-animate>
            Vamos conversar.
          </h1>
          <p style={{ fontFamily: 'Inter', fontSize: 17, lineHeight: '29px', color: '#d6d6d6', maxWidth: 560 }} data-animate>
            Seja qual for seu perfil — há um caminho específico para você entrar no ecossistema.
          </p>
        </div>
      </section>

      {/* Form + endereços — sobreposto entre o hero e o resto do conteúdo */}
      <section className="gutter pb-24 lg:pb-32" style={{ background: '#f5f5f5' }}>
        <div className="grid lg:grid-cols-[1fr_1.3fr] gap-10 items-stretch -mt-[150px] lg:-mt-[190px] relative z-10">
          <div className="h-full flex flex-col">
            <h3 className="mb-6 shrink-0 text-white" style={{ fontFamily: 'Luxenta', fontWeight: 600, fontSize: 22, lineHeight: 1.1 }}>Onde estamos.</h3>
            <div className="flex-1 flex flex-col gap-4">
              {ENDERECOS.map(({ Icon, tag, linha1, linha2, lime }) => (
                <div
                  key={tag}
                  className="shrink-0 flex items-center gap-4 rounded-[20px] p-6"
                  style={{ background: lime ? '#d2e718' : '#fff', border: lime ? 'none' : '1px solid #ecedf0' }}
                >
                  <span className="flex items-center justify-center rounded-full shrink-0" style={{ width: 44, height: 44, background: lime ? 'rgba(21,40,82,0.08)' : '#f5f5f5' }}>
                    <Icon size={20} strokeWidth={2} color={lime ? '#152852' : '#2d4ebf'} />
                  </span>
                  <div>
                    <p style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 10, letterSpacing: '1.6px', textTransform: 'uppercase', color: lime ? 'rgba(21,40,82,0.65)' : '#a7a4a4' }}>{tag}</p>
                    <p style={{ fontFamily: 'Luxenta', fontWeight: 600, fontSize: 16, lineHeight: 1.3, color: '#152852' }}>{linha1}</p>
                    <p style={{ fontFamily: 'Inter', fontSize: 13, color: lime ? 'rgba(21,40,82,0.7)' : '#797979' }}>{linha2}</p>
                  </div>
                </div>
              ))}

              <div className="flex-1 flex flex-col justify-center rounded-[20px] p-6 bg-navy">
                <div className="flex items-center gap-4 mb-3">
                  <span className="flex items-center justify-center rounded-full shrink-0" style={{ width: 44, height: 44, background: 'rgba(255,255,255,0.08)' }}>
                    <Newspaper size={20} strokeWidth={2} color="#d2e718" />
                  </span>
                  <p style={{ fontFamily: 'Luxenta', fontWeight: 600, fontSize: 16, color: '#fff' }}>Imprensa & Mídia</p>
                </div>
                <p className="mb-5" style={{ fontFamily: 'Inter', fontSize: 13.5, lineHeight: '22px', color: 'rgba(255,255,255,0.75)' }}>
                  Para press kit, dados do Observatório de IA ou cobertura do lançamento do portal.
                </p>
                <Link to="/imprensa"><HubButton size="sm" variant="lime">Baixar press kit</HubButton></Link>
              </div>
            </div>
          </div>

          <div className="lg:self-start lg:-mt-12">
            <FormCard />
          </div>
        </div>
      </section>

      {/* 3 caminhos rápidos */}
      <section ref={caminhosRef} className="py-24 lg:py-32 gutter bg-white">
        <div className="mb-14 max-w-[700px]">
          <p className="eyebrow text-muted mb-6" data-animate>COMECE POR AQUI</p>
          <h2 style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 'clamp(32px,4vw,50px)', letterSpacing: '-0.5px', lineHeight: 1, color: '#152852' }} data-animate>
            Qual é o seu caminho?
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {CAMINHOS.map((c) => <CaminhoCard key={c.sigla} c={c} />)}
        </div>
      </section>
    </>
  );
}
