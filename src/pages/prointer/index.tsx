import { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import {
  GraduationCap, Users, Globe2, FileCheck2, Heart, Award, Eye, Target, DollarSign, Quote,
} from 'lucide-react';
import Hero80, { STRIP_THEMES } from '../../components/Hero80';
import FAQAccordion from '../../components/FAQAccordion';
import HubButton from '../../components/HubButton';
import GlassHoverCard, { type HoverColor } from '../../components/GlassHoverCard';
import { useReveal, useRevealBidirectional } from '../../components/useReveal';
import { useTilt } from '../../components/useTilt';

gsap.registerPlugin(ScrollTrigger);

/* ═══════════ Dados — conteúdo extraído do wireframe oficial (page-prointer) ═══════════ */

const STATS = [
  { value: 100, suffix: '%', label: 'Gratuito para bolsistas', accent: true },
  { value: 3, label: 'Cidades na jornada' },
  { value: 'ONU', label: 'Acesso institucional' },
  { value: '2027', label: 'Primeira turma' },
  { value: 'ESG', label: 'Impacto comprovado' },
];

const PUBLICOS = [
  {
    img: 's7-persona-2', num: 'Perfil 01', titulo: 'Professores da Rede Pública',
    desc: 'Docentes de escolas municipais e estaduais que se destacam em projetos de inovação pedagógica, inclusão, tecnologia ou impacto social. Seleção a partir do ecossistema HUB PAN e Premier Niveau.',
    bullets: ['Passagem aérea internacional inclusa', 'Hospedagem curada em Nova York e Boston', 'Acesso a Harvard Square, MIT e a ONU', 'Certificação internacional e reconhecimento público'],
  },
  {
    img: 's7-persona-4', num: 'Perfil 02', titulo: 'Afroempreendedores',
    desc: 'Empreendedores negros com negócios ou projetos em andamento que buscam acesso a ecossistemas internacionais de inovação, redes de negócios e relações institucionais. Em parceria com o MIPAD ONU.',
    bullets: ['Acesso à rede MIPAD ONU', 'Networking em Boston e Cambridge', 'Pitch em ambiente internacional', 'Mentoria com investidores internacionais'],
  },
];

const MISSAO = [
  { etapa: '01', cidade: 'Belo Horizonte', titulo: 'Seleção e preparação', desc: 'Análise de perfil acadêmico e profissional, entrevistas, formação preparatória e orientação sobre a missão. São selecionados os bolsistas de melhor performance nos programas do ecossistema HUB PAN e Premier Niveau.', duracao: '30 dias antes da missão' },
  { etapa: '02', cidade: 'Nova York', titulo: 'Chegada e imersão', desc: 'Desembarque em Nova York, hospedagem no entorno de Times Square, visita e experiência dentro das Nações Unidas, participação na Expo New York, networking institucional e reconhecimento formal dos participantes.', duracao: '3 dias', img: 'inst-nyc-onu' },
  { etapa: '03', cidade: 'Boston / Cambridge', titulo: 'Ecossistema de inovação', desc: 'Deslocamento de trem até Boston. Harvard Square, museu do MIT, espaços de inovação, encontros com empreendedores e pesquisadores. Experiências curadas por persona — executivo, educador ou afroempreendedor.', duracao: '3 dias', img: 'inst-cambridge-harvard' },
  { etapa: '04', cidade: 'De volta ao Brasil', titulo: 'Embaixadores e multiplicadores', desc: 'Cada bolsista retorna como Embaixador HUB PAN — com material documentado, certificação internacional e compromisso de multiplicar o impacto na sua comunidade. O professor que foi a Harvard impacta uma geração inteira.', duracao: 'Ciclo contínuo de impacto' },
];

const ORGANIZACOES: { Icon: typeof FileCheck2; tag: string; titulo: string; desc: string; hoverColor: HoverColor }[] = [
  { Icon: FileCheck2, tag: 'ESG', titulo: 'ESG com rastreabilidade total', desc: 'Cada bolsa financiada gera relatório de impacto documentado — dados, depoimentos, fotos e publicações. Insumo direto para relatórios ESG e de sustentabilidade com lastro real.', hoverColor: 'white' },
  { Icon: Heart, tag: 'Fidelização', titulo: 'Fidelização de carteira educacional', desc: 'Os bolsistas são selecionados entre alunos dos programas do ecossistema HUB PAN. Apoiar o PROINTER aumenta retenção e engajamento da base educacional existente.', hoverColor: 'lime' },
  { Icon: Award, tag: 'Marca', titulo: 'Embaixadores da sua marca', desc: 'Cada bolsista que volta do PROINTER se torna um defensor natural das marcas que tornaram sua jornada possível — um loyalty que leva décadas para se construir de outra forma.', hoverColor: 'blue' },
  { Icon: Eye, tag: 'Visibilidade', titulo: 'Reconhecimento no ecossistema', desc: 'Apoiadores recebem reconhecimento no portal HUB PAN, nos eventos do ecossistema e em materiais institucionais — com nível proporcional ao apoio prestado.', hoverColor: 'blue' },
  { Icon: Target, tag: 'ODS', titulo: 'Alinhamento com ODS da ONU', desc: 'O PROINTER está diretamente alinhado com ODS 4 (educação de qualidade), ODS 10 (redução das desigualdades) e ODS 17 (parcerias para os objetivos).', hoverColor: 'lime' },
  { Icon: DollarSign, tag: 'Receita', titulo: 'Modelo de doação B2B e B2C', desc: 'Estrutura de doação transparente para pessoas físicas, empresas privadas, fundações e governos, com contrapartidas claras e públicas para cada categoria.', hoverColor: 'white' },
];

const NIVEIS_APOIO = ['R$ 500 — Apoiador', 'R$ 1.000 — Parceiro', 'R$ 5.000 — Patrocinador de Bolsa', 'R$ 10.000 — Fundador do Programa', 'Outro valor — quero conversar'];

const ECOSSISTEMA = [
  { tag: 'Governos', t: 'GovIA — IA para o setor público', to: '/govia', color: 'blue' as const },
  { tag: '2027', t: 'Fórum Mundial de IA — Cambridge', to: '/forum-mundial-ia', color: 'lime' as const },
  { tag: 'Alliance', t: 'Rede de parceiros estratégicos', to: '/o-hub-pan', color: 'navy' as const },
  { tag: 'Casos', t: 'Histórias de impacto real', to: '/casos-de-uso', color: 'blue' as const },
];

const ECO_COLORS = {
  blue: { bg: '#2d4ebf', text: '#fff', sub: 'rgba(255,255,255,0.7)' },
  lime: { bg: '#d2e718', text: '#152852', sub: 'rgba(21,40,82,0.65)' },
  navy: { bg: '#152852', text: '#fff', sub: 'rgba(255,255,255,0.6)' },
};

const FAQ = [
  { q: 'O PROINTER é um programa de intercâmbio pago?', a: 'Não. O PROINTER é totalmente gratuito para os bolsistas selecionados. Passagem aérea, hospedagem e recursos financeiros para as despesas na missão são integralmente custeados pelo programa — financiado por doações de empresas, governos e pessoas físicas que apoiam o projeto.' },
  { q: 'Qualquer professor pode se candidatar ao PROINTER?', a: 'O PROINTER prioriza professores da rede pública municipal e estadual de todo o Brasil. A seleção é feita com base na performance nos programas do ecossistema HUB PAN e Premier Niveau, e também considera projetos de inovação pedagógica, inclusão e impacto social desenvolvidos pelo candidato em sua escola ou comunidade.' },
  { q: 'O que é o PROINTER exatamente?', a: 'O PROINTER — Programa de Intercâmbio e Impacto — é uma iniciativa do HUB PAN que leva professores da rede pública brasileira e afroempreendedores a experiências internacionais de alto impacto em Harvard Square, MIT e Nações Unidas em Nova York. O programa é financiado por doações e alinhado aos ODS da ONU — especificamente ODS 4, ODS 10 e ODS 17.' },
  { q: 'Quando começa a primeira turma do PROINTER?', a: 'A primeira missão com bolsistas está prevista para maio de 2027. As inscrições e candidaturas estão abertas continuamente — os perfis são analisados e os selecionados são comunicados com antecedência para a preparação da missão.' },
  { q: 'Como uma empresa pode apoiar o PROINTER?', a: 'Empresas podem apoiar o PROINTER via doação direta ao programa, em diferentes níveis: Apoiador (R$ 500), Parceiro (R$ 1.000), Patrocinador de Bolsa (R$ 5.000) ou Fundador do Programa (R$ 10.000). Cada nível inclui contrapartidas de reconhecimento público, visibilidade no ecossistema e relatórios de impacto ESG rastreáveis.' },
  { q: 'Qual é a diferença entre o PROINTER e um intercâmbio convencional?', a: 'Intercâmbios convencionais são pagos pelo participante e geralmente voltados para estudantes de alta renda. O PROINTER inverte essa lógica: é inteiramente custeado por terceiros, direcionado a quem historicamente não teria acesso a esses ambientes, e desenhado para gerar impacto coletivo — cada bolsista retorna como multiplicador em sua comunidade, escola ou negócio.' },
];

const INPUT_STYLE: React.CSSProperties = {
  height: 48, borderRadius: 10, background: '#f5f5f5', border: '1px solid #ecedf0',
  fontFamily: 'Inter', fontSize: 14, color: '#152852', padding: '0 16px', width: '100%', outline: 'none',
};

/* ═══════════ Proposito — 100vh, gradiente claro→lime, foto com selo glass ═══════════ */

function SecProposito() {
  const ref = useReveal<HTMLElement>();
  return (
    <section ref={ref} className="relative w-full overflow-hidden" style={{ background: 'linear-gradient(39.8deg, #ffffff 65.3%, #d2e718 99%)' }}>
      <div className="gutter grid lg:grid-cols-2 gap-12 lg:gap-16 py-20 lg:py-0 lg:h-screen items-center">
        <div className="lg:h-screen flex flex-col justify-center">
          <p className="eyebrow text-muted mb-6" data-animate>O QUE É O PROINTER</p>
          <h2 className="mb-6" style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 'clamp(32px,4vw,50px)', letterSpacing: '-0.5px', lineHeight: 1, color: '#152852' }} data-animate>
            Mais do que intercâmbio. Uma plataforma de impacto transgeracional.
          </h2>
          <p className="mb-5" style={{ fontFamily: 'Inter', fontSize: 16.5, lineHeight: '28px', color: '#797979', maxWidth: 560 }} data-animate>
            O PROINTER é o mecanismo pelo qual o HUB PAN abre portas normalmente fechadas para professores da rede pública, afroempreendedores e lideranças que raramente acessam Harvard Square, MIT ou as Nações Unidas.
          </p>
          <p className="mb-9" style={{ fontFamily: 'Inter', fontSize: 16.5, lineHeight: '28px', color: '#797979', maxWidth: 560 }} data-animate>
            Ao invés de trazer o mundo para uma sala de aula, o PROINTER leva a pessoa ao mundo — com curadoria completa e suporte financeiro integral, para que o impacto se propague além do participante.
          </p>
          <div className="flex flex-wrap gap-5" data-animate>
            {[
              { Icon: GraduationCap, t: 'Professores da rede pública' },
              { Icon: Users, t: 'Afroempreendedores' },
              { Icon: Globe2, t: '100% gratuito para bolsistas' },
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
          <div className="relative w-full" style={{ maxWidth: 540 }} data-animate>
            <div className="overflow-hidden rounded-[20px]" style={{ aspectRatio: '4 / 3' }}>
              <img src="/images/prointer-harvard-t.webp" alt="Estação Harvard — Cambridge, MA" className="w-full h-full object-cover" />
            </div>
            <div
              className="absolute -bottom-6 left-6 right-6 flex items-center gap-3 rounded-full px-5 py-3"
              style={{ backdropFilter: 'blur(17.6px)', WebkitBackdropFilter: 'blur(17.6px)', background: 'rgba(21,40,82,0.88)', border: '0.88px solid rgba(255,255,255,0.25)' }}
            >
              <Globe2 size={18} strokeWidth={2} color="#d2e718" className="shrink-0" />
              <span style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 12.5, color: '#fff' }}>
                <span style={{ opacity: 0.6 }}>Parceria Fundacional · </span>MIPAD ONU
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════ Públicos — 2 photocards + quote em tipografia grande ═══════════ */

function PublicoCard({ p }: { p: (typeof PUBLICOS)[number] }) {
  const tilt = useTilt<HTMLDivElement>(4, 6);
  return (
    <div ref={tilt} className="flex flex-col rounded-[20px] overflow-hidden bg-white" style={{ border: '1px solid #ecedf0' }} data-animate>
      <div className="relative overflow-hidden shrink-0 h-[280px]">
        <img src={`/images/${p.img}.webp`} alt={p.titulo} className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(6,9,25,0.75) 0%, transparent 55%)' }} />
        <p className="absolute bottom-5 left-6" style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 11, letterSpacing: '2px', textTransform: 'uppercase', color: '#d2e718' }}>{p.num}</p>
      </div>
      <div className="flex flex-col flex-1 p-7 lg:p-8">
        <h3 className="mb-3" style={{ fontFamily: 'Luxenta', fontWeight: 600, fontSize: 26, lineHeight: 1.1, color: '#152852' }}>{p.titulo}</h3>
        <p className="mb-6" style={{ fontFamily: 'Inter', fontSize: 14.5, lineHeight: '24px', color: '#797979' }}>{p.desc}</p>
        <ul className="space-y-3 mb-8">
          {p.bullets.map((b) => (
            <li key={b} className="flex items-start gap-3">
              <span className="mt-[9px] w-[6px] h-[6px] rounded-full shrink-0" style={{ background: '#d2e718' }} />
              <span style={{ fontFamily: 'Inter', fontSize: 14, lineHeight: '22px', color: '#152852' }}>{b}</span>
            </li>
          ))}
        </ul>
        <div className="mt-auto"><HubButton size="md" variant="blue">Quero me candidatar</HubButton></div>
      </div>
    </div>
  );
}

