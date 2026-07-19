import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import {
  BrainCircuit, GraduationCap, Telescope, Stethoscope, Landmark, ShieldCheck, FileSearch, LineChart, Scale, HeartHandshake, Globe2,
} from 'lucide-react';
import Hero80, { STRIP_THEMES } from '../../components/Hero80';
import FAQAccordion from '../../components/FAQAccordion';
import CTABanner from '../../components/CTABanner';
import HubButton from '../../components/HubButton';
import { useReveal } from '../../components/useReveal';
import { useTilt } from '../../components/useTilt';

gsap.registerPlugin(ScrollTrigger);

/* ═══════════ Dados ═══════════ */

const STATS = [
  { value: 100, prefix: '+', label: 'Projetos de inovação abrigados' },
  { value: 10, label: 'Anos de experiência govtech' },
  { value: 3, label: 'Pilares integrados' },
  { value: '5.570', label: 'Municípios endereçáveis', accent: true },
  { value: 1, label: 'Observatório de IA' },
  { value: 'ODS', label: 'Referencial de impacto' },
];

const PILARES = [
  {
    Icon: BrainCircuit, titulo: 'Ferramentas de IA',
    desc: 'Assistentes de IA para as secretarias, automação de rotinas, apoio a minutas, pareceres e atendimento ao cidadão — pronto pra usar, sem projeto faraônico.',
  },
  {
    Icon: GraduationCap, titulo: 'Formação de servidores',
    desc: 'Trilhas práticas e contínuas para o servidor público usar IA com critério — da secretaria de educação à procuradoria. Base educacional Premier Niveau.',
  },
  {
    Icon: Telescope, titulo: 'Observatório de IA',
    desc: 'Diagnóstico de maturidade, benchmark entre municípios e dados que sustentam decisão — a régua pública de como a IA avança no setor público brasileiro.',
  },
];

const MODULOS = [
  { Icon: FileSearch, titulo: 'Diagnóstico de maturidade', desc: 'Onde o município está e qual o plano realista de 90 dias.' },
  { Icon: Stethoscope, titulo: 'Assistentes por secretaria', desc: 'Saúde, educação, fazenda, administração — casos de uso prontos.' },
  { Icon: GraduationCap, titulo: 'Capacitação contínua', desc: 'Formação prática de servidores, com certificação do ecossistema.' },
  { Icon: Scale, titulo: 'LGPD, ética e compliance', desc: 'Uso responsável por padrão: dados protegidos e critérios públicos.' },
  { Icon: Landmark, titulo: 'Editais e captação', desc: 'Apoio na busca de recursos e convênios para financiar a agenda.' },
  { Icon: LineChart, titulo: 'Painéis e indicadores', desc: 'Dashboards de gestão e comparativos do Observatório de IA.' },
];

const PASSOS = [
  { num: '01', titulo: 'Adesão', desc: 'Contrato de assinatura simples, dimensionado ao porte do município ou consórcio — sem obra, sem legado de TI travado.' },
  { num: '02', titulo: 'Implantação', desc: 'Diagnóstico de maturidade, definição de prioridades e primeiras entregas visíveis nas secretarias em semanas, não em anos.' },
  { num: '03', titulo: 'Evolução', desc: 'Formação contínua, novos módulos e a régua do Observatório mostrando o avanço — assinatura é caminhada, não foto.' },
];

const FAQ = [
  { q: 'O que é a GovIA?', a: 'A GovIA é a plataforma de assinatura de IA do HUB PAN para municípios, estados e consórcios públicos. Em um único contrato, o ente público acessa ferramentas de IA aplicadas à gestão, formação contínua de servidores e o Observatório de IA — com a experiência govtech de dez anos da eGov Tecnologia por trás.' },
  { q: 'Serve para municípios pequenos?', a: 'Sim — o modelo de assinatura existe exatamente pra isso. Em vez de um projeto de tecnologia caro e arriscado, o município adere a uma plataforma pronta, dimensionada ao seu porte, e evolui no seu ritmo. Consórcios intermunicipais são um caminho natural de entrada.' },
  { q: 'Minha prefeitura precisa de equipe técnica?', a: 'Não. A implantação parte do diagnóstico de maturidade e prioriza casos de uso que funcionam com a equipe que o município já tem. A formação de servidores faz parte da assinatura — a plataforma cresce junto com a capacidade do time.' },
  { q: 'E a proteção dos dados do município?', a: 'LGPD, ética e compliance são um dos módulos centrais da GovIA, não um adendo. Uso responsável de IA — transparência algorítmica, proteção de dados e supervisão humana — é critério de projeto, alinhado à Governança de IA do HUB PAN.' },
  { q: 'Como contratar?', a: 'Fale com a equipe pelo formulário de contato. O primeiro passo é uma conversa de diagnóstico para entender o contexto do município ou consórcio e apresentar o plano de adesão adequado ao porte.' },
];

/* ═══════════ Seções ═══════════ */

