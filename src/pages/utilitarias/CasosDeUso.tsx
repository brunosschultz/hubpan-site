import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Landmark, GraduationCap, Briefcase } from 'lucide-react';
import PageHero from '../../components/PageHero';
import HubButton from '../../components/HubButton';
import { useReveal } from '../../components/useReveal';
import { useTilt } from '../../components/useTilt';
import { EIcon, EImg, ERich, ET, useEditColor } from '../../editor/fields';

/* ═══════════ Dados — extraídos do wireframe oficial (page-casos) ═══════════ */

const PLATAFORMAS = ['Todos', 'PROINTER', 'GovIA', 'Fórum Mundial de IA', 'Fórum Pan-Americano'];
const PLATAFORMA_SLUGS: Record<string, string> = {
  Todos: 'todos',
  PROINTER: 'prointer',
  GovIA: 'govia',
  'Fórum Mundial de IA': 'forum-ia',
  'Fórum Pan-Americano': 'forum-panamericano',
};

const CASOS = [
  {
    id: 'professora-mg',
    plataforma: 'PROINTER', img: 's7-persona-2', tag: 'PROINTER · Educação', selo: 'Missão 2027', tipo: 'História de impacto',
    titulo: '"Quando voltei de Harvard, minha escola inteira mudou de perspectiva"',
    desc: 'Professora de matemática da rede municipal de Minas Gerais, selecionada como bolsista PROINTER pela performance em programa de extensão Premier Niveau. Após a missão em Nova York, Boston e Cambridge, implementou projeto de inovação pedagógica reconhecido pela Secretaria de Educação do estado.',
    stats: [{ v: '320', l: 'Alunos impactados' }, { v: '3', l: 'Projetos derivados' }, { v: 'ODS 4', l: 'Alinhamento' }],
    cta: 'Ler história completa',
  },
  {
    id: 'prefeitura-mg',
    plataforma: 'GovIA', img: 's3-accordion-govia', tag: 'GovIA · Administração Pública', selo: 'Piloto MG · 2026', tipo: 'Caso de uso',
    titulo: 'Prefeitura de município mineiro adota IA para comunicação e atendimento ao cidadão',
    desc: 'Município com 45.000 habitantes no interior de Minas Gerais assinou o plano Municipal do GovIA e capacitou 18 servidores em 6 semanas. Resultado: redução de 40% no tempo de produção de comunicados oficiais e implementação de chatbot de atendimento para dúvidas sobre IPTU.',
    stats: [{ v: '18', l: 'Servidores capacitados' }, { v: '40%', l: 'Redução de tempo' }, { v: '6 sem', l: 'Para implementar' }],
    cta: 'Ver caso completo',
  },
  {
    id: 'startup-onu',
    plataforma: 'Fórum Pan-Americano', img: 'inst-nyc-onu', tag: 'Fórum Pan-Americano · ONU', selo: 'Expo NY 2025', tipo: 'Caso de uso',
    titulo: 'Startup de separação de resíduos apresenta projeto na ONU e firma parceiro nos EUA',
    desc: 'Empresa participante da Expo New York 2025 apresentou projeto de inovação de impacto em gestão de resíduos na sede das Nações Unidas. Resultado: contato com investidor americano, início de negociação de partnership e reconhecimento do projeto como boas práticas em ODS 11 (cidades sustentáveis).',
    stats: [{ v: 'ONU', l: 'Palco do pitch' }, { v: '1', l: 'Investidor contatado' }, { v: 'ODS 11', l: 'Alinhamento' }],
    cta: 'Ver caso completo',
  },
  {
    id: 'afroempreendedor-mipad',
    plataforma: 'PROINTER', img: 'inst-cambridge-harvard', tag: 'PROINTER · Afroempreendedorismo', selo: 'Missão 2027', tipo: 'História de impacto',
    titulo: 'Afroempreendedor acessa rede MIPAD em Cambridge e abre mercado internacional',
    desc: 'Empreendedor negro com negócio de tecnologia educacional participou do PROINTER e foi conectado à rede MIPAD ONU em Cambridge. Após a missão, iniciou conversas com parceiro africano e assinou primeiro contrato internacional de distribuição de sua plataforma educacional.',
    stats: [{ v: 'MIPAD', l: 'Rede acessada' }, { v: '1', l: 'Contrato fechado' }, { v: 'ODS 10', l: 'Alinhamento' }],
    cta: 'Ler história completa',
  },
];

const PERFIS: { id: string; sigla: string; Icon: typeof Landmark; titulo: string; desc: string; btn: string; to: string; color: 'navy' | 'blue' | 'lime' }[] = [
  { id: 'governo', sigla: 'GOV', Icon: Landmark, titulo: 'Sou governo', desc: 'Ver como o GovIA funciona na prática para municípios e estados.', btn: 'Conhecer o GovIA', to: '/govia', color: 'navy' },
  { id: 'educador', sigla: 'EDU', Icon: GraduationCap, titulo: 'Sou educador', desc: 'Me candidatar ao PROINTER e acessar Harvard, MIT e a ONU.', btn: 'Candidatar-se ao PROINTER', to: '/prointer', color: 'blue' },
  { id: 'empresa', sigla: 'EMP', Icon: Briefcase, titulo: 'Sou empresa', desc: 'Apoiar o PROINTER ou patrocinar o Fórum Mundial de IA.', btn: 'Falar com nossa equipe', to: '/contato', color: 'lime' },
];