function CitacaoCard() {
  const tilt = useTilt<HTMLDivElement>(4, 6);
  return (
    <div ref={tilt} className="flex flex-col rounded-[20px] p-7 lg:p-8 bg-lime" data-animate>
      <span className="flex items-center justify-center rounded-full mb-6" style={{ width: 52, height: 52, background: 'rgba(21,40,82,0.08)' }}>
        <Quote size={24} strokeWidth={2} color="#152852" fill="#152852" />
      </span>
      <p style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 'clamp(22px,2vw,26px)', lineHeight: 1.3, color: '#152852' }}>
        "Mas a professora não vai para Nova York."
      </p>
      <p className="mt-4" style={{ fontFamily: 'Inter', fontSize: 14, lineHeight: '23px', color: 'rgba(21,40,82,0.75)' }}>
        Essa frase, ouvida no interior de Minas Gerais, é a razão pela qual o PROINTER existe. O HUB PAN pega essa professora e coloca ela lá dentro.
      </p>
    </div>
  );
}

function SecPublicos() {
  const ref = useReveal<HTMLElement>();
  return (
    <section ref={ref} className="py-24 lg:py-32 gutter" style={{ background: '#f5f5f5' }}>
      <div className="mb-14 max-w-[700px]">
        <p className="eyebrow text-muted mb-6" data-animate>PARA QUEM É O PROINTER</p>
        <h2 className="mb-4" style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 'clamp(32px,4vw,50px)', letterSpacing: '-0.5px', lineHeight: 1, color: '#152852' }} data-animate>
          Dois públicos. Um mesmo propósito.
        </h2>
        <p style={{ fontFamily: 'Inter', fontSize: 16, lineHeight: '27px', color: '#797979' }} data-animate>
          O PROINTER atende dois perfis que o HUB PAN considera prioritários — e que historicamente foram mantidos distantes desses ambientes.
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {PUBLICOS.map((p) => <PublicoCard key={p.num} p={p} />)}
        <CitacaoCard />
      </div>
    </section>
  );
}

