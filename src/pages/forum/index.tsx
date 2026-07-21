import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { Check } from 'lucide-react';
import Hero80, { STRIP_THEMES } from '../../components/Hero80';
import FAQAccordion from '../../components/FAQAccordion';
import HubButton from '../../components/HubButton';
import { useReveal } from '../../components/useReveal';
import { useTilt } from '../../components/useTilt';
import { BgEditChip, ERich, ET, useEditColor, useEditImage } from '../../editor/fields';

gsap.registerPlugin(ScrollTrigger);

/* ═══════════ Dados — extraídos do wireframe oficial (page-waif) ═══════════ */

const STATS = [
  { value: '2027', editKey: 'forum.hero.stat1.valor', editLabel: 'Hero — stat 1 (valor)', label: <ET k="forum.hero.stat1.label" v="Primeira edição" l="Hero — stat 1 (rótulo)" />, accent: true },
  { value: 'CAM', editKey: 'forum.hero.stat2.valor', editLabel: 'Hero — stat 2 (valor)', label: <ET k="forum.hero.stat2.label" v="Cambridge, MA" l="Hero — stat 2 (rótulo)" /> },
  { value: 'WAIF', editKey: 'forum.hero.stat3.valor', editLabel: 'Hero — stat 3 (valor)', label: <ET k="forum.hero.stat3.label" v="World AI Forum" l="Hero — stat 3 (rótulo)" /> },
  { value: 'ONU', editKey: 'forum.hero.stat4.valor', editLabel: 'Hero — stat 4 (valor)', label: <ET k="forum.hero.stat4.label" v="Ancoragem institucional" l="Hero — stat 4 (rótulo)" /> },
  { value: 100, suffix: '%', editKey: 'forum.hero.stat5.valor', editLabel: 'Hero — stat 5 (valor)', label: <ET k="forum.hero.stat5.label" v="Ativo proprietário" l="Hero — stat 5 (rótulo)" /> },
];

const PILARES: { sigla: string; titulo: string; desc: string; gera: string; color: 'white' | 'blue' | 'lime' | 'navy' }[] = [
  { sigla: 'AU', titulo: 'Autoridade Temática', desc: 'O WAIF posiciona o HUB PAN como referência em governança de IA e inovação de impacto. Cada edição gera conteúdo, dados do Observatório, pesquisas e publicações que circulam com o WAIF como fonte.', gera: 'Gera: mídia espontânea · citações acadêmicas · convites institucionais', color: 'white' },
  { sigla: 'RE', titulo: 'Relacionamento Estratégico', desc: 'O Fórum coloca no mesmo ambiente: CEOs de empresas de IA, policy makers, reitores, representantes de governos, pesquisadores de Harvard e MIT, lideranças do MIPAD e investidores. Networking único no Brasil.', gera: 'Gera: parcerias · contratos · relações institucionais de longo prazo', color: 'blue' },
  { sigla: 'PA', titulo: 'Patrocínio e Negócios', desc: 'Para patrocinadores, o WAIF é a oportunidade de associar a marca ao ecossistema de IA mais estratégico das Américas — com visibilidade perante tomadores de decisão qualificados em Harvard Square, Cambridge.', gera: 'Gera: retorno de marca · acesso a decisores · presença em Cambridge', color: 'lime' },
  { sigla: 'EC', titulo: 'Ecossistema HUB PAN', desc: 'O WAIF é o epicentro do ecossistema — conecta GovIA (dados do Observatório), PROINTER (bolsistas presentes), Academy (conteúdo gerado), Alliance (membros) e Insights (publicações). Cada plataforma converge para o Fórum.', gera: 'Gera: fortalecimento do ecossistema · cross-sell entre plataformas', color: 'navy' },
];

const PILAR_COLORS = {
  white: { bg: '#ffffff', border: '1px solid #ecedf0', title: '#152852', desc: '#797979', foot: '#a7a4a4', footBorder: '#ecedf0', badgeBg: '#f5f5f5', badgeText: '#2d4ebf' },
  blue: { bg: '#2d4ebf', border: undefined, title: '#ffffff', desc: 'rgba(255,255,255,0.82)', foot: 'rgba(255,255,255,0.6)', footBorder: 'rgba(255,255,255,0.2)', badgeBg: 'rgba(255,255,255,0.12)', badgeText: '#d2e718' },
  lime: { bg: '#d2e718', border: undefined, title: '#152852', desc: 'rgba(21,40,82,0.8)', foot: 'rgba(21,40,82,0.55)', footBorder: 'rgba(21,40,82,0.15)', badgeBg: 'rgba(21,40,82,0.08)', badgeText: '#152852' },
  navy: { bg: '#152852', border: undefined, title: '#ffffff', desc: 'rgba(255,255,255,0.78)', foot: 'rgba(255,255,255,0.55)', footBorder: 'rgba(255,255,255,0.15)', badgeBg: 'rgba(255,255,255,0.1)', badgeText: '#d2e718' },
} as const;

const EDICAO_ITENS = [
  'Palestras principais com lideranças globais de IA',
  'Painéis: IA e governança, IA e ODS, IA inclusiva',
  'Lançamento dos dados do Observatório de IA HUB PAN',
  'Sessões de networking curado por perfil',
  'Experiências no ecossistema Harvard Square e MIT',
  'Publicação do Relatório Anual de IA nas Américas e África',
];