const PERFIL_COLORS = {
  navy: { bg: '#152852', title: '#fff', desc: 'rgba(255,255,255,0.75)', sigla: '#d2e718', badgeBg: 'rgba(255,255,255,0.08)', badgeIcon: '#d2e718', btn: 'lime' as const },
  blue: { bg: '#2d4ebf', title: '#fff', desc: 'rgba(255,255,255,0.82)', sigla: '#d2e718', badgeBg: 'rgba(255,255,255,0.12)', badgeIcon: '#d2e718', btn: 'lime' as const },
  lime: { bg: '#d2e718', title: '#152852', desc: 'rgba(21,40,82,0.8)', sigla: '#152852', badgeBg: 'rgba(21,40,82,0.08)', badgeIcon: '#152852', btn: 'navy' as const },
};

/* ═══════════ Componentes ═══════════ */

function CasoCard({ c }: { c: (typeof CASOS)[number] }) {
  const tilt = useTilt<HTMLDivElement>(3, 5);
  return (
    <div ref={tilt} className="grid md:grid-cols-[280px_1fr] rounded-[20px] overflow-hidden bg-white" style={{ border: '1px solid #ecedf0' }} data-animate>
      <div className="relative h-[220px] md:h-full">
        <EImg
          k={`casos.caso.${c.id}.img`} v={`/images/${c.img}.webp`}
          l={`Casos de Uso — foto do caso "${c.titulo.slice(0, 30)}…"`}
          spec={{ w: 800, h: 800, shape: 'paisagem' }}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <span className="rounded-full px-3 py-1.5" style={{ background: 'rgba(6,9,25,0.6)', backdropFilter: 'blur(8px)', fontFamily: 'Inter', fontWeight: 500, fontSize: 10.5, letterSpacing: '1px', textTransform: 'uppercase', color: '#fff' }}>
            <ET k={`casos.caso.${c.id}.tag`} v={c.tag} l={`Casos de Uso — tag do caso "${c.titulo.slice(0, 30)}…"`} />
          </span>
          <span className="rounded-full px-3 py-1.5" style={{ background: '#d2e718', fontFamily: 'Inter', fontWeight: 600, fontSize: 10.5, color: '#152852' }}>
            <ET k={`casos.caso.${c.id}.selo`} v={c.selo} l={`Casos de Uso — selo do caso "${c.titulo.slice(0, 30)}…"`} />
          </span>
        </div>
      </div>
      <div className="p-7 lg:p-8 flex flex-col">
        <p className="mb-2" style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 10.5, letterSpacing: '1.8px', textTransform: 'uppercase', color: '#a7a4a4' }}>
          <ET k={`casos.caso.${c.id}.tipo`} v={c.tipo} l={`Casos de Uso — tipo do caso "${c.titulo.slice(0, 30)}…"`} />
        </p>
        <h3 className="mb-3" style={{ fontFamily: 'Luxenta', fontWeight: 600, fontSize: 21, lineHeight: 1.2, color: '#152852' }}>
          <ERich k={`casos.caso.${c.id}.titulo`} l={`Casos de Uso — título do caso "${c.titulo.slice(0, 30)}…"`}>{c.titulo}</ERich>
        </h3>
        <p className="mb-6" style={{ fontFamily: 'Inter', fontSize: 14, lineHeight: '23px', color: '#797979' }}>
          <ERich k={`casos.caso.${c.id}.desc`} l={`Casos de Uso — descrição do caso "${c.titulo.slice(0, 30)}…"`}>{c.desc}</ERich>
        </p>
        <div className="flex flex-wrap gap-6 mb-6 mt-auto">
          {c.stats.map((s, i) => (
            <div key={s.l}>
              <p style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 24, lineHeight: 1, color: '#2d4ebf' }}>
                <ET k={`casos.caso.${c.id}.stat${i + 1}.valor`} v={s.v} l={`Casos de Uso — valor do stat "${s.l}" (caso "${c.titulo.slice(0, 30)}…")`} />
              </p>
              <p style={{ fontFamily: 'Inter', fontSize: 11.5, color: '#a7a4a4' }}>
                <ET k={`casos.caso.${c.id}.stat${i + 1}.rotulo`} v={s.l} l={`Casos de Uso — rótulo do stat "${s.l}" (caso "${c.titulo.slice(0, 30)}…")`} />
              </p>
            </div>
          ))}
        </div>
        <Link to="/contato" style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 14, color: '#2d4ebf' }}>
          <ET k={`casos.caso.${c.id}.cta`} v={c.cta} l={`Casos de Uso — CTA do caso "${c.titulo.slice(0, 30)}…"`} /> →
        </Link>
      </div>
    </div>
  );
}

