import { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import {
  GraduationCap, Users, Globe2, FileCheck2, Heart, Award, Eye, Target, DollarSign, Quote,
  MessageSquareQuote, Handshake, HeartHandshake, ImageIcon,
} from 'lucide-react';
import Hero80, { STRIP_THEMES } from '../../components/Hero80';
import FAQAccordion from '../../components/FAQAccordion';
import HubButton from '../../components/HubButton';
import GlassHoverCard, { type HoverColor } from '../../components/GlassHoverCard';
import { useReveal, useRevealBidirectional } from '../../components/useReveal';
import { useTilt } from '../../components/useTilt';
import { useLeadForm, LeadFormSuccess } from '../../components/useLeadForm';
import { BgEditChip, EIcon, EImg, ERich, ET, useEditColor, useEditColors, useEditImage } from '../../editor/fields';

gsap.registerPlugin(ScrollTrigger);

/* ═══════════ Dados — conteúdo extraído do wireframe oficial (page-prointer) ═══════════ */

const STATS = [
  { value: 100, suffix: '%', editKey: 'pro.hero.stat1.valor', editLabel: 'Hero — stat 1 (valor)', label: <ET k="pro.hero.stat1.label" v="Gratuito para bolsistas" l="Hero — stat 1 (rótulo)" />, accent: true },
  { value: 3, editKey: 'pro.hero.stat2.valor', editLabel: 'Hero — stat 2 (valor)', label: <ET k="pro.hero.stat2.label" v="Cidades na jornada" l="Hero — stat 2 (rótulo)" /> },
  { value: 'ONU', editKey: 'pro.hero.stat3.valor', editLabel: 'Hero — stat 3 (valor)', label: <ET k="pro.hero.stat3.label" v="Acesso institucional" l="Hero — stat 3 (rótulo)" /> },
  { value: '2027', editKey: 'pro.hero.stat4.valor', editLabel: 'Hero — stat 4 (valor)', label: <ET k="pro.hero.stat4.label" v="Primeira turma" l="Hero — stat 4 (rótulo)" /> },
  { value: 'ESG', editKey: 'pro.hero.stat5.valor', editLabel: 'Hero — stat 5 (valor)', label: <ET k="pro.hero.stat5.label" v="Impacto comprovado" l="Hero — stat 5 (rótulo)" /> },
];

/* Fio condutor da página — a jornada de engajamento pedida na revisão editorial:
 * conheça → entenda o impacto → histórias → resultados → apoiadores →
 * ajude a ampliar → DOE. Cada etapa tem uma seção com o mesmo `id` e o mesmo
 * número no eyebrow, e o índice (SecJornada) rola direto pra ela. Ao criar ou
 * remover seção da jornada, atualizar ESTA lista (e o `id` da seção junto). */
const JORNADA = [
  { n: '01', id: 'prointer-sobre', label: 'Conheça o programa' },
  { n: '02', id: 'prointer-publicos', label: 'Para quem é' },
  { n: '03', id: 'prointer-missao', label: 'Entenda o impacto' },
  { n: '04', id: 'prointer-historias', label: 'Conheça histórias' },
  { n: '05', id: 'prointer-resultados', label: 'Veja resultados' },
  { n: '06', id: 'prointer-apoiadores', label: 'Conheça os apoiadores' },
  { n: '07', id: 'prointer-organizacoes', label: 'Por que apoiar' },
  { n: '08', id: 'prointer-apoie', label: 'Participe ou apoie' },
  { n: '09', id: 'prointer-doe', label: 'Doe para o HUB PAN' },
];

const PUBLICOS = [
  {
    id: 'professores', img: 's7-persona-2', num: 'Perfil 01', titulo: 'Professores da Rede Pública',
    desc: 'Docentes de escolas municipais e estaduais que se destacam em projetos de inovação pedagógica, inclusão, tecnologia ou impacto social. Seleção a partir do HUB PAN e Premier Niveau®.',
    bullets: ['Passagem aérea internacional inclusa', 'Hospedagem curada em Nova York e Boston', 'Acesso a Harvard Square, MIT e a ONU', 'Certificação internacional e reconhecimento público'],
  },
  {
    id: 'afroempreendedores', img: 's7-persona-4', num: 'Perfil 02', titulo: 'Afroempreendedores',
    desc: 'Empreendedores negros com negócios ou projetos em andamento que buscam acesso a ecossistemas internacionais de inovação, redes de negócios e relações institucionais. Em parceria com o MIPAD ONU.',
    bullets: ['Acesso à rede MIPAD ONU', 'Networking em Boston e Cambridge', 'Pitch em ambiente internacional', 'Mentoria com investidores internacionais'],
  },
];

const MISSAO = [
  { etapa: '01', cidade: 'Belo Horizonte', titulo: 'Seleção e preparação', desc: 'Análise de perfil acadêmico e profissional, entrevistas, formação preparatória e orientação sobre a missão. São selecionados os bolsistas de melhor performance nos programas do HUB PAN e Premier Niveau®.', duracao: '30 dias antes da missão' },
  { etapa: '02', cidade: 'Nova York', titulo: 'Chegada e imersão', desc: 'Desembarque em Nova York, hospedagem no entorno de Times Square, visita e experiência dentro das Nações Unidas, participação na Expo New York, networking institucional e reconhecimento formal dos participantes.', duracao: '3 dias', img: 'inst-nyc-onu' },
  { etapa: '03', cidade: 'Boston / Cambridge', titulo: 'Ecossistema de inovação', desc: 'Deslocamento de trem até Boston. Harvard Square, museu do MIT, espaços de inovação, encontros com empreendedores e pesquisadores. Experiências curadas por persona — executivo, educador ou afroempreendedor.', duracao: '3 dias', img: 'inst-cambridge-harvard' },
  { etapa: '04', cidade: 'De volta ao Brasil', titulo: 'Embaixadores e multiplicadores', desc: 'Cada bolsista retorna como Embaixador HUB PAN — com material documentado, certificação internacional e compromisso de multiplicar o impacto na sua comunidade. O professor que foi a Harvard impacta uma geração inteira.', duracao: 'Ciclo contínuo de impacto' },
];

const ORGANIZACOES: { id: string; Icon: typeof FileCheck2; tag: string; titulo: string; desc: string; hoverColor: HoverColor }[] = [
  { id: 'esg', Icon: FileCheck2, tag: 'ESG', titulo: 'ESG com rastreabilidade total', desc: 'Cada bolsa financiada gera relatório de impacto documentado — dados, depoimentos, fotos e publicações. Insumo direto para relatórios ESG e de sustentabilidade com lastro real.', hoverColor: 'white' },
  { id: 'fidelizacao', Icon: Heart, tag: 'Fidelização', titulo: 'Fidelização de carteira educacional', desc: 'Os bolsistas são selecionados entre alunos dos programas do HUB PAN. Apoiar o PROINTER aumenta retenção e engajamento da base educacional existente.', hoverColor: 'lime' },
  { id: 'marca', Icon: Award, tag: 'Marca', titulo: 'Embaixadores da sua marca', desc: 'Cada bolsista que volta do PROINTER se torna um defensor natural das marcas que tornaram sua jornada possível — um loyalty que leva décadas para se construir de outra forma.', hoverColor: 'blue' },
  { id: 'visibilidade', Icon: Eye, tag: 'Visibilidade', titulo: 'Reconhecimento no HUB PAN', desc: 'Apoiadores recebem reconhecimento no portal HUB PAN, nos eventos do HUB PAN e em materiais institucionais — com nível proporcional ao apoio prestado.', hoverColor: 'blue' },
  { id: 'ods', Icon: Target, tag: 'ODS', titulo: 'Alinhamento com ODS da ONU', desc: 'O PROINTER está diretamente alinhado com ODS 4 (educação de qualidade), ODS 10 (redução das desigualdades) e ODS 17 (parcerias para os objetivos).', hoverColor: 'lime' },
  { id: 'receita', Icon: DollarSign, tag: 'Receita', titulo: 'Modelo de doação B2B e B2C', desc: 'Estrutura de doação transparente para pessoas físicas, empresas privadas, fundações e governos, com contrapartidas claras e públicas para cada categoria.', hoverColor: 'white' },
];

const NIVEIS_APOIO = ['R$ 500 — Apoiador', 'R$ 1.000 — Parceiro', 'R$ 5.000 — Patrocinador de Bolsa', 'R$ 10.000 — Fundador do Programa', 'Outro valor — quero conversar'];

const ECOSSISTEMA = [
  { tag: 'Governos', t: 'eGovIA — IA para o setor público', to: '/govia', color: 'blue' as const },
  { tag: '2027', t: 'Fórum Mundial de IA — Cambridge', to: '/forum-mundial-ia', color: 'lime' as const },
  { tag: 'Network', t: 'Comunidades, fóruns e mentorias', to: '/o-hub-pan', color: 'navy' as const },
  { tag: 'Casos', t: 'Histórias de impacto real', to: '/casos-de-uso', color: 'blue' as const },
];

const ECO_COLORS = {
  blue: { bg: '#2d4ebf', text: '#fff', sub: 'rgba(255,255,255,0.7)' },
  lime: { bg: '#d2e718', text: '#152852', sub: 'rgba(21,40,82,0.65)' },
  navy: { bg: '#152852', text: '#fff', sub: 'rgba(255,255,255,0.6)' },
};

const FAQ_RAW = [
  { id: 'e-pago', q: 'O PROINTER é um programa de intercâmbio pago?', a: 'Não. O PROINTER é totalmente gratuito para os bolsistas selecionados. Passagem aérea, hospedagem e recursos financeiros para as despesas na missão são integralmente custeados pelo programa — financiado por doações de empresas, governos e pessoas físicas que apoiam o projeto.' },
  { id: 'quem-pode-candidatar', q: 'Qualquer professor pode se candidatar ao PROINTER?', a: 'O PROINTER prioriza professores da rede pública municipal e estadual de todo o Brasil. A seleção é feita com base na performance nos programas do HUB PAN e Premier Niveau®, e também considera projetos de inovação pedagógica, inclusão e impacto social desenvolvidos pelo candidato em sua escola ou comunidade.' },
  { id: 'o-que-e', q: 'O que é o PROINTER exatamente?', a: 'O PROINTER — Programa de Intercâmbio e Impacto — é uma iniciativa do HUB PAN que leva professores da rede pública brasileira e afroempreendedores a experiências internacionais de alto impacto em Harvard Square, MIT e Nações Unidas em Nova York. O programa é financiado por doações e alinhado aos ODS da ONU — especificamente ODS 4, ODS 10 e ODS 17.' },
  { id: 'quando-comeca', q: 'Quando começa a primeira turma do PROINTER?', a: 'A primeira missão com bolsistas está prevista para maio de 2027. As inscrições e candidaturas estão abertas continuamente — os perfis são analisados e os selecionados são comunicados com antecedência para a preparação da missão.' },
  { id: 'como-empresa-apoia', q: 'Como uma empresa pode apoiar o PROINTER?', a: 'Empresas podem apoiar o PROINTER via doação direta ao programa, em diferentes níveis: Apoiador (R$ 500), Parceiro (R$ 1.000), Patrocinador de Bolsa (R$ 5.000) ou Fundador do Programa (R$ 10.000). Cada nível inclui contrapartidas de reconhecimento público, visibilidade no HUB PAN e relatórios de impacto ESG rastreáveis.' },
  { id: 'diferenca-convencional', q: 'Qual é a diferença entre o PROINTER e um intercâmbio convencional?', a: 'Intercâmbios convencionais são pagos pelo participante e geralmente voltados para estudantes de alta renda. O PROINTER inverte essa lógica: é inteiramente custeado por terceiros, direcionado a quem historicamente não teria acesso a esses ambientes, e desenhado para gerar impacto coletivo — cada bolsista retorna como multiplicador em sua comunidade, escola ou negócio.' },
];

const FAQ = FAQ_RAW.map((f) => ({
  q: <ET k={`pro.faq.${f.id}.q`} v={f.q} l={`FAQ — pergunta (${f.id})`} />,
  a: <ERich k={`pro.faq.${f.id}.a`} l={`FAQ — resposta (${f.id})`}>{f.a}</ERich>,
}));

const INPUT_STYLE: React.CSSProperties = {
  height: 48, borderRadius: 10, background: '#f5f5f5', border: '1px solid #ecedf0',
  fontFamily: 'Inter', fontSize: 14, color: '#152852', padding: '0 16px', width: '100%', outline: 'none',
};

/** Eyebrow numerado — o fio condutor visível da jornada. Mesmo visual dos
 * eyebrows que já existiam, só com o número da etapa na frente. */
function StepEyebrow({ step, k, onDark, children }: { step: string; k: string; onDark?: boolean; children: React.ReactNode }) {
  return (
    <p className={`eyebrow mb-6 ${onDark ? '' : 'text-muted'}`} style={onDark ? { color: 'rgba(255,255,255,0.69)' } : undefined} data-animate>
      <span style={{ color: onDark ? '#d2e718' : '#2d4ebf' }}>
        <ET k={`${k}.etapa`} v={step} l="Número da etapa na jornada" />
      </span>
      <span style={{ opacity: 0.4 }}>{' / '}</span>
      {children}
    </p>
  );
}

/* ═══════════ Índice da jornada — fio condutor clicável logo abaixo do hero ═══════════ */

function SecJornada() {
  const ref = useReveal<HTMLElement>();
  const [bg, bgProps] = useEditColor('pro.jornada.bg', '#ffffff', 'Fundo da seção Jornada (índice)');
  return (
    <section ref={ref} id="prointer-jornada" className="py-14 lg:py-16 gutter" {...bgProps} style={{ background: bg }}>
      <div className="mb-8 max-w-[720px]">
        <p className="eyebrow text-muted mb-4" data-animate><ET k="pro.jornada.eyebrow" v="A JORNADA DESTA PÁGINA" l="Jornada — selo da seção" /></p>
        <h2 style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 'clamp(24px,2.6vw,34px)', letterSpacing: '-0.5px', lineHeight: 1.05, color: '#152852' }} data-animate>
          <ERich k="pro.jornada.titulo" l="Jornada — título">Do que é o programa até como <span style={{ color: 'rgb(45, 78, 191)' }}>ajudar a ampliá-lo.</span></ERich>
        </h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3" data-animate>
        {JORNADA.map((s, i) => {
          const ultimo = i === JORNADA.length - 1;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => ScrollSmoother.get()?.scrollTo(`#${s.id}`, true)}
              className="group text-left rounded-[14px] px-4 py-4 transition-transform duration-300 hover:-translate-y-1"
              style={{ background: ultimo ? '#d2e718' : '#f5f5f5', border: `1px solid ${ultimo ? '#d2e718' : '#ecedf0'}` }}
            >
              <span className="block mb-2" style={{ fontFamily: 'Luxenta', fontWeight: 600, fontSize: 20, lineHeight: 1, color: ultimo ? '#152852' : '#2d4ebf' }}>
                <ET k={`pro.jornada.${s.id}.num`} v={s.n} l={`Jornada — número "${s.label}"`} />
              </span>
              <span className="block" style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 13.5, lineHeight: '19px', color: '#152852' }}>
                <ET k={`pro.jornada.${s.id}.label`} v={s.label} l={`Jornada — etapa "${s.label}"`} />
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

/* ═══════════ Proposito — 100vh, gradiente claro→lime, foto com selo glass ═══════════ */

function SecProposito() {
  const ref = useReveal<HTMLElement>();
  const [bg, bgProps] = useEditColors('PROINTER — Proposito, fundo da seção (gradiente)', [
    { key: 'pro.proposito.bg.1', label: 'Proposito — cor 1 (início do gradiente)', fallback: '#ffffff' },
    { key: 'pro.proposito.bg.2', label: 'Proposito — cor 2 (fim do gradiente)', fallback: '#d2e718' },
  ]);
  return (
    <section ref={ref} id="prointer-sobre" className="relative w-full overflow-hidden" {...bgProps} style={{ background: `linear-gradient(39.8deg, ${bg[0]} 65.3%, ${bg[1]} 99%)` }}>
      <div className="gutter grid lg:grid-cols-2 gap-12 lg:gap-16 py-20 lg:py-0 lg:h-screen items-center">
        <div className="lg:h-screen flex flex-col justify-center">
          <StepEyebrow step="01" k="pro.proposito">
            <ET k="pro.proposito.eyebrow" v="O QUE É O PROINTER" l="Proposito — selo da seção" />
          </StepEyebrow>
          <h2 className="mb-6" style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 'clamp(32px,4vw,50px)', letterSpacing: '-0.5px', lineHeight: 1, color: '#152852' }} data-animate>
            <ERich k="pro.proposito.titulo" l="Proposito — título">Mais do que intercâmbio.<br />Uma plataforma de impacto <span style={{ color: 'rgb(45, 78, 191)' }}>transgeracional.</span></ERich>
          </h2>
          <p className="mb-5" style={{ fontFamily: 'Inter', fontSize: 16.5, lineHeight: '28px', color: '#797979', maxWidth: 560 }} data-animate>
            <ERich k="pro.proposito.p1" l="Proposito — parágrafo 1" baseW={560}>O PROINTER é o mecanismo pelo qual o HUB PAN abre portas normalmente fechadas para professores da rede pública, afroempreendedores e lideranças que raramente acessam Harvard Square, MIT ou as Nações Unidas.</ERich>
          </p>
          <p className="mb-9" style={{ fontFamily: 'Inter', fontSize: 16.5, lineHeight: '28px', color: '#797979', maxWidth: 560 }} data-animate>
            <ERich k="pro.proposito.p2" l="Proposito — parágrafo 2" baseW={560}>Ao invés de trazer o mundo para uma sala de aula, o PROINTER leva a pessoa ao mundo — com curadoria completa e suporte financeiro integral, para que o impacto se propague além do participante.</ERich>
          </p>
          <div className="flex flex-wrap gap-5" data-animate>
            {[
              { id: 'professores', Icon: GraduationCap, t: 'Professores da rede pública' },
              { id: 'afroempreendedores', Icon: Users, t: 'Afroempreendedores' },
              { id: 'gratuito', Icon: Globe2, t: '100% gratuito para bolsistas' },
            ].map(({ id, Icon, t }) => (
              <div key={id} className="flex items-center gap-3">
                <span
                  className="flex items-center justify-center rounded-full shrink-0"
                  style={{ width: 52, height: 52, backdropFilter: 'blur(30px)', WebkitBackdropFilter: 'blur(30px)', background: 'rgba(255,255,255,0.30)', border: '1px solid rgba(210,231,24,0.5)' }}
                >
                  <EIcon k={`pro.proposito.icon.${id}`} l={`Proposito — ícone "${t}"`} defaultSize={22}>
                    <Icon size={22} strokeWidth={2} color="#152852" />
                  </EIcon>
                </span>
                <span style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 14, color: '#152852' }}>
                  <ET k={`pro.proposito.item.${id}.texto`} v={t} l={`Proposito — texto "${t}"`} />
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative lg:h-screen flex items-center justify-center">
          <div className="relative w-full" style={{ maxWidth: 540 }} data-animate>
            <div className="overflow-hidden rounded-[20px]" style={{ aspectRatio: '4 / 3' }}>
              <EImg
                k="pro.proposito.img" v="/images/prointer-harvard-t.webp"
                l="Proposito — foto (estação Harvard, Cambridge)"
                spec={{ w: 1080, h: 810, shape: 'paisagem' }}
                alt="Estação Harvard — Cambridge, MA" className="w-full h-full object-cover"
              />
            </div>
            <div
              className="absolute -bottom-6 left-6 right-6 flex items-center gap-3 rounded-full px-5 py-3"
              style={{ backdropFilter: 'blur(17.6px)', WebkitBackdropFilter: 'blur(17.6px)', background: 'rgba(21,40,82,0.88)', border: '0.88px solid rgba(255,255,255,0.25)' }}
            >
              <Globe2 size={18} strokeWidth={2} color="#d2e718" className="shrink-0" />
              <span style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 12.5, color: '#fff' }}>
                <ERich k="pro.proposito.chip" l="Proposito — chip de parceria (foto)">
                  <span style={{ opacity: 0.6 }}>Parceria Fundacional · </span>MIPAD ONU
                </ERich>
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
        <EImg
          k={`pro.publicos.${p.id}.img`} v={`/images/${p.img}.webp`}
          l={`Públicos — foto "${p.titulo}"`}
          spec={{ w: 800, h: 560, shape: 'paisagem' }}
          alt={p.titulo} className="w-full h-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(6,9,25,0.75) 0%, transparent 55%)' }} />
        <p className="absolute bottom-5 left-6" style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 11, letterSpacing: '2px', textTransform: 'uppercase', color: '#d2e718' }}>
          <ET k={`pro.publicos.${p.id}.num`} v={p.num} l={`Públicos — selo "${p.titulo}"`} />
        </p>
      </div>
      <div className="flex flex-col flex-1 p-7 lg:p-8">
        <h3 className="mb-3" style={{ fontFamily: 'Luxenta', fontWeight: 600, fontSize: 26, lineHeight: 1.1, color: '#152852' }}>
          <ET k={`pro.publicos.${p.id}.titulo`} v={p.titulo} l={`Públicos — título "${p.titulo}"`} />
        </h3>
        <p className="mb-6" style={{ fontFamily: 'Inter', fontSize: 14.5, lineHeight: '24px', color: '#797979' }}>
          <ERich k={`pro.publicos.${p.id}.desc`} l={`Públicos — descrição "${p.titulo}"`}>{p.desc}</ERich>
        </p>
        <ul className="space-y-3 mb-8">
          {p.bullets.map((b, i) => (
            <li key={b} className="flex items-start gap-3">
              <span className="mt-[9px] w-[6px] h-[6px] rounded-full shrink-0" style={{ background: '#d2e718' }} />
              <span style={{ fontFamily: 'Inter', fontSize: 14, lineHeight: '22px', color: '#152852' }}>
                <ET k={`pro.publicos.${p.id}.bullet.${i}`} v={b} l={`Públicos — "${p.titulo}", item ${i + 1}`} />
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-auto">
          <HubButton size="md" variant="blue" iconKey={`pro.publicos.${p.id}.btn.icone`} iconLabel={`Públicos — botão "${p.titulo}", ícone`} styleKey={`pro.publicos.${p.id}.btn`} styleLabel={`Públicos — botão "${p.titulo}"`} onClick={() => ScrollSmoother.get()?.scrollTo('#prointer-apoie', true)}>
            <ET k={`pro.publicos.${p.id}.btn`} v="Quero me candidatar" l={`Públicos — botão "${p.titulo}"`} />
          </HubButton>
        </div>
      </div>
    </div>
  );
}

function CitacaoCard() {
  const tilt = useTilt<HTMLDivElement>(4, 6);
  return (
    <div ref={tilt} className="flex flex-col rounded-[20px] p-7 lg:p-8 bg-lime" data-animate>
      <span className="flex items-center justify-center rounded-full mb-6" style={{ width: 52, height: 52, background: 'rgba(21,40,82,0.08)' }}>
        <EIcon k="pro.publicos.citacao.icon" l="Públicos — ícone da citação" defaultSize={24}>
          <Quote size={24} strokeWidth={2} color="#152852" fill="#152852" />
        </EIcon>
      </span>
      <p style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 'clamp(22px,2vw,26px)', lineHeight: 1.3, color: '#152852' }}>
        <ERich k="pro.publicos.citacao.quote" l="Públicos — citação"><span style={{ fontSize: 60 }}><br />"Mas a professora não vai para Nova York."<br /></span></ERich>
      </p>
      <p className="mt-4" style={{ fontFamily: 'Inter', fontSize: 14, lineHeight: '23px', color: 'rgba(21,40,82,0.75)' }}>
        <ERich k="pro.publicos.citacao.texto" l="Públicos — texto de apoio da citação"><span style={{ fontSize: 16 }}>Essa frase, ouvida no interior de Minas Gerais, é a razão pela qual o PROINTER existe. O HUB PAN pega essa professora e coloca ela lá dentro.</span></ERich>
      </p>
    </div>
  );
}