const CONTEXTO = [
  { id: 'antecedente', tag: 'Antecedente', titulo: 'Expo Boston como trampolim', desc: 'A Expo Boston (maio 2026) é o antecedente direto do WAIF — mesma audiência, mesmo ecossistema, escala e ambição amplificadas para 2027.' },
  { id: 'estrategia', tag: 'Estratégia', titulo: 'Campanha de apoiadores no Brasil', desc: 'Após o lançamento do portal, campanha nacional com foco em captação de patrocinadores brasileiros. Oportunidade de entrada no nível fundador — menor custo e maior retorno.' },
  { id: 'sinergia', tag: 'Sinergia', titulo: 'GovIA e Observatório no centro', desc: 'O Fórum é o principal momento de divulgação dos dados do Observatório de IA e apresentação do GovIA para policy makers e gestores internacionais.' },
];

const NIVEIS = [
  {
    id: 'bronze', nivel: 'Nível 01', nome: 'Bronze', desc: 'Visibilidade e presença. Ideal para marcas que querem estar associadas ao Fórum.',
    inclui: ['Logo em materiais do evento', '2 ingressos para o Fórum', 'Menção nas comunicações', 'Relatório pós-evento'],
    destaque: false,
  },
  {
    id: 'prata', nivel: 'Nível 02', nome: 'Prata', desc: 'Ativações e conteúdo. Para marcas que querem leads qualificados e posicionamento editorial em IA.',
    inclui: ['Tudo do Bronze', 'Painel ou workshop no programa', '5 ingressos para o Fórum', 'Artigo no HUB PAN Insights'],
    destaque: false,
  },
  {
    id: 'ouro', nivel: 'Nível 03', nome: 'Ouro', desc: 'Parceria estratégica. Liderança editorial, acesso a decisores e posicionamento permanente no HUB PAN.',
    inclui: ['Tudo do Prata', 'Keynote ou abertura do Fórum', '10 ingressos + convidados VIP', 'Co-branding em todas as comunicações', 'Acesso à rede MIPAD ONU', 'Presença permanente na HUB PAN Alliance'],
    destaque: true, tagLabel: 'Maior retorno',
  },
];

const OBJETIVOS = ['Visibilidade de marca em Cambridge', 'Acesso a decisores e policy makers', 'Posicionamento editorial em IA', 'Geração de leads qualificados', 'Todos os anteriores'];
const PARTICIPACAO = ['Participante', 'Palestrante', 'Mediador de painel', 'Representante de governo ou organismo', 'Pesquisador ou acadêmico'];
const EXPERTISE = ['Governança e políticas públicas de IA', 'IA e educação', 'IA e saúde', 'IA e cidades inteligentes', 'IA e ESG / ODS', 'Pesquisa e desenvolvimento em IA', 'Negócios e mercado de IA'];

const ECOSSISTEMA = [
  { id: 'governos', tag: 'Governos', t: 'GovIA — IA e Observatório', to: '/govia', color: 'navy' as const },
  { id: 'esg', tag: 'ESG', t: 'PROINTER — Impacto transgeracional', to: '/prointer', color: 'blue' as const },
  { id: 'alliance', tag: 'Alliance', t: 'Rede estratégica de parceiros', to: '/o-hub-pan', color: 'lime' as const },
  { id: 'press', tag: 'Press', t: 'Imprensa e press kit', to: '/imprensa', color: 'blue' as const },
];

const ECO_COLORS = {
  blue: { bg: '#2d4ebf', text: '#fff', sub: 'rgba(255,255,255,0.7)' },
  lime: { bg: '#d2e718', text: '#152852', sub: 'rgba(21,40,82,0.65)' },
  navy: { bg: '#152852', text: '#fff', sub: 'rgba(255,255,255,0.6)' },
};

const FAQ_RAW = [
  { id: 'o-que-e-waif', q: 'O que é o Fórum Mundial de Inteligência Artificial (WAIF)?', a: 'O Fórum Mundial de Inteligência Artificial — WAIF (World Artificial Intelligence Forum) — é um evento proprietário do HUB PAN que reúne grandes players globais de IA, policy makers, pesquisadores, governos e investidores em Cambridge, Massachusetts. A primeira edição está prevista para 2027, ancorada em Harvard Square, com perspectiva pan-americana e pan-africana — diferencial que nenhum outro fórum brasileiro oferece.' },
  { id: 'por-que-cambridge', q: 'Por que o WAIF acontece em Cambridge e não no Brasil?', a: 'Cambridge, Massachusetts, é o metro quadrado de inovação mais disputado das Américas — abriga Harvard, MIT e um ecossistema denso de empresas de tecnologia, startups e centros de pesquisa de referência mundial. O HUB PAN tem sua sede global em Harvard Square, o que torna Cambridge o local natural e estrategicamente mais poderoso para um fórum de IA com pretensões globais.' },
  { id: 'retorno-patrocinador', q: 'Qual o retorno esperado para um patrocinador do WAIF?', a: 'Patrocinadores do WAIF ganham visibilidade perante um público qualificado de tomadores de decisão em IA, acesso a networking exclusivo em Harvard Square, co-branding em todas as comunicações do evento, acesso a dados inéditos do Observatório de IA HUB PAN e — nos níveis mais altos — ingresso permanente na HUB PAN Alliance e acesso à rede MIPAD ONU.' },
  { id: 'relacao-govia', q: 'Como o WAIF se relaciona com o GovIA e o Observatório de IA?', a: 'O Fórum Mundial de IA é o principal momento de lançamento e divulgação dos dados do Observatório de IA HUB PAN — o primeiro mapeamento sistemático do uso de IA na administração pública brasileira. O WAIF também é a vitrine do GovIA para policy makers e gestores públicos internacionais, criando sinergia direta entre as plataformas do ecossistema.' },
  { id: 'propor-palestra', q: 'Posso propor uma palestra ou painel no WAIF 2027?', a: 'Sim. O WAIF aceita propostas de palestrantes e mediadores de painéis com expertise em governança de IA, IA e ODS, IA inclusiva, políticas públicas de IA, IA e educação, IA e saúde, e mercado de IA nas Américas e África. As propostas passam por processo de seleção e devem ser submetidas pelo formulário de manifestação de interesse nesta página.' },
];

