import { useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import Hero80, { STRIP_THEMES } from '../../components/Hero80';
import HubButton from '../../components/HubButton';
import { useReveal } from '../../components/useReveal';
import { useTilt } from '../../components/useTilt';

gsap.registerPlugin(ScrollTrigger);

/* ═══════════ Dados — extraídos do wireframe oficial (page-insights) ═══════════ */
/* Sem bloco de stats no wireframe original — números reais citados no próprio
   conteúdo da página (publicações, tempo de leitura, frequência da newsletter). */
const STATS = [
  { value: 24, label: 'Publicações no acervo' },
  { value: 6, label: 'Categorias de conteúdo' },
  { value: 'MG', label: 'Observatório em campo', accent: true },
  { value: 12, suffix: 'min', label: 'Leitura · pesquisa em destaque' },
  { value: 'Quinzenal', label: 'Frequência da newsletter' },
];

const FILTROS = ['Todos', 'Observatório · IA', 'White Papers', 'Artigos', 'Entrevistas', 'Relatórios', 'Pesquisas'];

const DESTAQUE = {
  cat: 'Observatório · IA Governamental',
  titulo: 'Mapeamento do uso de IA na administração pública em Minas Gerais',
  desc: 'Pesquisa inaugural do Observatório HUB PAN — dados inéditos sobre adoção de inteligência artificial no setor público. Primeiro levantamento desse tipo no estado, com comparativo futuro com a região metropolitana de Boston.',
  meta: 'Jun 2026 · Observatório HUB PAN · 12 min de leitura',
  img: 's9-insight-1',
};

const PUBLICACOES = [
  { tipo: 'White Paper', data: 'Mai 2026', titulo: 'Pan-Americanismo e inovação de impacto: caminhos para os ODS', desc: 'Análise dos principais mecanismos de cooperação entre Américas e África no contexto da Agenda 2030.', meta: '8 min de leitura', img: 's9-insight-2' },
  { tipo: 'Artigo', data: 'Mai 2026', titulo: 'IA para governos municipais: desafios de acesso e formação no Brasil', desc: 'Por que a maioria dos municípios brasileiros ainda não acessa soluções de IA — e como o GovIA resolve isso.', meta: '6 min de leitura', img: 's9-insight-3' },
  { tipo: 'Entrevista', data: 'Abr 2026', titulo: 'Inovação de impacto e os ODS: uma conversa com lideranças da ONU', desc: 'Como organismos internacionais enxergam o papel de ecossistemas como o HUB PAN na agenda global.', meta: '10 min de leitura', img: 'inst-nyc-onu' },
  { tipo: 'Relatório', data: 'Abr 2026', titulo: 'Fórum Pan-Americano da Inovação: relatório de impacto 2025', desc: '15 edições, 4 cidades, centenas de projetos. Os números e histórias que definem o ecossistema.', meta: 'Baixar PDF', img: 's6-numero-1' },
  { tipo: 'Pesquisa', data: 'Mar 2026', titulo: 'Educação inclusiva e tecnologias assistivas: cenário após a nova legislação', desc: 'Levantamento do impacto da nova lei de educação inclusiva nos municípios brasileiros e oportunidades para o HUB PAN Academy.', meta: '14 min de leitura', img: 's5-timeline-2' },
  { tipo: 'Artigo', data: 'Mar 2026', titulo: 'O que Cambridge ensina sobre ecossistemas de inovação ao mundo', desc: 'Uma leitura do metro quadrado de inovação mais disputado das Américas e o que o HUB PAN aprendeu estando lá.', meta: '7 min de leitura', img: 'inst-boston-mit' },
];

const OBSERVATORIOS = [
  { status: 'Em andamento', nome: 'Observatório de IA', desc: 'Uso de IA na administração pública. Iniciando por Minas Gerais, com comparativo futuro com Boston area.', tags: [{ v: 'MG', l: 'Em campo' }, { v: 'BOS', l: 'Previsto 2027' }], ativo: true },
  { status: 'Em breve', nome: 'Observatório ESG', desc: 'Monitoramento de iniciativas ESG conectadas aos ODS em empresas e governos parceiros do ecossistema.', ativo: false },
  { status: 'Em breve', nome: 'Observatório de Inovação Pan-Americana', desc: 'Mapeamento de ecossistemas de inovação nas Américas e África com foco em cooperação e transferência de conhecimento.', ativo: false },
];

/* ═══════════ Seções ═══════════ */

function SecFiltros() {
  const [ativo, setAtivo] = useState('Todos');
  return (
    <section className="pt-14 pb-4 gutter bg-white">
      <p className="mb-4" style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 12, letterSpacing: '1.6px', textTransform: 'uppercase', color: '#a7a4a4' }}>Filtrar por</p>
      <div className="flex flex-wrap gap-3">
        {FILTROS.map((f) => (
          <button
            key={f}
            onClick={() => setAtivo(f)}
            className="rounded-full px-5 py-2 transition-colors"
            style={{
              fontFamily: 'Inter', fontWeight: 500, fontSize: 13.5,
              background: ativo === f ? '#152852' : '#f5f5f5',
              color: ativo === f ? '#fff' : '#797979',
            }}
          >
            {f}
          </button>
        ))}
      </div>
    </section>
  );
}