function SecPublicos() {
  const ref = useReveal<HTMLElement>();
  return (
    <section ref={ref} id="prointer-publicos" className="py-24 lg:py-32 gutter" style={{ background: '#f5f5f5' }}>
      <div className="mb-14 max-w-[700px]">
        <StepEyebrow step="02" k="pro.publicos">
          <ET k="pro.publicos.eyebrow" v="PARA QUEM É O PROINTER" l="Públicos — selo da seção" />
        </StepEyebrow>
        <h2 className="mb-4" style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 'clamp(32px,4vw,50px)', letterSpacing: '-0.5px', lineHeight: 1, color: '#152852' }} data-animate>
          <ERich k="pro.publicos.titulo" l="Públicos — título">Dois públicos. Um mesmo propósito.</ERich>
        </h2>
        <p style={{ fontFamily: 'Inter', fontSize: 16, lineHeight: '27px', color: '#797979' }} data-animate>
          <ERich k="pro.publicos.desc" l="Públicos — texto de apoio">O PROINTER atende dois perfis que o HUB PAN considera prioritários — e que historicamente foram mantidos distantes desses ambientes.</ERich>
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
          <ET k={`pro.missao.${item.etapa}.etapa`} v={item.etapa} l={`Missão — número da etapa "${item.cidade}"`} />
        </p>
        <p className="mt-2" style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 11, letterSpacing: '1.8px', textTransform: 'uppercase', color: '#a7a4a4' }}>
          <ET k={`pro.missao.${item.etapa}.duracao`} v={item.duracao} l={`Missão — duração "${item.cidade}"`} />
        </p>
      </div>
      <div className={`lg:w-[calc(50%-56px)] ${side === 'left' ? 'lg:mr-auto' : 'lg:ml-auto'}`} data-animate>
        <div className={`flex items-center gap-4 mb-3 ${side === 'left' ? 'lg:flex-row-reverse' : ''}`}>
          {item.img && (
            <div className="w-16 h-16 rounded-full overflow-hidden shrink-0" style={{ border: '2px solid #d2e718' }}>
              <EImg
                k={`pro.missao.${item.etapa}.img`} v={`/images/${item.img}.webp`}
                l={`Missão — foto "${item.cidade}"`}
                spec={{ w: 128, h: 128, shape: 'quadrada' }}
                alt={item.cidade} className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className={`text-center ${side === 'left' ? 'lg:text-right' : 'lg:text-left'} flex-1`}>
            <h3 style={{ fontFamily: 'Luxenta', fontWeight: 600, fontSize: 'clamp(20px,1.8vw,26px)', lineHeight: 1.1, color: '#152852' }}>
              <ET k={`pro.missao.${item.etapa}.cidade`} v={item.cidade} l={`Missão — cidade "${item.cidade}"`} />
            </h3>
            <p style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 13, color: '#2d4ebf' }}>
              <ET k={`pro.missao.${item.etapa}.titulo`} v={item.titulo} l={`Missão — subtítulo "${item.cidade}"`} />
            </p>
          </div>
        </div>
        <p className={`text-center ${side === 'left' ? 'lg:text-right' : 'lg:text-left'}`} style={{ fontFamily: 'Inter', fontSize: 14, lineHeight: '23px', color: '#797979' }}>
          <ERich k={`pro.missao.${item.etapa}.desc`} l={`Missão — descrição "${item.cidade}"`}>{item.desc}</ERich>
        </p>
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
    <section id="prointer-missao" className="pt-24 lg:pt-32 gutter bg-white overflow-hidden">
      <div ref={headRef} className="mb-16 max-w-[680px]">
        <StepEyebrow step="03" k="pro.missao">
          <ET k="pro.missao.eyebrow" v="A MISSÃO" l="Missão — selo da seção" />
        </StepEyebrow>
        <h2 className="mb-4" style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 'clamp(32px,4vw,50px)', letterSpacing: '-0.5px', lineHeight: 1, color: '#152852' }} data-animate>
          <ERich k="pro.missao.titulo" l="Missão — título">Uma semana que muda uma trajetória.</ERich>
        </h2>
        <p style={{ fontFamily: 'Inter', fontSize: 16, lineHeight: '27px', color: '#797979' }} data-animate>
          <ERich k="pro.missao.desc" l="Missão — texto de apoio">A jornada PROINTER é desenhada etapa por etapa — com curadoria específica para cada perfil de bolsista.</ERich>
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