const FAQ = FAQ_RAW.map((f) => ({
  q: <ET k={`forum.faq.${f.id}.q`} v={f.q} l={`FAQ — pergunta (${f.id})`} />,
  a: <ERich k={`forum.faq.${f.id}.a`} l={`FAQ — resposta (${f.id})`}>{f.a}</ERich>,
}));

const INPUT_STYLE: React.CSSProperties = {
  height: 50, borderRadius: 10, background: '#f5f5f5', border: '1px solid #ecedf0',
  fontFamily: 'Inter', fontSize: 14.5, color: '#152852', padding: '0 16px', width: '100%', outline: 'none',
};

/* ═══════════ Seções ═══════════ */

function SecDiferencial() {
  const ref = useReveal<HTMLElement>();
  const tilt = useTilt<HTMLDivElement>(3, 4);
  const [bg, bgProps] = useEditColor('forum.diferencial.bg', '#ffffff', 'Fundo da seção Diferencial');
  const [imgSrc, imgProps] = useEditImage(
    'forum.diferencial.img', '/images/forum-onu-flags.webp', 'Diferencial — foto',
    { w: 1400, h: 1050, shape: 'paisagem', note: 'Foto com overlay escuro na base — prefira imagens com boa área de contraste embaixo.' }
  );
  return (
    <section ref={ref} className="relative w-full overflow-hidden" {...bgProps} style={{ background: bg }}>
      <div className="gutter grid lg:grid-cols-2 gap-12 lg:gap-16 py-20 lg:py-0 lg:min-h-screen items-center">
        <div>
          <p className="eyebrow text-muted mb-6" data-animate>
            <ET k="forum.diferencial.eyebrow" v="DIFERENCIAL DO WAIF" l="Diferencial — selo da seção" />
          </p>
          <h2 className="mb-7" style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 'clamp(32px,4vw,50px)', letterSpacing: '-0.5px', lineHeight: 1.05, color: '#152852' }} data-animate>
            <ERich k="forum.diferencial.titulo" l="Diferencial — título">
              Por que o WAIF é <span style={{ color: '#2d4ebf' }}>diferente</span> de tudo que existe.
            </ERich>
          </h2>
          <p className="mb-5" style={{ fontFamily: 'Inter', fontSize: 16.5, lineHeight: '28px', color: '#797979' }} data-animate>
            <ERich k="forum.diferencial.paragrafo1" l="Diferencial — parágrafo 1">
              O mercado tem dezenas de eventos sobre inteligência artificial. O que o WAIF traz de diferente não é o tema — é a combinação que nenhum outro fórum brasileiro consegue reunir: localização estratégica em Cambridge, ancoragem institucional com ONU e MIPAD, conexão direta com o Observatório de IA e uma perspectiva genuinamente pan-americana e pan-africana.
            </ERich>
          </p>
          <p style={{ fontFamily: 'Inter', fontSize: 16.5, lineHeight: '28px', color: '#797979' }} data-animate>
            <ERich k="forum.diferencial.paragrafo2" l="Diferencial — parágrafo 2">
              Enquanto outros falam de IA de forma genérica, o WAIF entra nos temas que importam para as Américas e África: governança de IA no setor público, IA e ODS, IA inclusiva e o papel da cooperação Sul-Sul.
            </ERich>
          </p>
        </div>

        <div ref={tilt} className="relative rounded-[20px] overflow-hidden" style={{ aspectRatio: '4 / 3' }} data-animate>
          <img src={imgSrc} alt="Sede da ONU com bandeiras dos países membros" className="absolute inset-0 w-full h-full object-cover" {...imgProps} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(6,9,25,0.85) 0%, transparent 55%)' }} />
          <div className="absolute inset-x-0 bottom-0 p-7">
            <p className="mb-1" style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 11, letterSpacing: '1.6px', textTransform: 'uppercase', color: '#d2e718' }}>
              <ET k="forum.diferencial.foto.selo" v="ANCORAGEM INSTITUCIONAL" l="Diferencial — selo da foto" />
            </p>
            <p style={{ fontFamily: 'Luxenta', fontWeight: 600, fontSize: 22, lineHeight: 1.15, color: '#fff' }}>
              <ET k="forum.diferencial.foto.titulo" v="ONU · MIPAD · Harvard Square" l="Diferencial — legenda da foto" />
            </p>
          </div>
          <BgEditChip
            k="forum.diferencial.img" v="/images/forum-onu-flags.webp" l="Diferencial — foto"
            spec={{ w: 1400, h: 1050, shape: 'paisagem', note: 'Foto com overlay escuro na base — prefira imagens com boa área de contraste embaixo.' }}
            style={{ top: 16, right: 16 }}
          />
        </div>
      </div>
    </section>
  );
}