/* ═══════════ Missão — timeline com números gigantes + linha animada por scroll ═══════════ */

function MissaoItem({ item, side }: { item: (typeof MISSAO)[number]; side: 'left' | 'right' }) {
  const ref = useRevealBidirectional<HTMLDivElement>(0.08);
  return (
    <div ref={ref} className="relative pb-20 last:pb-0">
      <span className="absolute rounded-full top-0 left-1/2 -translate-x-1/2 z-10" style={{ width: 12, height: 12, background: '#fff', border: '2px solid #a7a4a4' }} data-animate />
      <div className="relative z-[5] text-center pt-8 mb-5" data-animate>
        <p style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 'clamp(44px, 5.5vw, 96px)', lineHeight: 1, letterSpacing: '-2.5px', color: '#2d4ebf' }}>
          {item.etapa}
        </p>
        <p className="mt-2" style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 11, letterSpacing: '1.8px', textTransform: 'uppercase', color: '#a7a4a4' }}>
          {item.duracao}
        </p>
      </div>
      <div className={`lg:w-[calc(50%-56px)] ${side === 'left' ? 'lg:mr-auto' : 'lg:ml-auto'}`} data-animate>
        <div className={`flex items-center gap-4 mb-3 ${side === 'left' ? 'lg:flex-row-reverse' : ''}`}>
          {item.img && (
            <div className="w-16 h-16 rounded-full overflow-hidden shrink-0" style={{ border: '2px solid #d2e718' }}>
              <img src={`/images/${item.img}.webp`} alt={item.cidade} className="w-full h-full object-cover" />
            </div>
          )}
          <div className={`text-center ${side === 'left' ? 'lg:text-right' : 'lg:text-left'} flex-1`}>
            <h3 style={{ fontFamily: 'Luxenta', fontWeight: 600, fontSize: 'clamp(20px,1.8vw,26px)', lineHeight: 1.1, color: '#152852' }}>{item.cidade}</h3>
            <p style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 13, color: '#2d4ebf' }}>{item.titulo}</p>
          </div>
        </div>
        <p className={`text-center ${side === 'left' ? 'lg:text-right' : 'lg:text-left'}`} style={{ fontFamily: 'Inter', fontSize: 14, lineHeight: '23px', color: '#797979' }}>{item.desc}</p>
      </div>
    </div>
  );
}