/* ═══════════ Histórias — ETAPA 04 ═══════════
 * ⚠️ CONTEÚDO REAL PENDENTE. Nenhuma história, nome ou depoimento de bolsista
 * foi inventado aqui de propósito (regra permanente do projeto). Os 3 cards
 * abaixo são SLOTS neutros: foto vazia (useEditImage com fallback '') e textos
 * genéricos marcados como pendentes. Quando o HUB PAN enviar os depoimentos
 * reais, é só editar pelo painel (/editar/prointer) ou trocar os fallbacks
 * (`pro.historias.h1|h2|h3.*`) aqui no código.
 */

const HISTORIAS = ['h1', 'h2', 'h3'];

function HistoriaCard({ id, i }: { id: string; i: number }) {
  const tilt = useTilt<HTMLDivElement>(4, 6);
  const [img, imgProps] = useEditImage(
    `pro.historias.${id}.img`, '', `Histórias — foto do depoimento ${i + 1}`,
    { w: 800, h: 560, shape: 'paisagem', note: 'Retrato do bolsista. Enquanto não houver foto real, o card mostra um espaço neutro.' }
  );
  return (
    <div ref={tilt} className="relative flex flex-col rounded-[20px] overflow-hidden bg-white" style={{ border: '1px solid #ecedf0' }} data-animate>
      <div
        className="relative shrink-0 h-[260px] flex items-center justify-center"
        {...imgProps}
        style={{ background: img ? `url(${img}) center/cover no-repeat` : '#ecedf0' }}
      >
        {!img && (
          <span className="flex flex-col items-center gap-2" style={{ fontFamily: 'Inter', fontSize: 12, color: '#a7a4a4' }}>
            <ImageIcon size={22} strokeWidth={1.6} color="#a7a4a4" />
            <ET k={`pro.historias.${id}.imgPlaceholder`} v="Foto do bolsista a definir" l={`Histórias — aviso de foto pendente ${i + 1}`} />
          </span>
        )}
        <BgEditChip
          k={`pro.historias.${id}.img`} v="" l={`Histórias — foto do depoimento ${i + 1}`}
          spec={{ w: 800, h: 560, shape: 'paisagem' }}
          style={{ bottom: 12, right: 12 }}
        />
      </div>
      <div className="flex flex-col flex-1 p-7 lg:p-8">
        <span className="flex items-center justify-center rounded-full mb-5" style={{ width: 44, height: 44, background: 'rgba(45,78,191,0.08)' }}>
          <EIcon k={`pro.historias.${id}.icone`} l={`Histórias — ícone do depoimento ${i + 1}`} defaultSize={20}>
            <MessageSquareQuote size={20} strokeWidth={2} color="#2d4ebf" />
          </EIcon>
        </span>
        <h3 className="mb-1" style={{ fontFamily: 'Luxenta', fontWeight: 600, fontSize: 22, lineHeight: 1.1, color: '#152852' }}>
          <ET k={`pro.historias.${id}.nome`} v="Nome do bolsista a definir" l={`Histórias — nome ${i + 1}`} />
        </h3>
        <p className="mb-5" style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 12.5, letterSpacing: '0.4px', color: '#2d4ebf' }}>
          <ET k={`pro.historias.${id}.papel`} v="Perfil · cidade a definir" l={`Histórias — perfil e cidade ${i + 1}`} />
        </p>
        <p style={{ fontFamily: 'Inter', fontSize: 14.5, lineHeight: '24px', color: '#797979' }}>
          <ERich k={`pro.historias.${id}.depoimento`} l={`Histórias — depoimento ${i + 1}`}>Espaço reservado para o depoimento real deste bolsista. Conteúdo a ser fornecido pelo HUB PAN.</ERich>
        </p>
      </div>
    </div>
  );
}