function PilarCard({ p }: { p: (typeof PILARES)[number] }) {
  const tilt = useTilt<HTMLDivElement>(5, 7);
  const c = PILAR_COLORS[p.color];
  const id = p.sigla.toLowerCase();
  const [bg, bgProps] = useEditColor(`forum.pilar.${id}.bg`, c.bg, `Pilar "${p.titulo}" — fundo do card`);
  return (
    <div ref={tilt} className="rounded-[20px] p-7 flex flex-col" style={{ background: bg, border: c.border }} {...bgProps} data-animate>
      <span className="flex items-center justify-center rounded-full mb-6 shrink-0" style={{ width: 48, height: 48, background: c.badgeBg }}>
        <span style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 13, color: c.badgeText }}>
          <ET k={`forum.pilar.${id}.sigla`} v={p.sigla} l={`Pilar "${p.titulo}" — sigla`} />
        </span>
      </span>
      <h3 className="mb-3" style={{ fontFamily: 'Luxenta', fontWeight: 600, fontSize: 21, lineHeight: 1.1, color: c.title }}>
        <ERich k={`forum.pilar.${id}.titulo`} l={`Pilar "${p.titulo}" — título`}>{p.titulo}</ERich>
      </h3>
      <p className="mb-5" style={{ fontFamily: 'Inter', fontSize: 14, lineHeight: '23px', color: c.desc }}>
        <ERich k={`forum.pilar.${id}.desc`} l={`Pilar "${p.titulo}" — descrição`}>{p.desc}</ERich>
      </p>
      <p className="mt-auto pt-4 border-t" style={{ borderColor: c.footBorder, fontFamily: 'Inter', fontSize: 12.5, color: c.foot }}>
        <ET k={`forum.pilar.${id}.gera`} v={p.gera} l={`Pilar "${p.titulo}" — rodapé "Gera"`} />
      </p>
    </div>
  );
}

function SecPilares() {
  const ref = useReveal<HTMLElement>();
  const [bg, bgProps] = useEditColor('forum.pilares.bg', '#f5f5f5', 'Fundo da seção Pilares');
  return (
    <section ref={ref} className="py-24 lg:py-32 gutter" {...bgProps} style={{ background: bg }}>
      <div className="mb-14 max-w-[700px]">
        <p className="eyebrow text-muted mb-6" data-animate>
          <ET k="forum.pilares.eyebrow" v="OS PILARES DO WAIF" l="Pilares — selo da seção" />
        </p>
        <h2 style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 'clamp(32px,4vw,50px)', letterSpacing: '-0.5px', lineHeight: 1, color: '#152852' }} data-animate>
          <ERich k="forum.pilares.titulo" l="Pilares — título">Um fórum com quatro camadas de valor.</ERich>
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {PILARES.map((p) => <PilarCard key={p.sigla} p={p} />)}
      </div>
    </section>
  );
}

