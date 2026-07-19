import { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import {
  GraduationCap, Users, Globe2, HeartHandshake, ShieldCheck, FileCheck2, Landmark, Megaphone, BarChart3,
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
  { value: 15, label: 'Edições que sustentam o programa' },
  { value: 10, label: 'Anos de base educacional' },
  { value: 4, label: 'Territórios de imersão' },
  { value: 2, label: 'Públicos prioritários' },
  { value: '2026', label: 'Primeira turma global', accent: true },
  { value: 'ONU', label: 'Imersão institucional' },
];

const PUBLICOS = [
  {
    img: 's7-persona-2', tag: 'EDUCAÇÃO PÚBLICA', nome: 'Professores da rede pública',
    desc: 'Quem forma o Brasil de amanhã merece ver o mundo de hoje. Bolsas de imersão internacional com metodologia própria — e o compromisso de multiplicar o aprendizado na sala de aula.',
  },
  {
    img: 's7-persona-4', tag: 'EMPREENDEDORISMO · MIPAD', nome: 'Afroempreendedores',
    desc: 'Conexão direta com a rede MIPAD, vinculada à ONU: mercado global, mentoria internacional e presença nos ambientes onde as decisões acontecem.',
  },
];

const JORNADA = [
  { num: '01', titulo: 'Seleção', desc: 'Processo público, transparente e por mérito — com critérios divulgados e supervisão da governança acadêmica do HUB PAN.' },
  { num: '02', titulo: 'Preparação', desc: 'Mentoria, trilha de conteúdo e alinhamento cultural antes do embarque. Ninguém atravessa a ponte despreparado.' },
  { num: '03', titulo: 'Imersão', desc: 'Harvard Square, ONU, Nova York e Boston — agenda real com instituições reais, não turismo acadêmico.' },
  { num: '04', titulo: 'Legado', desc: 'De volta ao Brasil, cada bolsista replica o aprendizado na sua rede, escola ou negócio. O impacto é documentado.' },
];

const IMERSAO = [
  { img: 'inst-cambridge-harvard', tag: 'SEDE GLOBAL', nome: 'Harvard Square' },
  { img: 'inst-nyc-onu', tag: 'DIPLOMACIA', nome: 'Nações Unidas' },
  { img: 'inst-boston-mit', tag: 'INOVAÇÃO · TECH', nome: 'Boston · MIT' },
  { img: 'inst-hero-onu', tag: 'DELEGAÇÕES', nome: 'Turmas na ONU' },
];

const BENEFICIOS_MARCA = [
  { Icon: Megaphone, t: 'Naming em turmas e eventos do programa' },
  { Icon: Globe2, t: 'Presença de marca nos 4 territórios de imersão' },
  { Icon: BarChart3, t: 'Relatório anual de impacto, com dados e histórias' },
  { Icon: Landmark, t: 'Conexão institucional com a rede MIPAD · ONU' },
];

const FAQ = [
  { q: 'O que é o PROINTER?', a: 'O PROINTER é o programa internacional de bolsas do HUB PAN: um intercâmbio de alto impacto que leva professores da rede pública e afroempreendedores brasileiros para imersão em Harvard Square, na ONU, em Nova York e em Boston — com preparação prévia, agenda institucional real e compromisso de multiplicação no retorno.' },
  { q: 'Quem pode participar?', a: 'Os dois públicos prioritários são professores da rede pública de ensino e afroempreendedores. Os critérios detalhados de cada turma (região, área de atuação, tempo de experiência) são divulgados no edital de seleção correspondente.' },
  { q: 'Quanto custa para o bolsista?', a: 'O modelo do PROINTER é de bolsas custeadas por patrocinadores e apoiadores do ecossistema — empresas e organizações que enxergam no programa uma frente concreta de ESG. As condições específicas de cada turma constam no edital.' },
  { q: 'Como funciona a seleção?', a: 'Por processo público e transparente, com critérios objetivos publicados em edital e supervisão da governança acadêmica do HUB PAN — a mesma estrutura que valida os programas educacionais do ecossistema desde a Premier Niveau.' },
  { q: 'Como minha empresa pode apoiar?', a: 'Patrocinando bolsas, turmas ou territórios de imersão. O patrocinador recebe naming, presença de marca internacional, relatório de impacto documentado e conexão com a rede MIPAD · ONU. Fale com nossa equipe para conhecer as cotas.' },
];

/* ═══════════ Seções ═══════════ */

/* Propósito — 100vh, gradiente claro→lime, foto com selo glass flutuante */
function SecProposito() {
  const ref = useReveal<HTMLElement>();
  return (
    <section ref={ref} className="relative w-full overflow-hidden" style={{ background: 'linear-gradient(39.8deg, #ffffff 65.3%, #d2e718 99%)' }}>
      <div className="gutter grid lg:grid-cols-2 gap-12 lg:gap-20 py-20 lg:py-0 lg:h-screen items-center">
        <div className="lg:h-screen flex flex-col justify-center">
          <p className="eyebrow text-muted mb-6" data-animate>PROPÓSITO · POR QUE O PROINTER EXISTE</p>
          <h2 className="mb-6" style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 'clamp(32px,4vw,50px)', letterSpacing: '-0.5px', lineHeight: 1, color: '#152852' }} data-animate>
            Talento o Brasil tem de sobra. O que faltava era a ponte.
          </h2>
          <p className="mb-5" style={{ fontFamily: 'Inter', fontSize: 17, lineHeight: '30px', color: '#797979', maxWidth: 560 }} data-animate>
            Quem transforma o país todos os dias — na sala de aula da escola pública, no negócio construído contra a estatística — raramente tem acesso aos ambientes onde o futuro é decidido.
          </p>
          <p className="mb-9" style={{ fontFamily: 'Inter', fontSize: 17, lineHeight: '30px', color: '#797979', maxWidth: 560 }} data-animate>
            O PROINTER existe pra corrigir isso: imersão internacional de verdade, com metodologia própria, nos endereços mais disputados do mundo — e retorno multiplicado no Brasil.
          </p>
          <div className="flex flex-wrap gap-5" data-animate>
            {[
              { Icon: GraduationCap, t: 'Professores da rede pública' },
              { Icon: Users, t: 'Afroempreendedores' },
              { Icon: Globe2, t: 'Imersão internacional real' },
            ].map(({ Icon, t }) => (
              <div key={t} className="flex items-center gap-3">
                <span
                  className="flex items-center justify-center rounded-full shrink-0"
                  style={{ width: 52, height: 52, backdropFilter: 'blur(30px)', WebkitBackdropFilter: 'blur(30px)', background: 'rgba(255,255,255,0.30)', border: '1px solid rgba(210,231,24,0.5)' }}
                >
                  <Icon size={22} strokeWidth={2} color="#152852" />
                </span>
                <span style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 14, color: '#152852' }}>{t}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative lg:h-screen flex items-center justify-center">
          <div className="relative w-full" style={{ maxWidth: 560 }} data-animate>
            <div className="overflow-hidden rounded-[20px]" style={{ aspectRatio: '4 / 3' }}>
              <img src="/images/prointer-harvard-t.webp" alt="Estação Harvard — Cambridge, MA" className="w-full h-full object-cover" />
            </div>
            {/* Selo glass flutuante */}
            <div
              className="absolute -bottom-6 left-6 flex items-center gap-3 rounded-full px-5 py-3"
              style={{ backdropFilter: 'blur(17.6px)', WebkitBackdropFilter: 'blur(17.6px)', background: 'rgba(21,40,82,0.85)', border: '0.88px solid rgba(255,255,255,0.25)' }}
            >
              <Globe2 size={18} strokeWidth={2} color="#d2e718" />
              <span style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 13, color: '#fff' }}>Harvard Square · Cambridge, MA</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* Públicos — 2 photocards + 1 card lime tipográfico */