function SecHistorias() {
  const ref = useReveal<HTMLElement>();
  const [bg, bgProps] = useEditColor('pro.historias.bg', '#f5f5f5', 'Fundo da seção Histórias');
  return (
    <section ref={ref} id="prointer-historias" className="py-24 lg:py-32 gutter" {...bgProps} style={{ background: bg }}>
      <div className="mb-14 max-w-[700px]">
        <StepEyebrow step="04" k="pro.historias">
          <ET k="pro.historias.eyebrow" v="HISTÓRIAS" l="Histórias — selo da seção" />
        </StepEyebrow>
        <h2 className="mb-4" style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 'clamp(32px,4vw,50px)', letterSpacing: '-0.5px', lineHeight: 1, color: '#152852' }} data-animate>
          <ERich k="pro.historias.titulo" l="Histórias — título">Quem atravessa a jornada.</ERich>
        </h2>
        <p style={{ fontFamily: 'Inter', fontSize: 16, lineHeight: '27px', color: '#797979' }} data-animate>
          <ERich k="pro.historias.desc" l="Histórias — texto de apoio">As histórias dos bolsistas do PROINTER serão registradas e publicadas aqui a partir da primeira missão.</ERich>
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {HISTORIAS.map((id, i) => <HistoriaCard key={id} id={id} i={i} />)}
      </div>
    </section>
  );
}