/* Edição 2027 — seção escura com foto + lista + contexto */
function SecEdicao() {
  const ref = useReveal<HTMLDivElement>();
  const [bg, bgProps] = useEditColor('forum.edicao.bg', '#060919', 'Fundo da seção Edição 2027');
  const [imgSrc, imgProps] = useEditImage(
    'forum.edicao.img', '/images/forum-hero-mit.webp', 'Edição 2027 — foto',
    { w: 1400, h: 1050, shape: 'paisagem', note: 'Foto com overlay escuro na base.' }
  );
  return (
    <section className="relative w-full overflow-hidden" {...bgProps} style={{ background: bg }}>
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.03) 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
      <div ref={ref} className="relative gutter py-24 lg:py-32">
        <div className="mb-14 max-w-[720px]">
          <p className="eyebrow mb-6" style={{ color: 'rgba(255,255,255,0.69)' }} data-animate>
            <ET k="forum.edicao.eyebrow" v="EDIÇÃO 2027" l="Edição 2027 — selo da seção" />
          </p>
          <h2 style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 'clamp(32px,4vw,50px)', letterSpacing: '-0.5px', lineHeight: 1, color: '#fff' }} data-animate>
            <ERich k="forum.edicao.titulo" l="Edição 2027 — título">
              Cambridge, Massachusetts. <span style={{ color: '#d2e718' }}>O próximo capítulo começa aqui.</span>
            </ERich>
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 mb-14">
          <div className="relative rounded-[20px] overflow-hidden h-[320px] lg:h-auto" data-animate>
            <img src={imgSrc} alt="Cambridge / Harvard Square" className="absolute inset-0 w-full h-full object-cover" {...imgProps} />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(6,9,25,0.7), transparent 60%)' }} />
            <BgEditChip
              k="forum.edicao.img" v="/images/forum-hero-mit.webp" l="Edição 2027 — foto"
              spec={{ w: 1400, h: 1050, shape: 'paisagem', note: 'Foto com overlay escuro na base.' }}
              style={{ bottom: 16, right: 16 }}
            />
          </div>
          <div data-animate>
            <p className="mb-2" style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 11, letterSpacing: '2px', textTransform: 'uppercase', color: '#d2e718' }}>
              <ET k="forum.edicao.subtitulo.selo" v="WAIF 2027 · Primeira edição" l="Edição 2027 — selo de apoio" />
            </p>
            <h3 className="mb-4" style={{ fontFamily: 'Luxenta', fontWeight: 600, fontSize: 24, lineHeight: 1.1, color: '#fff' }}>
              <ERich k="forum.edicao.subtitulo" l="Edição 2027 — subtítulo">Harvard Square, Cambridge, MA</ERich>
            </h3>
            <p className="mb-6" style={{ fontFamily: 'Inter', fontSize: 15, lineHeight: '25px', color: '#d6d6d6' }}>
              <ERich k="forum.edicao.paragrafo" l="Edição 2027 — parágrafo">
                A primeira edição acontecerá em Harvard Square — o metro quadrado de inovação mais disputado das Américas, no entorno de Harvard e MIT, onde o HUB PAN tem sua sede global.
              </ERich>
            </p>
            <ul className="space-y-2 mb-6">
              {EDICAO_ITENS.map((it, i) => (
                <li key={it} className="flex items-start gap-3">
                  <Check size={15} strokeWidth={2.5} color="#d2e718" className="mt-[3px] shrink-0" />
                  <span style={{ fontFamily: 'Inter', fontSize: 13.5, lineHeight: '22px', color: 'rgba(255,255,255,0.85)' }}>
                    <ET k={`forum.edicao.item.${i}`} v={it} l={`Edição 2027 — item da lista ${i + 1}`} />
                  </span>
                </li>
              ))}
            </ul>
            <p style={{ fontFamily: 'Inter', fontSize: 12.5, color: 'rgba(255,255,255,0.6)' }}>
              <ERich k="forum.edicao.rodape" l="Edição 2027 — nota de rodapé">
                <b style={{ color: '#d2e718' }}>Parceria institucional</b> · MIPAD ONU + Expo Boston como preparatória do WAIF
              </ERich>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {CONTEXTO.map((c) => (
            <div key={c.id} className="rounded-[20px] p-6" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }} data-animate>
              <p className="mb-2" style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 10.5, letterSpacing: '1.6px', textTransform: 'uppercase', color: '#d2e718' }}>
                <ET k={`forum.edicao.contexto.${c.id}.tag`} v={c.tag} l={`Contexto "${c.tag}" — etiqueta`} />
              </p>
              <h4 className="mb-2" style={{ fontFamily: 'Luxenta', fontWeight: 600, fontSize: 17, lineHeight: 1.2, color: '#fff' }}>
                <ERich k={`forum.edicao.contexto.${c.id}.titulo`} l={`Contexto "${c.tag}" — título`}>{c.titulo}</ERich>
              </h4>
              <p style={{ fontFamily: 'Inter', fontSize: 13, lineHeight: '21px', color: 'rgba(255,255,255,0.7)' }}>
                <ERich k={`forum.edicao.contexto.${c.id}.desc`} l={`Contexto "${c.tag}" — descrição`}>{c.desc}</ERich>
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* Patrocínio — 3 níveis */
function NivelCard({ n }: { n: (typeof NIVEIS)[number] }) {
  const tilt = useTilt<HTMLDivElement>(4, 6);
  const [bg, bgProps] = useEditColor(`forum.nivel.${n.id}.bg`, n.destaque ? '#152852' : '#ffffff', `Nível "${n.nome}" — fundo do card`);
  return (
    <div
      ref={tilt}
      className="relative flex flex-col rounded-[20px] p-8"
      style={{ background: bg, border: n.destaque ? undefined : '1px solid #ecedf0' }}
      {...bgProps}
      data-animate
    >
      {n.destaque && (
        <span className="absolute -top-3 left-8 rounded-full px-4 py-1" style={{ background: '#d2e718', fontFamily: 'Inter', fontWeight: 600, fontSize: 11, letterSpacing: '1px', textTransform: 'uppercase', color: '#152852' }}>
          <ET k={`forum.nivel.${n.id}.tagLabel`} v={n.tagLabel ?? ''} l={`Nível "${n.nome}" — selo de destaque`} />
        </span>
      )}
      <p className="mt-2 mb-1" style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 12, letterSpacing: '1.6px', textTransform: 'uppercase', color: n.destaque ? 'rgba(255,255,255,0.55)' : '#a7a4a4' }}>
        <ET k={`forum.nivel.${n.id}.nivel`} v={n.nivel} l={`Nível "${n.nome}" — rótulo do nível`} />
      </p>
      <h3 className="mb-3" style={{ fontFamily: 'Luxenta', fontWeight: 600, fontSize: 28, lineHeight: 1.05, color: n.destaque ? '#fff' : '#152852' }}>
        <ERich k={`forum.nivel.${n.id}.nome`} l={`Nível "${n.nome}" — nome`}>{n.nome}</ERich>
      </h3>
      <p className="mb-7" style={{ fontFamily: 'Inter', fontSize: 14, lineHeight: '23px', color: n.destaque ? 'rgba(255,255,255,0.78)' : '#797979' }}>
        <ERich k={`forum.nivel.${n.id}.desc`} l={`Nível "${n.nome}" — descrição`}>{n.desc}</ERich>
      </p>
      <ul className="space-y-3 mb-8 flex-1">
        {n.inclui.map((it, i) => (
          <li key={it} className="flex items-start gap-3">
            <Check size={16} strokeWidth={2.5} color={n.destaque ? '#d2e718' : '#2d4ebf'} className="mt-[3px] shrink-0" />
            <span style={{ fontFamily: 'Inter', fontSize: 14, lineHeight: '22px', color: n.destaque ? 'rgba(255,255,255,0.9)' : '#152852' }}>
              <ET k={`forum.nivel.${n.id}.item.${i}`} v={it} l={`Nível "${n.nome}" — benefício ${i + 1}`} />
            </span>
          </li>
        ))}
      </ul>
      <HubButton size="md" variant={n.destaque ? 'lime' : 'outline-dark'} className="w-full justify-center" iconKey={`forum.nivel.${n.id}.btn.icone`} iconLabel={`Nível "${n.nome}" — botão, ícone`} styleKey={`forum.nivel.${n.id}.btn`} styleLabel={`Nível "${n.nome}" — botão`}>
        <ET k={`forum.nivel.${n.id}.btn`} v={`Solicitar proposta${n.destaque ? ' Ouro' : ''}`} l={`Nível "${n.nome}" — botão`} />
      </HubButton>
    </div>
  );
}