function PublicoCard({ p }: { p: (typeof PUBLICOS)[number] }) {
  const tilt = useTilt<HTMLDivElement>(5, 7);
  return (
    <div ref={tilt} className="flex flex-col rounded-[20px] overflow-hidden bg-white" style={{ border: '1px solid #ecedf0' }} data-animate>
      <div className="relative overflow-hidden shrink-0 h-[240px]">
        <img src={`/images/${p.img}.webp`} alt={p.nome} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
      </div>
      <div className="flex flex-col flex-1 p-7">
        <p className="mb-3" style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 10.5, letterSpacing: '1.8px', textTransform: 'uppercase', color: '#2d4ebf' }}>{p.tag}</p>
        <h3 className="mb-3" style={{ fontFamily: 'Luxenta', fontWeight: 600, fontSize: 24, lineHeight: 1.05, color: '#152852' }}>{p.nome}</h3>
        <p style={{ fontFamily: 'Inter', fontSize: 14, lineHeight: '23px', color: '#797979' }}>{p.desc}</p>
      </div>
    </div>
  );
}

function SecPublicos() {
  const ref = useReveal<HTMLElement>();
  const tiltLime = useTilt<HTMLDivElement>(5, 7);
  return (
    <section ref={ref} className="py-24 lg:py-32 gutter" style={{ background: '#f5f5f5' }}>
      <div className="mb-14 max-w-[700px]">
        <p className="eyebrow text-muted mb-6" data-animate>PARA QUEM É O PROGRAMA</p>
        <h2 className="mb-4" style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 'clamp(32px,4vw,50px)', letterSpacing: '-0.5px', lineHeight: 1, color: '#152852' }} data-animate>
          Dois públicos. Um mesmo critério: quem multiplica.
        </h2>
        <p style={{ fontFamily: 'Inter', fontSize: 16, lineHeight: '27px', color: '#797979' }} data-animate>
          O PROINTER não seleciona currículos impressionantes — seleciona pessoas cujo crescimento vira crescimento de muitos.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {PUBLICOS.map((p) => <PublicoCard key={p.nome} p={p} />)}
        <div ref={tiltLime} className="flex flex-col rounded-[20px] p-7 bg-lime" data-animate>
          <div className="flex items-center justify-center rounded-full mb-auto" style={{ width: 56, height: 56, background: 'rgba(21,40,82,0.08)' }}>
            <HeartHandshake size={26} strokeWidth={2} color="#152852" />
          </div>
          <p className="mb-3 mt-8" style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 10.5, letterSpacing: '1.8px', textTransform: 'uppercase', color: 'rgba(21,40,82,0.6)' }}>EFEITO MULTIPLICADOR</p>
          <h3 className="mb-3" style={{ fontFamily: 'Luxenta', fontWeight: 600, fontSize: 24, lineHeight: 1.05, color: '#152852' }}>Quem volta, transforma.</h3>
          <p style={{ fontFamily: 'Inter', fontSize: 14, lineHeight: '23px', color: 'rgba(21,40,82,0.85)' }}>
            Cada bolsista assume o compromisso de replicar o aprendizado — na rede de ensino, na comunidade, no ecossistema. Uma bolsa nunca beneficia uma pessoa só.
          </p>
        </div>
      </div>
    </section>
  );
}