/* ═══════════ Resultados — ETAPA 05 ═══════════
 * ⚠️ CONTEÚDO REAL PENDENTE. Nenhum número foi inventado: os 4 indicadores
 * saem com o valor "—" e só o NOME da métrica está escrito (nomear a métrica
 * não é inventar dado). Assim que o HUB PAN passar os números reais, trocar
 * os fallbacks `pro.resultados.r1|r2|r3|r4.valor`.
 */

const RESULTADOS = [
  { id: 'r1', label: 'Bolsistas na primeira missão' },
  { id: 'r2', label: 'Escolas e negócios alcançados' },
  { id: 'r3', label: 'Cidades de origem dos bolsistas' },
  { id: 'r4', label: 'Pessoas impactadas pelos multiplicadores' },
];

function SecResultados() {
  const ref = useReveal<HTMLElement>();
  const [bg, bgProps] = useEditColor('pro.resultados.bg', '#ffffff', 'Fundo da seção Resultados');
  return (
    <section ref={ref} id="prointer-resultados" className="py-24 lg:py-32 gutter" {...bgProps} style={{ background: bg }}>
      <div className="grid lg:grid-cols-[1fr_1.3fr] gap-12 lg:gap-16">
        <div>
          <StepEyebrow step="05" k="pro.resultados">
            <ET k="pro.resultados.eyebrow" v="RESULTADOS" l="Resultados — selo da seção" />
          </StepEyebrow>
          <h2 className="mb-4" style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 'clamp(32px,4vw,50px)', letterSpacing: '-0.5px', lineHeight: 1, color: '#152852' }} data-animate>
            <ERich k="pro.resultados.titulo" l="Resultados — título">Impacto medido, não estimado.</ERich>
          </h2>
          <p className="mb-8" style={{ fontFamily: 'Inter', fontSize: 16, lineHeight: '27px', color: '#797979' }} data-animate>
            <ERich k="pro.resultados.desc" l="Resultados — texto de apoio">Cada bolsa financiada gera relatório de impacto documentado. Os indicadores consolidados do programa serão publicados aqui a cada ciclo.</ERich>
          </p>
          <div data-animate>
            <HubButton size="md" variant="blue" onClick={() => ScrollSmoother.get()?.scrollTo('#prointer-doe', true)} iconKey="pro.resultados.btn.icone" iconLabel="Resultados — botão, ícone" styleKey="pro.resultados.btn" styleLabel="Resultados — botão">
              <ET k="pro.resultados.btn" v="Ajude a ampliar o programa" l="Resultados — botão" />
            </HubButton>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {RESULTADOS.map((r) => (
            <div key={r.id} className="rounded-[20px] p-7 flex flex-col justify-between min-h-[180px]" style={{ background: '#f5f5f5', border: '1px solid #ecedf0' }} data-animate>
              <p style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 'clamp(40px,4.5vw,64px)', lineHeight: 1, letterSpacing: '-2px', color: '#2d4ebf' }}>
                {/* ⚠️ valor real pendente — não preencher com número estimado */}
                <ET k={`pro.resultados.${r.id}.valor`} v="—" l={`Resultados — valor "${r.label}"`} />
              </p>
              <p className="mt-4" style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 13.5, lineHeight: '20px', color: '#152852' }}>
                <ET k={`pro.resultados.${r.id}.label`} v={r.label} l={`Resultados — rótulo "${r.label}"`} />
              </p>
            </div>
          ))}
        </div>
      </div>
      <p className="mt-8" style={{ fontFamily: 'Inter', fontSize: 13, lineHeight: '21px', color: '#a7a4a4' }} data-animate>
        <ERich k="pro.resultados.nota" l="Resultados — nota de rodapé">Indicadores a serem consolidados e divulgados pelo HUB PAN.</ERich>
      </p>
    </section>
  );
}

/* ═══════════ Apoiadores — ETAPA 06 ═══════════
 * ⚠️ CONTEÚDO PARCIALMENTE PENDENTE. O único apoiador com nome REAL disponível
 * no conteúdo aprovado desta página é o MIPAD ONU (citado no hero e no chip da
 * seção "O que é o PROINTER" como Parceria Estratégica Fundacional) — ele é o
 * primeiro card. Os demais são SLOTS vazios: nenhum outro nome/logo foi
 * inventado. Quando o HUB PAN enviar a lista real, editar pelo painel ou
 * trocar os fallbacks `pro.apoiadores.a2..a6.*` / subir os logos.
 */

const APOIADORES = [
  { id: 'a1', nome: 'MIPAD ONU', papel: 'Parceria Estratégica Fundacional', real: true },
  { id: 'a2', nome: 'Apoiador a definir', papel: 'Nível de apoio a definir', real: false },
  { id: 'a3', nome: 'Apoiador a definir', papel: 'Nível de apoio a definir', real: false },
  { id: 'a4', nome: 'Apoiador a definir', papel: 'Nível de apoio a definir', real: false },
  { id: 'a5', nome: 'Apoiador a definir', papel: 'Nível de apoio a definir', real: false },
  { id: 'a6', nome: 'Apoiador a definir', papel: 'Nível de apoio a definir', real: false },
];

function ApoiadorCard({ a }: { a: (typeof APOIADORES)[number] }) {
  const [logo, logoProps] = useEditImage(
    `pro.apoiadores.${a.id}.logo`, '', `Apoiadores — logo "${a.nome}"`,
    { w: 480, h: 240, shape: 'paisagem', fit: 'contain', note: 'Logo do apoiador. Sem imagem, o card mostra só o nome.' }
  );
  return (
    <div className="relative rounded-[20px] p-6 flex flex-col items-center text-center justify-center min-h-[168px] bg-white" style={{ border: '1px solid #ecedf0' }} data-animate>
      <div className="h-[46px] w-full flex items-center justify-center mb-4" {...logoProps}>
        {logo
          ? <img src={logo} alt={a.nome} className="max-h-[46px] max-w-full object-contain" />
          : <Handshake size={24} strokeWidth={1.8} color={a.real ? '#2d4ebf' : '#c4c4c4'} />}
      </div>
      <p style={{ fontFamily: 'Luxenta', fontWeight: 600, fontSize: 17, lineHeight: 1.15, color: a.real ? '#152852' : '#a7a4a4' }}>
        <ET k={`pro.apoiadores.${a.id}.nome`} v={a.nome} l={`Apoiadores — nome "${a.nome}"`} />
      </p>
      <p className="mt-1" style={{ fontFamily: 'Inter', fontSize: 12.5, lineHeight: '18px', color: '#a7a4a4' }}>
        <ET k={`pro.apoiadores.${a.id}.papel`} v={a.papel} l={`Apoiadores — papel "${a.nome}"`} />
      </p>
      <BgEditChip
        k={`pro.apoiadores.${a.id}.logo`} v="" l={`Apoiadores — logo "${a.nome}"`}
        spec={{ w: 480, h: 240, shape: 'paisagem', fit: 'contain' }}
        style={{ bottom: 10, right: 10 }}
      />
    </div>
  );
}