function SecPatrocinio() {
  const ref = useReveal<HTMLElement>();
  const [bg, bgProps] = useEditColor('forum.patrocinio.bg', '#ffffff', 'Fundo da seção Patrocínio');
  return (
    <section ref={ref} className="py-24 lg:py-32 gutter" {...bgProps} style={{ background: bg }}>
      <div className="mb-14 max-w-[720px]">
        <p className="eyebrow text-muted mb-6" data-animate>
          <ET k="forum.patrocinio.eyebrow" v="OPORTUNIDADES DE PATROCÍNIO" l="Patrocínio — selo da seção" />
        </p>
        <h2 style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 'clamp(32px,4vw,50px)', letterSpacing: '-0.5px', lineHeight: 1, color: '#152852' }} data-animate>
          <ERich k="forum.patrocinio.titulo" l="Patrocínio — título">Sua marca no ecossistema de IA mais estratégico das Américas.</ERich>
        </h2>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-4">
        {NIVEIS.map((n) => <NivelCard key={n.id} n={n} />)}
      </div>
    </section>
  );
}

/* Formulários duplos — empresas / palestrantes */
function SecFormularios() {
  const ref = useReveal<HTMLElement>();
  const [bg, bgProps] = useEditColor('forum.formularios.bg', '#f5f5f5', 'Fundo da seção Formulários');
  return (
    <section id="forum-form" ref={ref} className="py-24 lg:py-32 gutter" {...bgProps} style={{ background: bg }}>
      <div className="grid lg:grid-cols-2 gap-6">
        <form className="rounded-[20px] bg-white p-8 lg:p-9" style={{ border: '1px solid #ecedf0' }} onSubmit={(e) => e.preventDefault()}>
          <p className="mb-2" style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 11, letterSpacing: '2px', textTransform: 'uppercase', color: '#2d4ebf' }}>
            <ET k="forum.form.empresas.eyebrow" v="PARA EMPRESAS E MARCAS" l="Formulário Empresas — selo" />
          </p>
          <h3 className="mb-6" style={{ fontFamily: 'Luxenta', fontWeight: 600, fontSize: 24, lineHeight: 1.1, color: '#152852' }}>
            <ERich k="forum.form.empresas.titulo" l="Formulário Empresas — título">Patrocinar o WAIF 2027</ERich>
          </h3>
          <p className="mb-7" style={{ fontFamily: 'Inter', fontSize: 14.5, lineHeight: '23px', color: '#797979' }}>
            <ERich k="forum.form.empresas.desc" l="Formulário Empresas — descrição">Sua marca ao lado dos principais players globais de inteligência artificial em Cambridge.</ERich>
          </p>
          <div className="space-y-4">
            <input placeholder="Nome completo" style={INPUT_STYLE} />
            <div className="grid sm:grid-cols-2 gap-4">
              <input placeholder="Empresa" style={INPUT_STYLE} />
              <input placeholder="Cargo" style={INPUT_STYLE} />
            </div>
            <input placeholder="E-mail corporativo" style={INPUT_STYLE} />
            <select defaultValue="" style={{ ...INPUT_STYLE, color: '#152852' }}>
              <option value="" disabled>Nível de patrocínio</option>
              <option>Bronze — visibilidade e presença</option><option>Prata — ativações e conteúdo</option><option>Ouro — parceria estratégica</option><option>Personalizado — quero ser o patrocinador título</option>
            </select>
            <select defaultValue="" style={{ ...INPUT_STYLE, color: '#152852' }}>
              <option value="" disabled>Objetivo principal</option>
              {OBJETIVOS.map((o) => <option key={o}>{o}</option>)}
            </select>
            <textarea placeholder="Mensagem" rows={3} style={{ ...INPUT_STYLE, height: 'auto', padding: '12px 16px', resize: 'vertical' }} />
            <HubButton size="md" variant="blue" className="w-full justify-center" iconKey="forum.form.empresas.btn.icone" iconLabel="Formulário Empresas — botão, ícone" styleKey="forum.form.empresas.btn" styleLabel="Formulário Empresas — botão" noLink>
              <ET k="forum.form.empresas.btn" v="Solicitar proposta de patrocínio" l="Formulário Empresas — botão" />
            </HubButton>
          </div>
        </form>

        <form className="rounded-[20px] bg-white p-8 lg:p-9" style={{ border: '1px solid #ecedf0' }} onSubmit={(e) => e.preventDefault()}>
          <p className="mb-2" style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 11, letterSpacing: '2px', textTransform: 'uppercase', color: '#2d4ebf' }}>
            <ET k="forum.form.palestrantes.eyebrow" v="PARA PALESTRANTES E PARTICIPANTES" l="Formulário Palestrantes — selo" />
          </p>
          <h3 className="mb-6" style={{ fontFamily: 'Luxenta', fontWeight: 600, fontSize: 24, lineHeight: 1.1, color: '#152852' }}>
            <ERich k="forum.form.palestrantes.titulo" l="Formulário Palestrantes — título">Manifestar interesse no WAIF</ERich>
          </h3>
          <p className="mb-7" style={{ fontFamily: 'Inter', fontSize: 14.5, lineHeight: '23px', color: '#797979' }}>
            <ERich k="forum.form.palestrantes.desc" l="Formulário Palestrantes — descrição">Inscrições abertas para 2027. Vagas limitadas com processo de seleção por perfil.</ERich>
          </p>
          <div className="space-y-4">
            <input placeholder="Nome completo" style={INPUT_STYLE} />
            <input placeholder="E-mail" style={INPUT_STYLE} />
            <input placeholder="Organização e cargo" style={INPUT_STYLE} />
            <select defaultValue="" style={{ ...INPUT_STYLE, color: '#152852' }}>
              <option value="" disabled>Como deseja participar?</option>
              {PARTICIPACAO.map((p) => <option key={p}>{p}</option>)}
            </select>
            <select defaultValue="" style={{ ...INPUT_STYLE, color: '#152852' }}>
              <option value="" disabled>Área de expertise em IA</option>
              {EXPERTISE.map((e) => <option key={e}>{e}</option>)}
            </select>
            <textarea placeholder="Por que você deve estar no WAIF 2027?" rows={3} style={{ ...INPUT_STYLE, height: 'auto', padding: '12px 16px', resize: 'vertical' }} />
            <HubButton size="md" variant="lime" className="w-full justify-center" iconKey="forum.form.palestrantes.btn.icone" iconLabel="Formulário Palestrantes — botão, ícone" styleKey="forum.form.palestrantes.btn" styleLabel="Formulário Palestrantes — botão" noLink>
              <ET k="forum.form.palestrantes.btn" v="Manifestar interesse" l="Formulário Palestrantes — botão" />
            </HubButton>
          </div>
        </form>
      </div>
    </section>
  );
}