function SecMissao() {
  const headRef = useReveal<HTMLDivElement>();
  const wrapRef = useRef<HTMLDivElement>(null);
  const progRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    const prog = progRef.current;
    if (!wrap || !prog) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(prog, { scaleY: 0 }, {
        scaleY: 1, ease: 'none', transformOrigin: 'top center',
        scrollTrigger: { trigger: wrap, start: 'top 62%', end: 'bottom 78%', scrub: 0.6 },
      });
    }, wrap);
    return () => ctx.revert();
  }, []);

  return (
    <section className="pt-24 lg:pt-32 gutter bg-white overflow-hidden">
      <div ref={headRef} className="mb-16 max-w-[680px]">
        <p className="eyebrow text-muted mb-6" data-animate>A MISSÃO</p>
        <h2 className="mb-4" style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 'clamp(32px,4vw,50px)', letterSpacing: '-0.5px', lineHeight: 1, color: '#152852' }} data-animate>
          Uma semana que muda uma trajetória.
        </h2>
        <p style={{ fontFamily: 'Inter', fontSize: 16, lineHeight: '27px', color: '#797979' }} data-animate>
          A jornada PROINTER é desenhada etapa por etapa — com curadoria específica para cada perfil de bolsista.
        </p>
      </div>

      <div ref={wrapRef} className="relative pb-24 lg:pb-32">
        <div className="absolute top-1 bottom-0 w-px" style={{ left: 'calc(50% - 0.5px)', background: '#dcdcdc' }} />
        <div ref={progRef} className="absolute top-1 bottom-0 w-[2px] bg-lime" style={{ left: 'calc(50% - 1px)', transform: 'scaleY(0)' }} />
        {MISSAO.map((item, i) => (
          <MissaoItem key={item.etapa} item={item} side={i % 2 === 0 ? 'left' : 'right'} />
        ))}
      </div>
    </section>
  );
}