function SecApoiadores() {
  const ref = useReveal<HTMLElement>();
  const [bg, bgProps] = useEditColor('pro.apoiadores.bg', '#f5f5f5', 'Fundo da seção Apoiadores');
  return (
    <section ref={ref} id="prointer-apoiadores" className="py-24 lg:py-32 gutter" {...bgProps} style={{ background: bg }}>
      <div className="mb-14 max-w-[700px]">
        <StepEyebrow step="06" k="pro.apoiadores">
          <ET k="pro.apoiadores.eyebrow" v="QUEM APOIA O PROINTER" l="Apoiadores — selo da seção" />
        </StepEyebrow>
        <h2 className="mb-4" style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 'clamp(32px,4vw,50px)', letterSpacing: '-0.5px', lineHeight: 1, color: '#152852' }} data-animate>
          <ERich k="pro.apoiadores.titulo" l="Apoiadores — título">Nenhuma bolsa existe sozinha.</ERich>
        </h2>
        <p style={{ fontFamily: 'Inter', fontSize: 16, lineHeight: '27px', color: '#797979' }} data-animate>
          <ERich k="pro.apoiadores.desc" l="Apoiadores — texto de apoio">O PROINTER é financiado por doações de empresas, governos, fundações e pessoas físicas. Cada apoiador é reconhecido publicamente no HUB PAN.</ERich>
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {APOIADORES.map((a) => <ApoiadorCard key={a.id} a={a} />)}
      </div>
      <p className="mt-8" style={{ fontFamily: 'Inter', fontSize: 13, lineHeight: '21px', color: '#a7a4a4' }} data-animate>
        <ERich k="pro.apoiadores.nota" l="Apoiadores — nota de rodapé">Lista de apoiadores em construção — atualizada a cada novo apoio confirmado.</ERich>
      </p>
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
          <StepEyebrow step="07" k="pro.organizacoes" onDark>
            <ET k="pro.organizacoes.eyebrow" v="PARA ORGANIZAÇÕES" l="Organizações — selo da seção" />
          </StepEyebrow>
          <h2 className="mb-4" style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 'clamp(32px,4vw,50px)', letterSpacing: '-0.5px', lineHeight: 1, color: '#fff' }} data-animate>
            <ERich k="pro.organizacoes.titulo" l="Organizações — título">
              O PROINTER como <span style={{ color: '#d2e718' }}>ativo estratégico</span> da sua organização.
            </ERich>
          </h2>
          <p style={{ fontFamily: 'Inter', fontSize: 16, lineHeight: '27px', color: '#d6d6d6', maxWidth: 640 }} data-animate>
            <ERich k="pro.organizacoes.desc" l="Organizações — texto de apoio" baseW={640}>Empresas, governos e fundações que apoiam o PROINTER não fazem apenas uma doação — entram em uma rede de impacto rastreável com retornos institucionais concretos.</ERich>
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ORGANIZACOES.map((o) => (
            <GlassHoverCard
              key={o.id}
              hoverColor={o.hoverColor}
              icon={
                <EIcon k={`pro.organizacoes.${o.id}.icone`} l={`Para Organizações — ícone "${o.tag}"`} defaultSize={24}>
                  <o.Icon size={24} strokeWidth={2} />
                </EIcon>
              }
              tag={<ET k={`pro.organizacoes.${o.id}.tag`} v={o.tag} l={`Para Organizações — selo "${o.tag}"`} />}
              titulo={<ET k={`pro.organizacoes.${o.id}.titulo`} v={o.titulo} l={`Para Organizações — título "${o.tag}"`} />}
              desc={<ERich k={`pro.organizacoes.${o.id}.desc`} l={`Para Organizações — descrição "${o.tag}"`}>{o.desc}</ERich>}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════ Formulários — apoiar / candidatar, com faixa de cor no topo ═══════════ */

function FormApoiar() {
  const [apoiarBg, apoiarBgProps] = useEditColor('pro.formularios.apoiar.bg', '#152852', 'Fundo do cabeçalho — formulário Apoiar o PROINTER');
  const { values, set, handleSubmit, sending, sent, error } = useLeadForm(
    'prointer_apoio',
    { nome: '', email: '', perfil: '', assunto: '', mensagem: '' },
    ['nome', 'email', 'perfil', 'assunto'],
  );

  if (sent) {
    return (
      <div className="rounded-[20px] overflow-hidden bg-white" style={{ border: '1px solid #ecedf0' }}>
        <LeadFormSuccess titulo="Apoio recebido!" desc="Nossa equipe entra em contato em breve com os próximos passos." />
      </div>
    );
  }

  return (
    <form className="rounded-[20px] overflow-hidden bg-white" style={{ border: '1px solid #ecedf0' }} onSubmit={handleSubmit}>
      <div className="p-8 lg:p-9" {...apoiarBgProps} style={{ background: apoiarBg }}>
        <p className="mb-2" style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 11, letterSpacing: '2px', textTransform: 'uppercase', color: '#d2e718' }}>
          <ET k="pro.formularios.apoiar.tag" v="PARA EMPRESAS, GOVERNOS E PESSOAS FÍSICAS" l="Formulário Apoiar — tag" />
        </p>
        <h3 className="mb-2" style={{ fontFamily: 'Luxenta', fontWeight: 600, fontSize: 26, lineHeight: 1.1, color: '#fff' }}>
          <ET k="pro.formularios.apoiar.titulo" v="Apoiar o PROINTER" l="Formulário Apoiar — título" />
        </h3>
        <p style={{ fontFamily: 'Inter', fontSize: 14, lineHeight: '22px', color: 'rgba(255,255,255,0.75)' }}>
          <ERich k="pro.formularios.apoiar.desc" l="Formulário Apoiar — descrição">Financie bolsas de impacto real com ESG rastreável.</ERich>
        </p>
      </div>
      <div className="p-8 lg:p-9 space-y-4">
        <input required placeholder="Nome completo" value={values.nome} onChange={set('nome')} style={INPUT_STYLE} />
        <div className="grid sm:grid-cols-2 gap-4">
          <input required type="email" placeholder="E-mail" value={values.email} onChange={set('email')} style={INPUT_STYLE} />
          <select required value={values.perfil} onChange={set('perfil')} style={{ ...INPUT_STYLE, color: '#152852' }}>
            <option value="" disabled>Perfil</option>
            <option>Pessoa física</option><option>Empresa privada</option><option>Fundação</option><option>Governo</option>
          </select>
        </div>
        <select required value={values.assunto} onChange={set('assunto')} style={{ ...INPUT_STYLE, color: '#152852' }}>
          <option value="" disabled>Nível de apoio</option>
          {NIVEIS_APOIO.map((n) => <option key={n}>{n}</option>)}
        </select>
        <textarea placeholder="Mensagem opcional" rows={3} value={values.mensagem} onChange={set('mensagem')} style={{ ...INPUT_STYLE, height: 'auto', padding: '12px 16px', resize: 'vertical' }} />
        {error && <p style={{ fontFamily: 'Inter', fontSize: 13, color: '#c0392b' }}>{error}</p>}
        <HubButton size="md" variant="blue" className={`w-full justify-center ${sending ? 'opacity-60 pointer-events-none' : ''}`} iconKey="pro.formularios.apoiar.btn.icone" iconLabel="Formulário Apoiar — botão, ícone" styleKey="pro.formularios.apoiar.btn" styleLabel="Formulário Apoiar — botão" noLink>
          <ET k="pro.formularios.apoiar.btn" v={sending ? 'Enviando…' : 'Apoiar o PROINTER'} l="Formulário Apoiar — botão" />
        </HubButton>
      </div>
    </form>
  );
}