/* Jornada — 4 etapas com número gigante e linha de progresso animada */
function SecJornada() {
  const ref = useReveal<HTMLElement>();
  const lineRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const line = lineRef.current;
    if (!line) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(line, { scaleX: 0 }, {
        scaleX: 1, ease: 'none', transformOrigin: 'left center',
        scrollTrigger: { trigger: line, start: 'top 80%', end: 'bottom 35%', scrub: 0.6 },
      });
    }, line);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="py-24 lg:py-32 gutter bg-white overflow-hidden">
      <div className="mb-16 max-w-[680px]">
        <p className="eyebrow text-muted mb-6" data-animate>A JORNADA DO BOLSISTA</p>
        <h2 className="mb-4" style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 'clamp(32px,4vw,50px)', letterSpacing: '-0.5px', lineHeight: 1, color: '#152852' }} data-animate>
          Quatro etapas. Um antes e depois.
        </h2>
      </div>

      {/* Linha de progresso */}
      <div className="relative mb-10 hidden lg:block">
        <div className="h-px w-full" style={{ background: '#ecedf0' }} />
        <div ref={lineRef} className="absolute top-0 left-0 h-[2px] w-full bg-lime" style={{ transform: 'scaleX(0)' }} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
        {JORNADA.map((j) => (
          <div key={j.num} data-animate>
            <p style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 88, lineHeight: 1, letterSpacing: '-2px', color: '#ecedf0' }}>{j.num}</p>
            <h3 className="mt-4 mb-3" style={{ fontFamily: 'Luxenta', fontWeight: 600, fontSize: 24, lineHeight: 1.05, color: '#152852' }}>{j.titulo}</h3>
            <p style={{ fontFamily: 'Inter', fontSize: 14.5, lineHeight: '24px', color: '#797979' }}>{j.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* Imersão — seção escura com 4 tiles fotográficos */
function SecImersao() {
  const ref = useReveal<HTMLElement>();
  return (
    <section ref={ref} className="relative w-full bg-navy900 overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.03) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
      <div className="relative gutter py-24 lg:py-32">
        <div className="mb-14 max-w-[700px]">
          <p className="eyebrow mb-6" style={{ color: 'rgba(255,255,255,0.69)' }} data-animate>OS TERRITÓRIOS DA IMERSÃO</p>
          <h2 className="mb-4" style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 'clamp(32px,4vw,50px)', letterSpacing: '-0.5px', lineHeight: 1, color: '#fff' }} data-animate>
            Agenda real, em <span style={{ color: '#d2e718' }}>endereços reais.</span>
          </h2>
          <p style={{ fontFamily: 'Inter', fontSize: 16, lineHeight: '27px', color: '#d6d6d6' }} data-animate>
            Nada de tour de ônibus com foto no portão. A imersão do PROINTER acontece dentro das instituições — com a credencial de dez anos de relações do ecossistema.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {IMERSAO.map((t) => (
            <div key={t.nome} className="group relative rounded-[20px] overflow-hidden h-[320px]" data-animate>
              <img src={`/images/${t.img}.webp`} alt={t.nome} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(6,9,25,0.88) 0%, rgba(6,9,25,0.25) 55%, rgba(6,9,25,0.05) 100%)' }} />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <p className="mb-2" style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 10, letterSpacing: '1.6px', textTransform: 'uppercase', color: '#d2e718' }}>{t.tag}</p>
                <h3 style={{ fontFamily: 'Luxenta', fontWeight: 600, fontSize: 22, lineHeight: 1.1, color: '#fff' }}>{t.nome}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* Apoie — patrocínio ESG */
function SecApoie() {
  const ref = useReveal<HTMLElement>();
  const tilt = useTilt<HTMLDivElement>(4, 6);
  return (
    <section id="prointer-apoie" ref={ref} className="py-24 lg:py-32 gutter" style={{ background: 'linear-gradient(39.8deg, #ffffff 65.3%, #d2e718 99%)' }}>
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <div>
          <p className="eyebrow text-muted mb-6" data-animate>PATROCÍNIO · ESG DE VERDADE</p>
          <h2 className="mb-6" style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 'clamp(32px,4vw,50px)', letterSpacing: '-0.5px', lineHeight: 1, color: '#152852' }} data-animate>
            Apoiar o PROINTER é impacto que aparece no relatório — e na vida real.
          </h2>
          <p className="mb-8" style={{ fontFamily: 'Inter', fontSize: 16, lineHeight: '27px', color: '#797979', maxWidth: 560 }} data-animate>
            Educação pública, diversidade e mobilidade internacional em um único programa, com seleção transparente e resultado documentado. É a frente de ESG que a sua marca consegue explicar em uma frase.
          </p>
          <div className="space-y-4 mb-9" data-animate>
            {[
              { Icon: FileCheck2, t: 'Impacto mensurável e documentado, turma a turma' },
              { Icon: ShieldCheck, t: 'Seleção pública com governança acadêmica independente' },
              { Icon: HeartHandshake, t: 'Vínculo direto com ODS, diversidade e educação pública' },
            ].map(({ Icon, t }) => (
              <div key={t} className="flex items-center gap-4">
                <span className="flex items-center justify-center rounded-full shrink-0" style={{ width: 44, height: 44, background: 'rgba(21,40,82,0.06)' }}>
                  <Icon size={20} strokeWidth={2} color="#2d4ebf" />
                </span>
                <span style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 15, color: '#152852' }}>{t}</span>
              </div>
            ))}
          </div>
          <div data-animate>
            <Link to="/contato"><HubButton size="lg" variant="navy">Seja um patrocinador</HubButton></Link>
          </div>
        </div>

        <div ref={tilt} className="rounded-[20px] bg-navy p-8 lg:p-10" data-animate>
          <p className="mb-7" style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 11, letterSpacing: '2.2px', textTransform: 'uppercase', color: '#d2e718' }}>O QUE A SUA MARCA RECEBE</p>
          <div className="space-y-6">
            {BENEFICIOS_MARCA.map(({ Icon, t }, i) => (
              <div key={t} className={`flex items-center gap-4 pb-6 ${i < BENEFICIOS_MARCA.length - 1 ? 'border-b border-white/10' : ''}`}>
                <span className="flex items-center justify-center rounded-full shrink-0" style={{ width: 48, height: 48, background: 'rgba(255,255,255,0.08)' }}>
                  <Icon size={22} strokeWidth={2} color="#d2e718" />
                </span>
                <p style={{ fontFamily: 'Inter', fontSize: 15, lineHeight: '24px', color: '#fff' }}>{t}</p>
              </div>
            ))}
          </div>
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
            O essencial sobre o PROINTER.
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