function SecEcossistema() {
  const [bg, bgProps] = useEditColor('forum.ecossistema.bg', '#ffffff', 'Fundo da seção Também no Ecossistema');
  return (
    <section className="py-16 gutter" {...bgProps} style={{ background: bg }}>
      <p className="mb-6" style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 12, letterSpacing: '1.6px', textTransform: 'uppercase', color: '#a7a4a4' }}>
        <ET k="forum.ecossistema.eyebrow" v="TAMBÉM NO ECOSSISTEMA HUB PAN" l="Também no Ecossistema — selo" />
      </p>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {ECOSSISTEMA.map((e) => {
          const c = ECO_COLORS[e.color];
          return <EcoCard key={e.id} e={e} c={c} />;
        })}
      </div>
    </section>
  );
}

function EcoCard({ e, c }: { e: (typeof ECOSSISTEMA)[number]; c: { bg: string; text: string; sub: string } }) {
  const [bg, bgProps] = useEditColor(`forum.ecossistema.${e.id}.bg`, c.bg, `Ecossistema "${e.tag}" — fundo do card`);
  return (
    <Link to={e.to} className="group rounded-[16px] p-5 flex flex-col justify-between h-[110px] transition-transform duration-300 hover:-translate-y-1" style={{ background: bg }} {...bgProps}>
      <span style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 12, letterSpacing: '1px', color: c.sub }}>
        <ET k={`forum.ecossistema.${e.id}.tag`} v={e.tag} l={`Ecossistema "${e.tag}" — etiqueta`} />
      </span>
      <span style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 13.5, lineHeight: '19px', color: c.text }}>
        <ET k={`forum.ecossistema.${e.id}.texto`} v={e.t} l={`Ecossistema "${e.tag}" — texto`} multiline />
      </span>
    </Link>
  );
}