function FormCandidatar() {
  const { values, set, handleSubmit, sending, sent, error } = useLeadForm(
    'prointer_inscricao',
    { nome: '', email: '', perfil: '', cidade: '', organizacao: '', mensagem: '' },
    ['nome', 'email', 'perfil', 'cidade', 'organizacao', 'mensagem'],
  );

  if (sent) {
    return (
      <div className="rounded-[20px] overflow-hidden bg-white" style={{ border: '1px solid #ecedf0' }}>
        <LeadFormSuccess titulo="Candidatura enviada!" desc="Boa sorte! Vamos avaliar seu perfil e retornamos em breve." />
      </div>
    );
  }

  return (
    <form className="rounded-[20px] overflow-hidden bg-white" style={{ border: '1px solid #ecedf0' }} onSubmit={handleSubmit}>
      <div className="p-8 lg:p-9 bg-lime">
        <p className="mb-2" style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 11, letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(21,40,82,0.6)' }}>
          <ET k="pro.formularios.candidatar.tag" v="PARA PROFESSORES E AFROEMPREENDEDORES" l="Formulário Candidatar — tag" />
        </p>
        <h3 className="mb-2" style={{ fontFamily: 'Luxenta', fontWeight: 600, fontSize: 26, lineHeight: 1.1, color: '#152852' }}>
          <ET k="pro.formularios.candidatar.titulo" v="Candidatar-se ao PROINTER" l="Formulário Candidatar — título" />
        </h3>
        <p style={{ fontFamily: 'Inter', fontSize: 14, lineHeight: '22px', color: 'rgba(21,40,82,0.75)' }}>
          <ERich k="pro.formularios.candidatar.desc" l="Formulário Candidatar — descrição">Inscrições para a turma 2027 abertas.</ERich>
        </p>
      </div>
      <div className="p-8 lg:p-9 space-y-4">
        <input required placeholder="Nome completo" value={values.nome} onChange={set('nome')} style={INPUT_STYLE} />
        <div className="grid sm:grid-cols-2 gap-4">
          <input required type="email" placeholder="E-mail" value={values.email} onChange={set('email')} style={INPUT_STYLE} />
          <select required value={values.perfil} onChange={set('perfil')} style={{ ...INPUT_STYLE, color: '#152852' }}>
            <option value="" disabled>Perfil</option>
            <option>Professor da rede pública</option><option>Afroempreendedor</option>
          </select>
        </div>
        <input required placeholder="Cidade e estado" value={values.cidade} onChange={set('cidade')} style={INPUT_STYLE} />
        <input required placeholder="Escola ou negócio onde atua" value={values.organizacao} onChange={set('organizacao')} style={INPUT_STYLE} />
        <textarea required placeholder="Por que você deveria ser bolsista?" rows={3} value={values.mensagem} onChange={set('mensagem')} style={{ ...INPUT_STYLE, height: 'auto', padding: '12px 16px', resize: 'vertical' }} />
        {error && <p style={{ fontFamily: 'Inter', fontSize: 13, color: '#c0392b' }}>{error}</p>}
        <HubButton size="md" variant="lime" className={`w-full justify-center ${sending ? 'opacity-60 pointer-events-none' : ''}`} iconKey="pro.formularios.candidatar.btn.icone" iconLabel="Formulário Candidatar — botão, ícone" styleKey="pro.formularios.candidatar.btn" styleLabel="Formulário Candidatar — botão" noLink>
          <ET k="pro.formularios.candidatar.btn" v={sending ? 'Enviando…' : 'Enviar candidatura'} l="Formulário Candidatar — botão" />
        </HubButton>
      </div>
    </form>
  );
}

function SecFormularios() {
  const ref = useReveal<HTMLElement>();
  const [bg, bgProps] = useEditColor('pro.formularios.bg', '#f5f5f5', 'Fundo da seção Participe ou Apoie');
  return (
    <section id="prointer-apoie" ref={ref} className="py-24 lg:py-32 gutter" {...bgProps} style={{ background: bg }}>
      <div className="mb-14 max-w-[700px]">
        <StepEyebrow step="08" k="pro.formularios">
          <ET k="pro.formularios.eyebrow" v="PARTICIPE OU APOIE" l="Formulários — selo da seção" />
        </StepEyebrow>
        <h2 className="mb-4" style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 'clamp(32px,4vw,50px)', letterSpacing: '-0.5px', lineHeight: 1, color: '#152852' }} data-animate>
          <ERich k="pro.formularios.titulo" l="Formulários — título">Dois caminhos. Uma missão.</ERich>
        </h2>
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <FormApoiar />
        <FormCandidatar />
      </div>
    </section>
  );
}

/* ═══════════ Também no ecossistema — tiles coloridos ═══════════ */

function SecEcossistema() {
  return (
    <section id="prointer-ecossistema" className="py-16 gutter bg-white">
      <p className="mb-6" style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 12, letterSpacing: '1.6px', textTransform: 'uppercase', color: '#a7a4a4' }}>
        <ET k="pro.ecossistema.titulo" v="TAMBÉM NO HUB PAN" l="Ecossistema — título da faixa" />
      </p>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {ECOSSISTEMA.map((e) => {
          const c = ECO_COLORS[e.color];
          const id = e.to.replace(/^\//, '');
          return (
            <Link key={e.t} to={e.to} className="group rounded-[16px] p-5 flex flex-col justify-between h-[110px] transition-transform duration-300 hover:-translate-y-1" style={{ background: c.bg }}>
              <span style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 12, letterSpacing: '1px', color: c.sub }}>
                <ET k={`pro.ecossistema.${id}.tag`} v={e.tag} l={`Ecossistema — tile "${e.t}", tag`} />
              </span>
              <span style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 13.5, lineHeight: '19px', color: c.text }}>
                <ET k={`pro.ecossistema.${id}.t`} v={e.t} l={`Ecossistema — tile "${e.t}", texto`} />
              </span>
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
    <section ref={ref} id="prointer-faq" className="py-24 lg:py-32 gutter bg-white">
      <div className="grid lg:grid-cols-[1fr_1.4fr] gap-12">
        <div>
          <p className="eyebrow text-muted mb-6" data-animate><ET k="pro.faq.eyebrow" v="PERGUNTAS FREQUENTES" l="FAQ — selo da seção" /></p>
          <h2 className="mb-4" style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 'clamp(32px,4vw,50px)', letterSpacing: '-0.5px', lineHeight: 1, color: '#152852' }} data-animate>
            <ERich k="pro.faq.titulo" l="FAQ — título">O que as pessoas mais perguntam sobre o PROINTER.</ERich>
          </h2>
          <p style={{ fontFamily: 'Inter', fontSize: 16, lineHeight: '27px', color: '#797979' }} data-animate>
            <ERich k="pro.faq.desc" l="FAQ — texto de apoio">Respostas diretas para quem quer participar, apoiar ou entender como o programa funciona.</ERich>
          </p>
        </div>
        <div data-animate>
          <FAQAccordion items={FAQ} />
        </div>
      </div>
    </section>
  );
}

/* ═══════════ DOE — ETAPA 09, fechamento da jornada ═══════════
 * Clímax da página: tudo antes conduz até aqui.
 * ⚠️ PROVISÓRIO: o destino do botão principal aponta pra /contato porque o
 * link de pagamento/doação ainda NÃO existe. Trocar por esse link assim que o
 * Bruno definir (aqui no `to=` ou direto pelo painel, via `styleKey`).
 */

