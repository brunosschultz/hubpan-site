import { useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import Hero80, { STRIP_THEMES } from '../../components/Hero80';
import HubButton from '../../components/HubButton';
import { useReveal } from '../../components/useReveal';
import { useTilt } from '../../components/useTilt';
import { EImg, ERich, ET, useEditColor } from '../../editor/fields';

gsap.registerPlugin(ScrollTrigger);

/* ═══════════ Dados — extraídos do wireframe oficial (page-insights) ═══════════ */
/* Sem bloco de stats no wireframe original — números reais citados no próprio
   conteúdo da página (publicações, tempo de leitura, frequência da newsletter). */
const STATS = [
  { value: 24, label: <ET k="insights.hero.stat1.label" v="Publicações no acervo" l="Insights — hero stat 1 (rótulo)" /> },
  { value: 6, label: <ET k="insights.hero.stat2.label" v="Categorias de conteúdo" l="Insights — hero stat 2 (rótulo)" /> },
  { value: 'MG', label: <ET k="insights.hero.stat3.label" v="Observatório em campo" l="Insights — hero stat 3 (rótulo)" />, accent: true },
  { value: 12, suffix: 'min', label: <ET k="insights.hero.stat4.label" v="Leitura · pesquisa em destaque" l="Insights — hero stat 4 (rótulo)" /> },
  { value: 'Quinzenal', label: <ET k="insights.hero.stat5.label" v="Frequência da newsletter" l="Insights — hero stat 5 (rótulo)" /> },
];

const FILTROS = [
  { id: 'todos', v: 'Todos' },
  { id: 'observatorio-ia', v: 'Observatório · IA' },
  { id: 'white-papers', v: 'White Papers' },
  { id: 'artigos', v: 'Artigos' },
  { id: 'entrevistas', v: 'Entrevistas' },
  { id: 'relatorios', v: 'Relatórios' },
  { id: 'pesquisas', v: 'Pesquisas' },
];

const DESTAQUE = {
  cat: 'Observatório · IA Governamental',
  titulo: 'Mapeamento do uso de IA na administração pública em Minas Gerais',
  desc: 'Pesquisa inaugural do Observatório HUB PAN — dados inéditos sobre adoção de inteligência artificial no setor público. Primeiro levantamento desse tipo no estado, com comparativo futuro com a região metropolitana de Boston.',
  meta: 'Jun 2026 · Observatório HUB PAN · 12 min de leitura',
  img: 's9-insight-1',
};

const PUBLICACOES = [
  { id: 'ods', tipo: 'White Paper', data: 'Mai 2026', titulo: 'Pan-Americanismo e inovação de impacto: caminhos para os ODS', desc: 'Análise dos principais mecanismos de cooperação entre Américas e África no contexto da Agenda 2030.', meta: '8 min de leitura', img: 's9-insight-2' },
  { id: 'municipios', tipo: 'Artigo', data: 'Mai 2026', titulo: 'IA para governos municipais: desafios de acesso e formação no Brasil', desc: 'Por que a maioria dos municípios brasileiros ainda não acessa soluções de IA — e como o GovIA resolve isso.', meta: '6 min de leitura', img: 's9-insight-3' },
  { id: 'onu', tipo: 'Entrevista', data: 'Abr 2026', titulo: 'Inovação de impacto e os ODS: uma conversa com lideranças da ONU', desc: 'Como organismos internacionais enxergam o papel de ecossistemas como o HUB PAN na agenda global.', meta: '10 min de leitura', img: 'inst-nyc-onu' },
  { id: 'forum-relatorio', tipo: 'Relatório', data: 'Abr 2026', titulo: 'Fórum Pan-Americano da Inovação: relatório de impacto 2025', desc: '15 edições, 4 cidades, centenas de projetos. Os números e histórias que definem o ecossistema.', meta: 'Baixar PDF', img: 's6-numero-1' },
  { id: 'educacao-inclusiva', tipo: 'Pesquisa', data: 'Mar 2026', titulo: 'Educação inclusiva e tecnologias assistivas: cenário após a nova legislação', desc: 'Levantamento do impacto da nova lei de educação inclusiva nos municípios brasileiros e oportunidades para o HUB PAN Academy.', meta: '14 min de leitura', img: 's5-timeline-2' },
  { id: 'cambridge', tipo: 'Artigo', data: 'Mar 2026', titulo: 'O que Cambridge ensina sobre ecossistemas de inovação ao mundo', desc: 'Uma leitura do metro quadrado de inovação mais disputado das Américas e o que o HUB PAN aprendeu estando lá.', meta: '7 min de leitura', img: 'inst-boston-mit' },
];

const OBSERVATORIOS = [
  { id: 'ia', status: 'Em andamento', nome: 'Observatório de IA', desc: 'Uso de IA na administração pública. Iniciando por Minas Gerais, com comparativo futuro com Boston area.', tags: [{ v: 'MG', l: 'Em campo' }, { v: 'BOS', l: 'Previsto 2027' }], ativo: true },
  { id: 'esg', status: 'Em breve', nome: 'Observatório ESG', desc: 'Monitoramento de iniciativas ESG conectadas aos ODS em empresas e governos parceiros do ecossistema.', ativo: false },
  { id: 'inovacao-pan-americana', status: 'Em breve', nome: 'Observatório de Inovação Pan-Americana', desc: 'Mapeamento de ecossistemas de inovação nas Américas e África com foco em cooperação e transferência de conhecimento.', ativo: false },
];

/* ═══════════ Seções ═══════════ */

function SecFiltros() {
  const [ativo, setAtivo] = useState('Todos');
  const [bg, bgProps] = useEditColor('insights.filtros.bg', '#ffffff', 'Filtros — fundo da seção');
  return (
    <section className="pt-14 pb-4 gutter" {...bgProps} style={{ background: bg }}>
      <p className="mb-4" style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 12, letterSpacing: '1.6px', textTransform: 'uppercase', color: '#a7a4a4' }}>
        <ET k="insights.filtros.label" v="Filtrar por" l="Insights — rótulo dos filtros" />
      </p>
      <div className="flex flex-wrap gap-3">
        {FILTROS.map((f) => (
          <button
            key={f.id}
            onClick={() => setAtivo(f.v)}
            className="rounded-full px-5 py-2 transition-colors"
            style={{
              fontFamily: 'Inter', fontWeight: 500, fontSize: 13.5,
              background: ativo === f.v ? '#152852' : '#f5f5f5',
              color: ativo === f.v ? '#fff' : '#797979',
            }}
          >
            <ET k={`insights.filtros.${f.id}`} v={f.v} l={`Insights — filtro "${f.v}"`} />
          </button>
        ))}
      </div>
    </section>
  );
}