function SecDestaque() {
  const ref = useReveal<HTMLElement>();
  const tilt = useTilt<HTMLDivElement>(3, 4);
  return (
    <section ref={ref} className="pt-14 pb-24 lg:pb-32 gutter bg-white">
      <p className="eyebrow text-muted mb-6" data-animate>DESTAQUE</p>
      <div ref={tilt} className="grid lg:grid-cols-2 rounded-[20px] overflow-hidden" style={{ background: '#ebebeb' }} data-animate>
        <div className="overflow-hidden h-[280px] lg:h-auto lg:min-h-[420px]">
          <img src={`/images/${DESTAQUE.img}.webp`} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="flex flex-col justify-center p-8 lg:p-12">
          <p className="mb-4" style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 11, letterSpacing: '2.2px', textTransform: 'uppercase', color: '#2d4ebf' }}>{DESTAQUE.cat}</p>
          <h2 className="mb-4" style={{ fontFamily: 'Luxenta', fontWeight: 600, fontSize: 'clamp(24px,2.2vw,34px)', lineHeight: 1.1, color: '#152852' }}>{DESTAQUE.titulo}</h2>
          <p className="mb-6" style={{ fontFamily: 'Inter', fontSize: 15.5, lineHeight: '26px', color: '#797979' }}>{DESTAQUE.desc}</p>
          <p className="mb-8" style={{ fontFamily: 'Inter', fontSize: 13, color: '#a7a4a4' }}>{DESTAQUE.meta}</p>
          <div><HubButton size="md" variant="blue">Ler pesquisa completa</HubButton></div>
        </div>
      </div>
    </section>
  );
}

function SecPublicacoes() {
  const ref = useReveal<HTMLElement>();
  return (
    <section id="insights-artigos" ref={ref} className="py-24 lg:py-32 gutter" style={{ background: '#f5f5f5' }}>
      <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="eyebrow text-muted mb-6" data-animate>PUBLICAÇÕES RECENTES</p>
          <h2 style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 'clamp(32px,4vw,50px)', letterSpacing: '-0.5px', lineHeight: 1, color: '#152852' }} data-animate>
            24 publicações.
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {PUBLICACOES.map((c) => (
          <div key={c.titulo} className="flex flex-col cursor-pointer group bg-white" style={{ borderRadius: 20, padding: 21, minHeight: 420, border: '1px solid #ecedf0' }} data-animate>
            <div className="overflow-hidden mb-4" style={{ borderRadius: 20, height: 200 }}>
              <img src={`/images/${c.img}.webp`} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>
            <div className="flex items-center justify-between mb-3">
              <span style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 11, letterSpacing: '1.4px', textTransform: 'uppercase', color: '#2d4ebf' }}>{c.tipo}</span>
              <span style={{ fontFamily: 'Inter', fontSize: 12, color: '#a7a4a4' }}>{c.data}</span>
            </div>
            <p style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 18, lineHeight: 1.3, color: '#152852', marginBottom: 10 }}>{c.titulo}</p>
            <p style={{ fontFamily: 'Inter', fontSize: 14, lineHeight: '22px', color: '#a7a4a4', marginBottom: 14 }}>{c.desc}</p>
            <p className="mt-auto pt-3 border-t" style={{ borderColor: '#ecedf0', fontFamily: 'Inter', fontWeight: 500, fontSize: 13, color: '#2d4ebf' }}>{c.meta} →</p>
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
        {o.status}
      </span>
      <h3 className="mb-3" style={{ fontFamily: 'Luxenta', fontWeight: 600, fontSize: 22, lineHeight: 1.1, color: o.ativo ? '#fff' : '#152852' }}>{o.nome}</h3>
      <p className="mb-6" style={{ fontFamily: 'Inter', fontSize: 14, lineHeight: '23px', color: o.ativo ? 'rgba(255,255,255,0.78)' : '#797979' }}>{o.desc}</p>
      {o.tags && (
        <div className="flex gap-3 mb-6">
          {o.tags.map((t) => (
            <span key={t.v} className="rounded-full px-3 py-1.5" style={{ background: 'rgba(255,255,255,0.08)', fontFamily: 'Inter', fontSize: 11.5, color: '#fff' }}>
              <b style={{ color: '#d2e718' }}>{t.v}</b> {t.l}
            </span>
          ))}
        </div>
      )}
      {o.ativo && <div className="mt-auto"><HubButton size="sm" variant="lime">Acessar dados</HubButton></div>}
    </div>
  );
}

function SecObservatorios() {
  const ref = useReveal<HTMLElement>();
  return (
    <section ref={ref} className="py-24 lg:py-32 gutter bg-white">
      <div className="mb-14 max-w-[700px]">
        <p className="eyebrow text-muted mb-6" data-animate>OBSERVATÓRIOS TEMÁTICOS</p>
        <h2 className="mb-4" style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 'clamp(32px,4vw,50px)', letterSpacing: '-0.5px', lineHeight: 1, color: '#152852' }} data-animate>
          Dados que constroem autoridade.
        </h2>
        <p style={{ fontFamily: 'Inter', fontSize: 16, lineHeight: '27px', color: '#797979' }} data-animate>
          Monitoramento contínuo de temas estratégicos — com dashboards, relatórios e atualizações periódicas.
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {OBSERVATORIOS.map((o) => <ObservatorioCard key={o.nome} o={o} />)}
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
        eyebrow="BLOG · OBSERVATÓRIOS · PESQUISAS · WHITE PAPERS"
        title="HUB PAN Insights"
        sub="A plataforma de inteligência e conteúdo do ecossistema. Observatórios temáticos, pesquisas, artigos, entrevistas, relatórios e white papers sobre inovação, IA, governança, educação e cooperação internacional."
        actions={<>
          <HubButton size="lg" variant="lime" onClick={() => ScrollSmoother.get()?.scrollTo('#insights-artigos', true)}>Ver todos os conteúdos</HubButton>
          <Link to="/#newsletter"><HubButton size="lg" variant="blue">Assinar newsletter</HubButton></Link>
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