/* Pilares — seção escura, 3 glass cards com tilt */
function PilarCard({ p }: { p: (typeof PILARES)[number] }) {
  const tilt = useTilt<HTMLDivElement>(6, 8);
  const { Icon } = p;
  return (
    <div
      ref={tilt}
      className="rounded-[20px] p-8 lg:p-9 flex flex-col"
      style={{ backdropFilter: 'blur(15px)', WebkitBackdropFilter: 'blur(15px)', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}
      data-animate
    >
      <span className="flex items-center justify-center rounded-full mb-7" style={{ width: 60, height: 60, background: 'rgba(210,231,24,0.12)' }}>
        <Icon size={28} strokeWidth={2} color="#d2e718" />
      </span>
      <h3 className="mb-3" style={{ fontFamily: 'Luxenta', fontWeight: 600, fontSize: 25, lineHeight: 1.05, color: '#fff' }}>{p.titulo}</h3>
      <p style={{ fontFamily: 'Inter', fontSize: 15, lineHeight: '25px', color: 'rgba(255,255,255,0.78)' }}>{p.desc}</p>
    </div>
  );
}

function SecPilares() {
  const ref = useReveal<HTMLElement>();
  return (
    <section id="govia-pilares" ref={ref} className="relative w-full bg-navy900 overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.03) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
      <div className="relative gutter py-24 lg:py-32 lg:min-h-screen flex flex-col justify-center">
        <div className="mb-14 max-w-[720px]">
          <p className="eyebrow mb-6" style={{ color: 'rgba(255,255,255,0.69)' }} data-animate>O QUE É A GOVIA</p>
          <h2 className="mb-5" style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 'clamp(32px,4vw,50px)', letterSpacing: '-0.5px', lineHeight: 1, color: '#fff' }} data-animate>
            Três pilares. <span style={{ color: '#d2e718' }}>Um contrato.</span> Zero projeto faraônico.
          </h2>
          <p style={{ fontFamily: 'Inter', fontSize: 16, lineHeight: '27px', color: '#d6d6d6', maxWidth: 640 }} data-animate>
            A GovIA nasceu do nicho que deu origem ao ecossistema: dez anos de eGov Tecnologia dentro da realidade de municípios e estados brasileiros. Não é software vendido de fora — é plataforma construída de dentro.
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {PILARES.map((p) => <PilarCard key={p.titulo} p={p} />)}
        </div>
      </div>
    </section>
  );
}

/* Módulos — 6 cards brancos com tilt */
function ModuloCard({ m }: { m: (typeof MODULOS)[number] }) {
  const tilt = useTilt<HTMLDivElement>(5, 7);
  const { Icon } = m;
  return (
    <div ref={tilt} className="rounded-[20px] bg-white p-7 flex flex-col" style={{ border: '1px solid #ecedf0' }} data-animate>
      <span className="flex items-center justify-center rounded-full mb-6" style={{ width: 52, height: 52, background: '#f5f5f5' }}>
        <Icon size={24} strokeWidth={2} color="#2d4ebf" />
      </span>
      <h3 className="mb-2" style={{ fontFamily: 'Luxenta', fontWeight: 600, fontSize: 21, lineHeight: 1.1, color: '#152852' }}>{m.titulo}</h3>
      <p style={{ fontFamily: 'Inter', fontSize: 14, lineHeight: '23px', color: '#797979' }}>{m.desc}</p>
    </div>
  );
}

function SecModulos() {
  const ref = useReveal<HTMLElement>();
  return (
    <section ref={ref} className="py-24 lg:py-32 gutter" style={{ background: '#f5f5f5' }}>
      <div className="mb-14 max-w-[700px]">
        <p className="eyebrow text-muted mb-6" data-animate>O QUE ESTÁ INCLUÍDO</p>
        <h2 className="mb-4" style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 'clamp(32px,4vw,50px)', letterSpacing: '-0.5px', lineHeight: 1, color: '#152852' }} data-animate>
          Uma assinatura. Seis frentes de trabalho.
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {MODULOS.map((m) => <ModuloCard key={m.titulo} m={m} />)}
      </div>
    </section>
  );
}