function SecDestaque() {
  const ref = useReveal<HTMLElement>();
  const tilt = useTilt<HTMLDivElement>(3, 4);
  const [bg, bgProps] = useEditColor('insights.destaque.bg', '#ffffff', 'Destaque — fundo da seção');
  const [cardBg, cardBgProps] = useEditColor('insights.destaque.cardBg', '#ebebeb', 'Destaque — fundo do card', 'Card de destaque');
  return (
    <section ref={ref} className="pt-14 pb-24 lg:pb-32 gutter" {...bgProps} style={{ background: bg }}>
      <p className="eyebrow text-muted mb-6" data-animate>
        <ET k="insights.destaque.eyebrow" v="DESTAQUE" l="Insights — selo da seção Destaque" />
      </p>
      <div ref={tilt} className="grid lg:grid-cols-2 rounded-[20px] overflow-hidden" {...cardBgProps} style={{ background: cardBg }} data-animate>
        <div className="overflow-hidden h-[280px] lg:h-auto lg:min-h-[420px]">
          <EImg
            k="insights.destaque.img" v={`/images/${DESTAQUE.img}.webp`}
            l="Insights — foto do destaque"
            spec={{ w: 1000, h: 800, shape: 'paisagem' }}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col justify-center p-8 lg:p-12">
          <p className="mb-4" style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 11, letterSpacing: '2.2px', textTransform: 'uppercase', color: '#2d4ebf' }}>
            <ET k="insights.destaque.cat" v={DESTAQUE.cat} l="Insights — categoria do destaque" />
          </p>
          <h2 className="mb-4" style={{ fontFamily: 'Luxenta', fontWeight: 600, fontSize: 'clamp(24px,2.2vw,34px)', lineHeight: 1.1, color: '#152852' }}>
            <ERich k="insights.destaque.titulo" l="Insights — título do destaque">{DESTAQUE.titulo}</ERich>
          </h2>
          <p className="mb-6" style={{ fontFamily: 'Inter', fontSize: 15.5, lineHeight: '26px', color: '#797979' }}>
            <ERich k="insights.destaque.desc" l="Insights — descrição do destaque">{DESTAQUE.desc}</ERich>
          </p>
          <p className="mb-8" style={{ fontFamily: 'Inter', fontSize: 13, color: '#a7a4a4' }}>
            <ET k="insights.destaque.meta" v={DESTAQUE.meta} l="Insights — meta do destaque" />
          </p>
          <div><HubButton size="md" variant="blue"><ET k="insights.destaque.btn" v="Ler pesquisa completa" l="Insights — botão do destaque" /></HubButton></div>
        </div>
      </div>
    </section>
  );
}