function SecFAQ() {
  const ref = useReveal<HTMLElement>();
  const [bg, bgProps] = useEditColor('forum.faq.bg', '#ffffff', 'Fundo da seção FAQ');
  return (
    <section ref={ref} className="py-24 lg:py-32 gutter" {...bgProps} style={{ background: bg }}>
      <div className="grid lg:grid-cols-[1fr_1.4fr] gap-12">
        <div>
          <p className="eyebrow text-muted mb-6" data-animate>
            <ET k="forum.faq.eyebrow" v="PERGUNTAS FREQUENTES" l="FAQ — selo da seção" />
          </p>
          <h2 className="mb-4" style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 'clamp(32px,4vw,50px)', letterSpacing: '-0.5px', lineHeight: 1, color: '#152852' }} data-animate>
            <ERich k="forum.faq.titulo" l="FAQ — título">O que empresas e parceiros mais perguntam sobre o WAIF.</ERich>
          </h2>
          <p style={{ fontFamily: 'Inter', fontSize: 16, lineHeight: '27px', color: '#797979' }} data-animate>
            <ERich k="forum.faq.desc" l="FAQ — descrição">Respostas diretas para quem quer patrocinar, participar ou entender o posicionamento do Fórum Mundial de IA.</ERich>
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

export default function ForumMundialIA() {
  const [heroImg] = useEditImage(
    'forum.hero.img', '/images/forum-hero-mit.webp', 'Hero — imagem de fundo',
    { w: 2400, h: 1500, shape: 'paisagem', note: 'Imagem de fundo do hero — cobre toda a seção, com overlay escuro à esquerda.' }
  );
  const [stripBg, stripBgProps] = useEditColor('forum.hero.strip.bg', STRIP_THEMES.lime.bg, 'Hero — fundo da faixa de números');
  return (
    <>
      <div style={{ position: 'relative' }}>
        <Hero80
          img={heroImg}
          imgAlt="MIT Museum — Cambridge, MA"
          eyebrow={<ET k="forum.hero.eyebrow" v="ATIVO PROPRIETÁRIO HUB PAN · AUTORIDADE GLOBAL · CAMBRIDGE 2027" l="Hero — eyebrow" />}
          title={<ERich k="forum.hero.titulo" l="Hero — título">Fórum Mundial de Inteligência Artificial</ERich>}
          sub={
            <ERich k="forum.hero.sub" l="Hero — texto de apoio" baseW={660}>
              O maior ativo estratégico do HUB PAN. O WAIF reúne grandes players globais de IA, policy makers, pesquisadores, governos e investidores em Cambridge, Massachusetts — o epicentro mundial de inovação — para uma conversa que nenhum outro fórum no Brasil consegue ter.
            </ERich>
          }
          actions={<>
            <HubButton size="lg" variant="lime" onClick={() => ScrollSmoother.get()?.scrollTo('#forum-form', true)} iconKey="forum.hero.btn.patrocinar.icone" iconLabel="Hero — botão Patrocinar o Fórum, ícone" styleKey="forum.hero.btn.patrocinar" styleLabel="Hero — botão Patrocinar o Fórum">
              <ET k="forum.hero.btn.patrocinar" v="Patrocinar o Fórum" l="Hero — botão Patrocinar o Fórum" />
            </HubButton>
            <HubButton size="lg" variant="blue" onClick={() => ScrollSmoother.get()?.scrollTo('#forum-form', true)} iconKey="forum.hero.btn.sobre.icone" iconLabel="Hero — botão Sobre a 1ª edição, ícone" styleKey="forum.hero.btn.sobre" styleLabel="Hero — botão Sobre a 1ª edição">
              <ET k="forum.hero.btn.sobre" v="Sobre a 1ª edição" l="Hero — botão Sobre a 1ª edição" />
            </HubButton>
            <HubButton size="lg" variant="outline-light" onClick={() => ScrollSmoother.get()?.scrollTo('#forum-form', true)} iconKey="forum.hero.btn.manifestar.icone" iconLabel="Hero — botão Manifestar interesse, ícone" styleKey="forum.hero.btn.manifestar" styleLabel="Hero — botão Manifestar interesse">
              <ET k="forum.hero.btn.manifestar" v="Manifestar interesse" l="Hero — botão Manifestar interesse" />
            </HubButton>
          </>}
          stats={STATS}
          strip={{ ...STRIP_THEMES.lime, bg: stripBg }}
          stripProps={stripBgProps}
        />
        <BgEditChip
          k="forum.hero.img" v="/images/forum-hero-mit.webp" l="Hero — imagem de fundo"
          spec={{ w: 2400, h: 1500, shape: 'paisagem', note: 'Imagem de fundo do hero — cobre toda a seção, com overlay escuro à esquerda.' }}
          style={{ bottom: 'calc(20vh + 24px)', right: 24 }}
        />
      </div>
      <SecDiferencial />
      <SecPilares />
      <SecEdicao />
      <SecPatrocinio />
      <SecFormularios />
      <SecEcossistema />
      <SecFAQ />
    </>
  );
}