function SecDoe() {
  const ref = useReveal<HTMLElement>();
  const [bg, bgProps] = useEditColor('pro.doe.bg', '#152852', 'Fundo da seção DOE (fechamento)');
  return (
    <section ref={ref} id="prointer-doe" className="relative w-full overflow-hidden" {...bgProps} style={{ background: bg }}>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(60% 90% at 50% 110%, rgba(210,231,24,0.22) 0%, transparent 70%)' }}
      />
      <div className="relative gutter py-28 lg:py-40 flex flex-col items-center text-center">
        <span className="flex items-center justify-center rounded-full mb-8" style={{ width: 64, height: 64, backdropFilter: 'blur(30px)', WebkitBackdropFilter: 'blur(30px)', background: 'rgba(210,231,24,0.12)', border: '1px solid rgba(210,231,24,0.45)' }} data-animate>
          <EIcon k="pro.doe.icone" l="DOE — ícone" defaultSize={28}>
            <HeartHandshake size={28} strokeWidth={1.8} color="#d2e718" />
          </EIcon>
        </span>

        <p className="eyebrow mb-6" style={{ color: 'rgba(255,255,255,0.6)' }} data-animate>
          <span style={{ color: '#d2e718' }}><ET k="pro.doe.etapa" v="09" l="DOE — número da etapa" /></span>
          <span style={{ opacity: 0.4 }}>{' / '}</span>
          <ET k="pro.doe.eyebrow" v="O ÚLTIMO PASSO DA JORNADA" l="DOE — selo da seção" />
        </p>

        <h2 className="mb-6" style={{ fontFamily: 'Luxenta', fontWeight: 600, fontSize: 'clamp(40px,6.5vw,92px)', letterSpacing: '-2px', lineHeight: 0.95, color: '#fff', maxWidth: 1000 }} data-animate>
          <ERich k="pro.doe.titulo" l="DOE — título" baseW={1000}>DOE PARA O <span style={{ color: '#d2e718' }}>HUB PAN</span></ERich>
        </h2>

        <p className="mb-10" style={{ fontFamily: 'Inter', fontSize: 'clamp(16px,1.5vw,20px)', lineHeight: '30px', color: 'rgba(255,255,255,0.8)', maxWidth: 600 }} data-animate>
          <ERich k="pro.doe.sub" l="DOE — texto de apoio" baseW={600}>Ajude a transformar novas vidas por meio do PROINTER.</ERich>
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4" data-animate>
          {/* ⚠️ destino PROVISÓRIO — trocar pelo link de pagamento quando existir */}
          <HubButton size="lg" variant="lime" to="/contato" iconKey="pro.doe.btn.doar.icone" iconLabel="DOE — botão Quero doar, ícone" styleKey="pro.doe.btn.doar" styleLabel="DOE — botão Quero doar">
            <ET k="pro.doe.btn.doar" v="Quero doar agora" l="DOE — botão Quero doar" />
          </HubButton>
          <HubButton size="lg" variant="outline-light" onClick={() => ScrollSmoother.get()?.scrollTo('#prointer-apoie', true)} iconKey="pro.doe.btn.empresa.icone" iconLabel="DOE — botão Sou empresa ou governo, ícone" styleKey="pro.doe.btn.empresa" styleLabel="DOE — botão Sou empresa ou governo">
            <ET k="pro.doe.btn.empresa" v="Sou empresa ou governo" l="DOE — botão Sou empresa ou governo" />
          </HubButton>
        </div>

        <p className="mt-8" style={{ fontFamily: 'Inter', fontSize: 13.5, lineHeight: '22px', color: 'rgba(255,255,255,0.5)' }} data-animate>
          <ERich k="pro.doe.nota" l="DOE — nota abaixo dos botões">Apoio a partir de R$ 500 — pessoas físicas, empresas, fundações e governos.</ERich>
        </p>
      </div>
    </section>
  );
}

/* ═══════════ Página ═══════════ */

export default function Prointer() {
  const [heroImg] = useEditImage(
    'pro.hero.img', '/images/prointer-hero-cambridge.webp', 'PROINTER — imagem de fundo do hero',
    { w: 2400, h: 1500, shape: 'paisagem', note: 'Fica atrás do texto branco do hero — prefira fotos escuras ou com área escura à esquerda.' }
  );
  const [stripBg, stripBgProps] = useEditColor('pro.hero.strip.bg', STRIP_THEMES.blue.bg, 'Hero — fundo da faixa de números');
  return (
    <>
      <div style={{ position: 'relative' }}>
        <Hero80
          id="prointer-hero"
          img={heroImg}
          imgAlt="Panorama de Cambridge, Massachusetts"
          eyebrow={<ET k="pro.hero.eyebrow" v="PROGRAMA DE INTERCÂMBIO E IMPACTO" l="Hero — eyebrow" />}
          title={<ERich k="pro.hero.titulo" l="PROINTER — título do hero (H1)">PROINTER</ERich>}
          sub={
            <ERich k="pro.hero.sub" l="PROINTER — texto de apoio do hero">
              O programa que leva professores da rede pública e afroempreendedores para dentro de Harvard Square, MIT e das Nações Unidas — com passagem aérea, hospedagem, suporte financeiro e curadoria completa de experiências. Gratuito para os bolsistas. Transformador para gerações.
            </ERich>
          }
          badge={
            <div className="inline-flex items-center gap-3 rounded-full px-5 py-3" style={{ backdropFilter: 'blur(17.6px)', WebkitBackdropFilter: 'blur(17.6px)', background: 'rgba(250,255,202,0.10)', border: '0.88px solid rgba(255,255,255,0.25)' }}>
              <Globe2 size={16} strokeWidth={2} color="#d2e718" />
              <span style={{ fontFamily: 'Inter', fontSize: 12.5, color: '#fff' }}>
                <ERich k="pro.hero.badge" l="PROINTER — badge de parceria do hero">
                  <span style={{ opacity: 0.65 }}>Parceria Estratégica Fundacional · </span>MIPAD ONU — Most Influential People of African Descent
                </ERich>
              </span>
            </div>
          }
          actions={<>
            <HubButton size="lg" variant="lime" onClick={() => ScrollSmoother.get()?.scrollTo('#prointer-apoie', true)} iconKey="pro.hero.btn.participar.icone" iconLabel="PROINTER — hero, botão Quero participar, ícone" styleKey="pro.hero.btn.participar" styleLabel="PROINTER — hero, botão Quero participar">
              <ET k="pro.hero.btn.participar" v="Quero participar" l="PROINTER — hero, botão Quero participar" />
            </HubButton>
            <HubButton size="lg" variant="blue" onClick={() => ScrollSmoother.get()?.scrollTo('#prointer-apoie', true)} iconKey="pro.hero.btn.apoiar.icone" iconLabel="PROINTER — hero, botão Apoiar o programa, ícone" styleKey="pro.hero.btn.apoiar" styleLabel="PROINTER — hero, botão Apoiar o programa">
              <ET k="pro.hero.btn.apoiar" v="Apoiar o programa" l="PROINTER — hero, botão Apoiar o programa" />
            </HubButton>
            <HubButton size="lg" variant="outline-light" onClick={() => ScrollSmoother.get()?.scrollTo('#prointer-organizacoes', true)} iconKey="pro.hero.btn.empresa.icone" iconLabel="PROINTER — hero, botão Sou empresa ou governo, ícone" styleKey="pro.hero.btn.empresa" styleLabel="PROINTER — hero, botão Sou empresa ou governo">
              <ET k="pro.hero.btn.empresa" v="Sou empresa ou governo" l="PROINTER — hero, botão Sou empresa ou governo" />
            </HubButton>
          </>}
          stats={STATS}
          strip={{ ...STRIP_THEMES.blue, bg: stripBg }}
          stripProps={stripBgProps}
        />
        <BgEditChip
          k="pro.hero.img" v="/images/prointer-hero-cambridge.webp" l="PROINTER — imagem de fundo do hero"
          spec={{ w: 2400, h: 1500, shape: 'paisagem', note: 'Fica atrás do texto branco do hero — prefira fotos escuras ou com área escura à esquerda.' }}
          style={{ bottom: 24, right: 24 }}
        />
      </div>
      {/* Jornada de engajamento (revisão editorial do cliente):
          conheça → para quem → impacto → histórias → resultados → apoiadores
          → por que apoiar → participe/apoie → DOE (fechamento). */}
      <SecJornada />
      <SecProposito />
      <SecPublicos />
      <SecMissao />
      <SecHistorias />
      <SecResultados />
      <SecApoiadores />
      <SecOrganizacoes />
      <SecFormularios />
      <SecEcossistema />
      <SecFAQ />
      <SecDoe />
    </>
  );
}