function SecPublicacoes() {
  const ref = useReveal<HTMLElement>();
  const [bg, bgProps] = useEditColor('insights.publicacoes.bg', '#f5f5f5', 'Publicações — fundo da seção');
  return (
    <section id="insights-artigos" ref={ref} className="py-24 lg:py-32 gutter" {...bgProps} style={{ background: bg }}>
      <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="eyebrow text-muted mb-6" data-animate>
            <ET k="insights.publicacoes.eyebrow" v="PUBLICAÇÕES RECENTES" l="Insights — selo da seção Publicações" />
          </p>
          <h2 style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 'clamp(32px,4vw,50px)', letterSpacing: '-0.5px', lineHeight: 1, color: '#152852' }} data-animate>
            <ERich k="insights.publicacoes.titulo" l="Insights — título da seção Publicações">24 publicações.</ERich>
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {PUBLICACOES.map((c) => (
          <div key={c.id} className="flex flex-col cursor-pointer group bg-white" style={{ borderRadius: 20, padding: 21, minHeight: 420, border: '1px solid #ecedf0' }} data-animate>
            <div className="overflow-hidden mb-4" style={{ borderRadius: 20, height: 200 }}>
              <EImg
                k={`insights.card.${c.id}.img`} v={`/images/${c.img}.webp`}
                l={`Insights — foto do card "${c.titulo.slice(0, 30)}…"`}
                spec={{ w: 800, h: 560, shape: 'paisagem' }}
                alt=""
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="flex items-center justify-between mb-3">
              <span style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 11, letterSpacing: '1.4px', textTransform: 'uppercase', color: '#2d4ebf' }}>
                <ET k={`insights.card.${c.id}.tipo`} v={c.tipo} l={`Insights — categoria do card "${c.titulo.slice(0, 30)}…"`} />
              </span>
              <span style={{ fontFamily: 'Inter', fontSize: 12, color: '#a7a4a4' }}>
                <ET k={`insights.card.${c.id}.data`} v={c.data} l={`Insights — data do card "${c.titulo.slice(0, 30)}…"`} />
              </span>
            </div>
            <p style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 18, lineHeight: 1.3, color: '#152852', marginBottom: 10 }}>
              <ERich k={`insights.card.${c.id}.titulo`} l={`Insights — título do card "${c.titulo.slice(0, 30)}…"`}>{c.titulo}</ERich>
            </p>
            <p style={{ fontFamily: 'Inter', fontSize: 14, lineHeight: '22px', color: '#a7a4a4', marginBottom: 14 }}>
              <ERich k={`insights.card.${c.id}.desc`} l={`Insights — descrição do card "${c.titulo.slice(0, 30)}…"`}>{c.desc}</ERich>
            </p>
            <p className="mt-auto pt-3 border-t" style={{ borderColor: '#ecedf0', fontFamily: 'Inter', fontWeight: 500, fontSize: 13, color: '#2d4ebf' }}>
              <ET k={`insights.card.${c.id}.meta`} v={c.meta} l={`Insights — meta do card "${c.titulo.slice(0, 30)}…"`} /> →
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ObservatorioCard({ o }: { o: (typeof OBSERVATORIOS)[number] }) {
  const tilt = useTilt<HTMLDivElement>(4, 6);
  return (
    <div
      ref={tilt}
      className="flex flex-col rounded-[20px] p-8"
      style={{ background: o.ativo ? '#152852' : '#fff', border: o.ativo ? undefined : '1px dashed #dcdcdc' }}
      data-animate
    >
      <span
        className="self-start rounded-full px-3 py-1 mb-5"
        style={{ background: o.ativo ? 'rgba(210,231,24,0.15)' : '#f5f5f5', fontFamily: 'Inter', fontWeight: 500, fontSize: 10.5, letterSpacing: '1.2px', textTransform: 'uppercase', color: o.ativo ? '#d2e718' : '#a7a4a4' }}
      >
        <ET k={`insights.observatorio.${o.id}.status`} v={o.status} l={`Insights — status do observatório "${o.nome}"`} />
      </span>
      <h3 className="mb-3" style={{ fontFamily: 'Luxenta', fontWeight: 600, fontSize: 22, lineHeight: 1.1, color: o.ativo ? '#fff' : '#152852' }}>
        <ERich k={`insights.observatorio.${o.id}.nome`} l={`Insights — nome do observatório "${o.nome}"`}>{o.nome}</ERich>
      </h3>
      <p className="mb-6" style={{ fontFamily: 'Inter', fontSize: 14, lineHeight: '23px', color: o.ativo ? 'rgba(255,255,255,0.78)' : '#797979' }}>
        <ERich k={`insights.observatorio.${o.id}.desc`} l={`Insights — descrição do observatório "${o.nome}"`}>{o.desc}</ERich>
      </p>
      {o.tags && (
        <div className="flex gap-3 mb-6">
          {o.tags.map((t) => (
            <span key={t.v} className="rounded-full px-3 py-1.5" style={{ background: 'rgba(255,255,255,0.08)', fontFamily: 'Inter', fontSize: 11.5, color: '#fff' }}>
              <b style={{ color: '#d2e718' }}><ET k={`insights.observatorio.${o.id}.tag.${t.v}.v`} v={t.v} l={`Insights — sigla da tag "${t.v}" do observatório "${o.nome}"`} /></b>{' '}
              <ET k={`insights.observatorio.${o.id}.tag.${t.v}.l`} v={t.l} l={`Insights — legenda da tag "${t.v}" do observatório "${o.nome}"`} />
            </span>
          ))}
        </div>
      )}
      {o.ativo && <div className="mt-auto"><HubButton size="sm" variant="lime"><ET k={`insights.observatorio.${o.id}.btn`} v="Acessar dados" l={`Insights — botão do observatório "${o.nome}"`} /></HubButton></div>}
    </div>
  );
}