function PerfilCard({ p }: { p: (typeof PERFIS)[number] }) {
  const { Icon } = p;
  const c = PERFIL_COLORS[p.color];
  const [bg, bgProps] = useEditColor(`casos.perfil.${p.id}.bg`, c.bg, `Fundo do card "${p.titulo}"`);
  return (
    <div className="flex flex-col rounded-[20px] p-7" {...bgProps} style={{ background: bg }} data-animate>
      <div className="flex items-center gap-3 mb-6">
        <span className="flex items-center justify-center rounded-full shrink-0" style={{ width: 48, height: 48, background: c.badgeBg }}>
          <EIcon k={`casos.perfil.${p.id}.icon`} l={`Casos de Uso — ícone do perfil "${p.titulo}"`} defaultSize={22}>
            <Icon size={22} strokeWidth={2} color={c.badgeIcon} />
          </EIcon>
        </span>
        <span style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 12, letterSpacing: '1px', color: c.sigla }}>
          <ET k={`casos.perfil.${p.id}.sigla`} v={p.sigla} l={`Casos de Uso — sigla do perfil "${p.titulo}"`} />
        </span>
      </div>
      <h3 className="mb-2" style={{ fontFamily: 'Luxenta', fontWeight: 600, fontSize: 21, lineHeight: 1.15, color: c.title }}>
        <ERich k={`casos.perfil.${p.id}.titulo`} l={`Casos de Uso — título do perfil "${p.titulo}"`}>{p.titulo}</ERich>
      </h3>
      <p className="mb-7" style={{ fontFamily: 'Inter', fontSize: 14, lineHeight: '23px', color: c.desc }}>
        <ERich k={`casos.perfil.${p.id}.desc`} l={`Casos de Uso — descrição do perfil "${p.titulo}"`}>{p.desc}</ERich>
      </p>
      <div className="mt-auto"><Link to={p.to}><HubButton size="sm" variant={c.btn} iconKey={`casos.perfil.${p.id}.btn.icone`} iconLabel={`Casos de Uso — botão do perfil "${p.titulo}", ícone`}><ET k={`casos.perfil.${p.id}.btn`} v={p.btn} l={`Casos de Uso — botão do perfil "${p.titulo}"`} /></HubButton></Link></div>
    </div>
  );
}

/* ═══════════ Página ═══════════ */

export default function CasosDeUso() {
  const ref = useReveal<HTMLElement>();
  const perfilRef = useReveal<HTMLElement>();
  const [ativo, setAtivo] = useState('Todos');
  const visiveis = ativo === 'Todos' ? CASOS : CASOS.filter((c) => c.plataforma === ativo);
  const [bg, bgProps] = useEditColor('casos.bg', '#ffffff', 'Fundo da seção Casos de Uso');
  const [perfisBg, perfisBgProps] = useEditColor('casos.perfis.bg', '#f5f5f5', 'Fundo da seção "Sou..."');

  return (
    <>
      <PageHero
        bgKey="casos.hero"
        eyebrow={<ET k="casos.hero.eyebrow" v="CASOS DE USO · HISTÓRIAS DE IMPACTO · RESULTADOS REAIS" l="Casos de Uso — rótulo do hero" />}
        title={<ERich k="casos.hero.titulo" l="Casos de Uso — título do hero">O que o HUB PAN entrega na prática.</ERich>}
        sub={<ERich k="casos.hero.sub" l="Casos de Uso — subtítulo do hero">Não basta dizer que o ecossistema funciona. Aqui estão os dados, as histórias e os resultados documentados de quem já viveu o que o HUB PAN propõe.</ERich>}
      />

      <section ref={ref} className="py-24 lg:py-32 gutter" {...bgProps} style={{ background: bg }}>
        <div className="mb-10">
          <p className="eyebrow text-muted mb-6" data-animate><ET k="casos.secao.eyebrow" v="POR PLATAFORMA" l="Casos de Uso — selo da seção de filtros" /></p>
          <h2 className="mb-8" style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 'clamp(28px,3vw,38px)', letterSpacing: '-0.5px', lineHeight: 1.1, color: '#152852' }} data-animate>
            <ERich k="casos.secao.titulo" l="Casos de Uso — título da seção de filtros">Casos de uso por área do ecossistema.</ERich>
          </h2>
          <div className="flex flex-wrap gap-3" data-animate>
            {PLATAFORMAS.map((p) => (
              <button
                key={p}
                onClick={() => setAtivo(p)}
                className="rounded-full px-5 py-2 transition-colors"
                style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 13.5, background: ativo === p ? '#152852' : '#f5f5f5', color: ativo === p ? '#fff' : '#797979' }}
              >
                <ET k={`casos.plataforma.${PLATAFORMA_SLUGS[p]}`} v={p} l={`Casos de Uso — botão de filtro "${p}"`} />
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {visiveis.map((c) => <CasoCard key={c.id} c={c} />)}
        </div>
      </section>

      <section ref={perfilRef} className="py-20 gutter" {...perfisBgProps} style={{ background: perfisBg }}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PERFIS.map((p) => <PerfilCard key={p.id} p={p} />)}
        </div>
      </section>
    </>
  );
}