export default function Prointer() {
  return (
    <>
      <Hero80
        img="/images/prointer-hero-cambridge.webp"
        imgAlt="Panorama de Cambridge, Massachusetts"
        eyebrow="INTERCÂMBIO · IMPACTO · ESG · EDUCAÇÃO"
        title={<>O intercâmbio que leva<br />quem transforma o Brasil<br /><span style={{ color: '#d2e718' }}>ao centro do mundo.</span></>}
        sub="O PROINTER é o programa internacional de bolsas do HUB PAN para professores da rede pública e afroempreendedores — imersão real em Harvard Square, ONU, Nova York e Boston, com metodologia própria e legado documentado."
        actions={<>
          <Link to="/contato"><HubButton size="lg" variant="lime">Quero participar</HubButton></Link>
          <HubButton size="lg" variant="blue" onClick={() => ScrollSmoother.get()?.scrollTo('#prointer-apoie', true)}>Apoiar o PROINTER</HubButton>
        </>}
        stats={STATS}
        strip={STRIP_THEMES.blue}
      />
      <SecProposito />
      <SecPublicos />
      <SecJornada />
      <SecImersao />
      <SecApoie />
      <SecFAQ />
      <CTABanner
        title={<>Pronto para atravessar <span style={{ color: '#d2e718' }}>a ponte?</span></>}
        sub="Inscrições e parcerias da primeira turma global abrem em 2026."
        actions={<>
          <Link to="/contato"><HubButton size="lg" variant="lime">Quero participar</HubButton></Link>
          <Link to="/contato"><HubButton size="lg" variant="navy">Apoiar o programa</HubButton></Link>
        </>}
      />
    </>
  );
}