function SecObservatorios() {
  const ref = useReveal<HTMLElement>();
  const [bg, bgProps] = useEditColor('insights.observatorios.bg', '#ffffff', 'Observatórios — fundo da seção');
  return (
    <section ref={ref} className="py-24 lg:py-32 gutter" {...bgProps} style={{ background: bg }}>
      <div className="mb-14 max-w-[700px]">
        <p className="eyebrow text-muted mb-6" data-animate>
          <ET k="insights.observatorios.eyebrow" v="OBSERVATÓRIOS TEMÁTICOS" l="Insights — selo da seção Observatórios" />
        </p>
        <h2 className="mb-4" style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 'clamp(32px,4vw,50px)', letterSpacing: '-0.5px', lineHeight: 1, color: '#152852' }} data-animate>
          <ERich k="insights.observatorios.titulo" l="Insights — título da seção Observatórios">Dados que constroem autoridade.</ERich>
        </h2>
        <p style={{ fontFamily: 'Inter', fontSize: 16, lineHeight: '27px', color: '#797979' }} data-animate>
          <ERich k="insights.observatorios.desc" l="Insights — descrição da seção Observatórios">Monitoramento contínuo de temas estratégicos — com dashboards, relatórios e atualizações periódicas.</ERich>
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {OBSERVATORIOS.map((o) => <ObservatorioCard key={o.id} o={o} />)}
      </div>
    </section>
  );
}

/* ═══════════ Página ═══════════ */

export default function Insights() {
  return (
    <>
      <Hero80
        img="/images/insights-hero-globo.webp"
        imgAlt="Globo dourado na sede das Nações Unidas"
        eyebrow={<ET k="insights.hero.eyebrow" v="BLOG · OBSERVATÓRIOS · PESQUISAS · WHITE PAPERS" l="Insights — eyebrow do hero" />}
        title={<ERich k="insights.hero.titulo" l="Insights — título do hero">HUB PAN Insights</ERich>}
        sub={<ERich k="insights.hero.sub" l="Insights — descrição do hero" baseW={660}>A plataforma de inteligência e conteúdo do ecossistema. Observatórios temáticos, pesquisas, artigos, entrevistas, relatórios e white papers sobre inovação, IA, governança, educação e cooperação internacional.</ERich>}
        actions={<>
          <HubButton size="lg" variant="lime" onClick={() => ScrollSmoother.get()?.scrollTo('#insights-artigos', true)}><ET k="insights.hero.cta1" v="Ver todos os conteúdos" l="Insights — botão do hero (principal)" /></HubButton>
          <Link to="/#newsletter"><HubButton size="lg" variant="blue"><ET k="insights.hero.cta2" v="Assinar newsletter" l="Insights — botão do hero (secundário)" /></HubButton></Link>
        </>}
        stats={STATS}
        strip={STRIP_THEMES.light}
      />
      <SecFiltros />
      <SecDestaque />
      <SecPublicacoes />
      <SecObservatorios />
    </>
  );
}