/* ═══════════ Para Organizações — glass cards que recolorem no hover ═══════════ */

function SecOrganizacoes() {
  const ref = useReveal<HTMLElement>();
  return (
    <section id="prointer-organizacoes" ref={ref} className="relative w-full bg-navy900 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.03) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
      <div className="relative gutter py-24 lg:py-32">
        <div className="mb-14 max-w-[720px]">
          <p className="eyebrow mb-6" style={{ color: 'rgba(255,255,255,0.69)' }} data-animate>PARA ORGANIZAÇÕES</p>
          <h2 className="mb-4" style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 'clamp(32px,4vw,50px)', letterSpacing: '-0.5px', lineHeight: 1, color: '#fff' }} data-animate>
            O PROINTER como <span style={{ color: '#d2e718' }}>ativo estratégico</span> da sua organização.
          </h2>
          <p style={{ fontFamily: 'Inter', fontSize: 16, lineHeight: '27px', color: '#d6d6d6', maxWidth: 640 }} data-animate>
            Empresas, governos e fundações que apoiam o PROINTER não fazem apenas uma doação — entram em um ecossistema de impacto rastreável com retornos institucionais concretos.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ORGANIZACOES.map((o) => (
            <GlassHoverCard key={o.tag} hoverColor={o.hoverColor} Icon={o.Icon} tag={o.tag} titulo={o.titulo} desc={o.desc} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════ Formulários — apoiar / candidatar, com faixa de cor no topo ═══════════ */

function SecFormularios() {
  const ref = useReveal<HTMLElement>();
  return (
    <section id="prointer-apoie" ref={ref} className="py-24 lg:py-32 gutter" style={{ background: '#f5f5f5' }}>
      <div className="mb-14 max-w-[700px]">
        <p className="eyebrow text-muted mb-6" data-animate>PARTICIPE OU APOIE</p>
        <h2 className="mb-4" style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 'clamp(32px,4vw,50px)', letterSpacing: '-0.5px', lineHeight: 1, color: '#152852' }} data-animate>
          Dois caminhos. Uma missão.
        </h2>
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <form className="rounded-[20px] overflow-hidden bg-white" style={{ border: '1px solid #ecedf0' }} onSubmit={(e) => e.preventDefault()}>
          <div className="p-8 lg:p-9" style={{ background: '#152852' }}>
            <p className="mb-2" style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 11, letterSpacing: '2px', textTransform: 'uppercase', color: '#d2e718' }}>PARA EMPRESAS, GOVERNOS E PESSOAS FÍSICAS</p>
            <h3 className="mb-2" style={{ fontFamily: 'Luxenta', fontWeight: 600, fontSize: 26, lineHeight: 1.1, color: '#fff' }}>Apoiar o PROINTER</h3>
            <p style={{ fontFamily: 'Inter', fontSize: 14, lineHeight: '22px', color: 'rgba(255,255,255,0.75)' }}>Financie bolsas de impacto real com ESG rastreável.</p>
          </div>
          <div className="p-8 lg:p-9 space-y-4">
            <input placeholder="Nome completo" style={INPUT_STYLE} />
            <div className="grid sm:grid-cols-2 gap-4">
              <input placeholder="E-mail" style={INPUT_STYLE} />
              <select defaultValue="" style={{ ...INPUT_STYLE, color: '#152852' }}>
                <option value="" disabled>Perfil</option>
                <option>Pessoa física</option><option>Empresa privada</option><option>Fundação</option><option>Governo</option>
              </select>
            </div>
            <select defaultValue="" style={{ ...INPUT_STYLE, color: '#152852' }}>
              <option value="" disabled>Nível de apoio</option>
              {NIVEIS_APOIO.map((n) => <option key={n}>{n}</option>)}
            </select>
            <textarea placeholder="Mensagem opcional" rows={3} style={{ ...INPUT_STYLE, height: 'auto', padding: '12px 16px', resize: 'vertical' }} />
            <HubButton size="md" variant="blue" className="w-full justify-center">Apoiar o PROINTER</HubButton>
          </div>
        </form>

        <form className="rounded-[20px] overflow-hidden bg-white" style={{ border: '1px solid #ecedf0' }} onSubmit={(e) => e.preventDefault()}>
          <div className="p-8 lg:p-9 bg-lime">
            <p className="mb-2" style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 11, letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(21,40,82,0.6)' }}>PARA PROFESSORES E AFROEMPREENDEDORES</p>
            <h3 className="mb-2" style={{ fontFamily: 'Luxenta', fontWeight: 600, fontSize: 26, lineHeight: 1.1, color: '#152852' }}>Candidatar-se ao PROINTER</h3>
            <p style={{ fontFamily: 'Inter', fontSize: 14, lineHeight: '22px', color: 'rgba(21,40,82,0.75)' }}>Inscrições para a turma 2027 abertas.</p>
          </div>
          <div className="p-8 lg:p-9 space-y-4">
            <input placeholder="Nome completo" style={INPUT_STYLE} />
            <div className="grid sm:grid-cols-2 gap-4">
              <input placeholder="E-mail" style={INPUT_STYLE} />
              <select defaultValue="" style={{ ...INPUT_STYLE, color: '#152852' }}>
                <option value="" disabled>Perfil</option>
                <option>Professor da rede pública</option><option>Afroempreendedor</option>
              </select>
            </div>
            <input placeholder="Cidade e estado" style={INPUT_STYLE} />
            <input placeholder="Escola ou negócio onde atua" style={INPUT_STYLE} />
            <textarea placeholder="Por que você deveria ser bolsista?" rows={3} style={{ ...INPUT_STYLE, height: 'auto', padding: '12px 16px', resize: 'vertical' }} />
            <HubButton size="md" variant="lime" className="w-full justify-center">Enviar candidatura</HubButton>
          </div>
        </form>
      </div>
    </section>
  );
}