/* Como funciona — 3 passos */
function SecComoFunciona() {
  const ref = useReveal<HTMLElement>();
  return (
    <section ref={ref} className="py-24 lg:py-32 gutter bg-white">
      <div className="mb-16 max-w-[680px]">
        <p className="eyebrow text-muted mb-6" data-animate>COMO FUNCIONA</p>
        <h2 className="mb-4" style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 'clamp(32px,4vw,50px)', letterSpacing: '-0.5px', lineHeight: 1, color: '#152852' }} data-animate>
          Da assinatura à primeira entrega, sem drama.
        </h2>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-10 gap-y-12">
        {PASSOS.map((p) => (
          <div key={p.num} className="lg:border-l lg:pl-8" style={{ borderColor: '#ecedf0' }} data-animate>
            <p style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 88, lineHeight: 1, letterSpacing: '-2px', color: '#d2e718' }}>{p.num}</p>
            <h3 className="mt-4 mb-3" style={{ fontFamily: 'Luxenta', fontWeight: 600, fontSize: 24, lineHeight: 1.05, color: '#152852' }}>{p.titulo}</h3>
            <p style={{ fontFamily: 'Inter', fontSize: 15, lineHeight: '25px', color: '#797979' }}>{p.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* IA responsável — banda com gradiente e círculos glass */
function SecResponsavel() {
  const ref = useReveal<HTMLElement>();
  return (
    <section ref={ref} className="py-24 lg:py-32 gutter" style={{ background: 'linear-gradient(39.8deg, #ffffff 65.3%, #d2e718 99%)' }}>
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <div>
          <p className="eyebrow text-muted mb-6" data-animate>GOVERNANÇA DE IA</p>
          <h2 className="mb-6" style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 'clamp(32px,4vw,50px)', letterSpacing: '-0.5px', lineHeight: 1, color: '#152852' }} data-animate>
            IA responsável não é discurso. É critério de projeto.
          </h2>
          <p className="mb-9" style={{ fontFamily: 'Inter', fontSize: 16, lineHeight: '27px', color: '#797979', maxWidth: 560 }} data-animate>
            Toda a GovIA opera sob a Governança de IA do HUB PAN: centrada nas pessoas, alinhada aos ODS e com regras claras de dados e transparência algorítmica — porque no setor público, confiança é o produto.
          </p>
          <div data-animate>
            <Link to="/o-hub-pan"><HubButton size="lg" variant="navy">Conheça nossa governança</HubButton></Link>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-5" data-animate>
          {[
            { Icon: ShieldCheck, t: 'Transparência algorítmica' },
            { Icon: Scale, t: 'LGPD por padrão' },
            { Icon: HeartHandshake, t: 'Centrada nas pessoas' },
            { Icon: Globe2, t: 'Alinhada aos ODS' },
          ].map(({ Icon, t }) => (
            <div key={t} className="flex flex-col items-start gap-4 rounded-[20px] p-6"
              style={{ backdropFilter: 'blur(30px)', WebkitBackdropFilter: 'blur(30px)', background: 'rgba(255,255,255,0.35)', border: '1px solid rgba(210,231,24,0.5)' }}>
              <span className="flex items-center justify-center rounded-full" style={{ width: 52, height: 52, background: 'rgba(21,40,82,0.06)' }}>
                <Icon size={24} strokeWidth={2} color="#152852" />
              </span>
              <p style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 15, color: '#152852' }}>{t}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SecFAQ() {
  const ref = useReveal<HTMLElement>();
  return (
    <section ref={ref} className="py-24 lg:py-32 gutter bg-white">
      <div className="grid lg:grid-cols-[1fr_1.4fr] gap-12">
        <div>
          <p className="eyebrow text-muted mb-6" data-animate>PERGUNTAS FREQUENTES</p>
          <h2 className="mb-4" style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 'clamp(32px,4vw,50px)', letterSpacing: '-0.5px', lineHeight: 1, color: '#152852' }} data-animate>
            O essencial sobre a GovIA.
          </h2>
          <p style={{ fontFamily: 'Inter', fontSize: 16, lineHeight: '27px', color: '#797979' }} data-animate>
            Não achou sua resposta? <Link to="/contato" className="underline" style={{ color: '#2d4ebf' }}>Fale com a equipe</Link>.
          </p>
        </div>
        <div data-animate>
          <FAQAccordion items={FAQ} />
        </div>
      </div>
    </section>
  );
}

/* ═══════════ Página ═══════════ */

export default function GovIA() {
  return (
    <>
      <Hero80
        img="/images/s8-governanca-bg.webp"
        imgAlt="Prédio institucional"
        eyebrow="ASSINATURA · GOVERNOS · IA APLICADA"
        title={<>Inteligência artificial<br />aplicada à gestão<br /><span style={{ color: '#d2e718' }}>pública real.</span></>}
        sub="A GovIA é a plataforma de assinatura de IA do HUB PAN para municípios, estados e consórcios públicos — ferramentas, formação de servidores e o Observatório de IA em um único contrato."
        actions={<>
          <Link to="/contato"><HubButton size="lg" variant="lime">Fale com a equipe GovIA</HubButton></Link>
          <HubButton size="lg" variant="blue" onClick={() => ScrollSmoother.get()?.scrollTo('#govia-pilares', true)}>Ver como funciona</HubButton>
        </>}
        stats={STATS}
        strip={STRIP_THEMES.navy}
      />
      <SecPilares />
      <SecModulos />
      <SecComoFunciona />
      <SecResponsavel />
      <SecFAQ />
      <CTABanner
        title={<>Seu município na <span style={{ color: '#d2e718' }}>era da IA.</span></>}
        sub="Comece com um diagnóstico de maturidade e um plano realista de 90 dias."
        actions={<>
          <Link to="/contato"><HubButton size="lg" variant="lime">Agendar diagnóstico</HubButton></Link>
          <Link to="/contato"><HubButton size="lg" variant="navy">Falar com especialista</HubButton></Link>
        </>}
      />
    </>
  );
}