/* ═══════════ Também no ecossistema — tiles coloridos ═══════════ */

function SecEcossistema() {
  return (
    <section className="py-16 gutter bg-white">
      <p className="mb-6" style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 12, letterSpacing: '1.6px', textTransform: 'uppercase', color: '#a7a4a4' }}>TAMBÉM NO ECOSSISTEMA HUB PAN</p>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {ECOSSISTEMA.map((e) => {
          const c = ECO_COLORS[e.color];
          return (
            <Link key={e.t} to={e.to} className="group rounded-[16px] p-5 flex flex-col justify-between h-[110px] transition-transform duration-300 hover:-translate-y-1" style={{ background: c.bg }}>
              <span style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 12, letterSpacing: '1px', color: c.sub }}>{e.tag}</span>
              <span style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 13.5, lineHeight: '19px', color: c.text }}>{e.t}</span>
            </Link>
          );
        })}
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
            O que as pessoas mais perguntam sobre o PROINTER.
          </h2>
          <p style={{ fontFamily: 'Inter', fontSize: 16, lineHeight: '27px', color: '#797979' }} data-animate>
            Respostas diretas para quem quer participar, apoiar ou entender como o programa funciona.
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
        eyebrow="PROGRAMA DE INTERCÂMBIO E IMPACTO · ESG · ODS 4 · ODS 10 · ODS 17"
        title="PROINTER"
        sub="O programa que leva professores da rede pública e afroempreendedores para dentro de Harvard Square, MIT e das Nações Unidas — com passagem aérea, hospedagem, suporte financeiro e curadoria completa de experiências. Gratuito para os bolsistas. Transformador para gerações."
        badge={
          <div className="inline-flex items-center gap-3 rounded-full px-5 py-3" style={{ backdropFilter: 'blur(17.6px)', WebkitBackdropFilter: 'blur(17.6px)', background: 'rgba(250,255,202,0.10)', border: '0.88px solid rgba(255,255,255,0.25)' }}>
            <Globe2 size={16} strokeWidth={2} color="#d2e718" />
            <span style={{ fontFamily: 'Inter', fontSize: 12.5, color: '#fff' }}>
              <span style={{ opacity: 0.65 }}>Parceria Estratégica Fundacional · </span>MIPAD ONU — Most Influential People of African Descent
            </span>
          </div>
        }
        actions={<>
          <HubButton size="lg" variant="lime" onClick={() => ScrollSmoother.get()?.scrollTo('#prointer-apoie', true)}>Quero participar</HubButton>
          <HubButton size="lg" variant="blue" onClick={() => ScrollSmoother.get()?.scrollTo('#prointer-apoie', true)}>Apoiar o programa</HubButton>
          <HubButton size="lg" variant="outline-light" onClick={() => ScrollSmoother.get()?.scrollTo('#prointer-organizacoes', true)}>Sou empresa ou governo</HubButton>
        </>}
        stats={STATS}
        strip={STRIP_THEMES.blue}
      />
      <SecProposito />
      <SecPublicos />
      <SecMissao />
      <SecOrganizacoes />
      <SecFormularios />
      <SecEcossistema />
      <SecFAQ />
    </>
  );
}
