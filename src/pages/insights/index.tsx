import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { BrainCircuit, GraduationCap, Globe2 } from 'lucide-react';
import Hero80, { STRIP_THEMES } from '../../components/Hero80';
import CTABanner from '../../components/CTABanner';
import HubButton from '../../components/HubButton';
import { useReveal } from '../../components/useReveal';
import { useTilt } from '../../components/useTilt';

gsap.registerPlugin(ScrollTrigger);

/* ═══════════ Dados ═══════════ */

const STATS = [
  { value: 1, label: 'Observatório de IA ativo' },
  { value: 3, label: 'Linhas editoriais' },
  { value: 'MG', label: 'Primeiro mapeamento estadual', accent: true },
  { value: 10, label: 'Anos de dados do ecossistema' },
  { value: 4, label: 'Territórios monitorados' },
  { value: 'ODS', label: 'Referencial analítico' },
];

const DESTAQUE = {
  img: 's9-insight-1',
  cat: 'OBSERVATÓRIO · IA',
  titulo: 'Mapeamento do uso de IA na administração pública em Minas Gerais',
  desc: 'A pesquisa inaugural do Observatório HUB PAN: dados inéditos sobre a adoção de inteligência artificial no setor público — maturidade real, barreiras concretas e o retrato que faltava para orientar política pública.',
  meta: 'Observatório HUB PAN · Pesquisa inaugural',
};

const ARTIGOS = [
  { img: 's9-insight-2', cat: 'OBSERVATÓRIO · IA', titulo: 'Governança de IA nas Américas e África', desc: 'Análise comparativa de marcos regulatórios e políticas públicas de inteligência artificial.' },
  { img: 's9-insight-3', cat: 'EDUCAÇÃO & TRABALHO', titulo: 'Educação e futuro do trabalho no ecossistema global', desc: 'White paper sobre capacitação, formação e as competências do profissional do futuro.' },
  { img: 's6-numero-1', cat: 'ECOSSISTEMA', titulo: '10 anos de fóruns: o que os dados mostram', desc: 'Quinze edições depois, o que o histórico documentado revela sobre inovação nas Américas.' },
  { img: 'inst-nyc-onu', cat: 'DIPLOMACIA & COOPERAÇÃO', titulo: 'O caminho institucional até o 4º andar da ONU', desc: 'Como se constrói presença dentro das Nações Unidas — e o que ela destrava.' },
  { img: 'inst-boston-mit', cat: 'OBSERVATÓRIO · IA', titulo: 'Por que Cambridge concentra o futuro da IA', desc: 'A geografia da inovação: o que faz um único bairro pautar a agenda global.' },
  { img: 's5-timeline-2', cat: 'ECOSSISTEMA', titulo: 'Smart Cities e ODS: a tese que nasceu em BH', desc: 'A conexão entre agenda urbana e desenvolvimento sustentável que virou método.' },
];

const LINHAS = [
  {
    Icon: BrainCircuit, bg: '#152852', text: '#fff', sub: 'rgba(255,255,255,0.78)', iconBg: 'rgba(255,255,255,0.1)', iconColor: '#d2e718', tagColor: 'rgba(255,255,255,0.6)',
    tag: 'LINHA 01', titulo: 'Observatório de IA', desc: 'Maturidade, adoção e governança de inteligência artificial — com foco no setor público das Américas e da África.',
  },
  {
    Icon: GraduationCap, bg: '#2d4ebf', text: '#fff', sub: 'rgba(255,255,255,0.82)', iconBg: 'rgba(255,255,255,0.12)', iconColor: '#d2e718', tagColor: 'rgba(255,255,255,0.6)',
    tag: 'LINHA 02', titulo: 'Educação & Futuro do Trabalho', desc: 'Formação, competências e o impacto da IA na sala de aula e no mercado — a herança Premier Niveau em forma de pesquisa.',
  },
  {
    Icon: Globe2, bg: '#d2e718', text: '#152852', sub: 'rgba(21,40,82,0.85)', iconBg: 'rgba(21,40,82,0.08)', iconColor: '#152852', tagColor: 'rgba(21,40,82,0.6)',
    tag: 'LINHA 03', titulo: 'Diplomacia & Cooperação', desc: 'Relações internacionais, cooperação Sul-Sul e os bastidores institucionais de ONU, MIPAD e territórios do ecossistema.',
  },
];

/* ═══════════ Seções ═══════════ */

/* Destaque — análise em evidência, split foto + conteúdo */
function SecDestaque() {
  const ref = useReveal<HTMLElement>();
  const tilt = useTilt<HTMLDivElement>(3, 4);
  return (
    <section ref={ref} className="py-24 lg:py-32 gutter bg-white">
      <div className="mb-14 max-w-[700px]">
        <p className="eyebrow text-muted mb-6" data-animate>EM DESTAQUE</p>
        <h2 className="mb-4" style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 'clamp(32px,4vw,50px)', letterSpacing: '-0.5px', lineHeight: 1, color: '#152852' }} data-animate>
          A análise que está pautando a conversa.
        </h2>
      </div>

      <div ref={tilt} className="grid lg:grid-cols-2 rounded-[20px] overflow-hidden" style={{ background: '#ebebeb' }} data-animate>
        <div className="overflow-hidden h-[280px] lg:h-auto lg:min-h-[420px]">
          <img src={`/images/${DESTAQUE.img}.webp`} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="flex flex-col justify-center p-8 lg:p-12">
          <p className="mb-4" style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 11, letterSpacing: '2.2px', textTransform: 'uppercase', color: '#2d4ebf' }}>{DESTAQUE.cat}</p>
          <h3 className="mb-4" style={{ fontFamily: 'Luxenta', fontWeight: 600, fontSize: 'clamp(24px,2.2vw,34px)', lineHeight: 1.1, color: '#152852' }}>{DESTAQUE.titulo}</h3>
          <p className="mb-6" style={{ fontFamily: 'Inter', fontSize: 15.5, lineHeight: '26px', color: '#797979' }}>{DESTAQUE.desc}</p>
          <p className="mb-8" style={{ fontFamily: 'Inter', fontSize: 13, color: '#a7a4a4' }}>{DESTAQUE.meta}</p>
          <div><Link to="/contato"><HubButton size="md" variant="blue">Ler a análise</HubButton></Link></div>
        </div>
      </div>
    </section>
  );
}

/* Grade de análises */
function SecArtigos() {
  const ref = useReveal<HTMLElement>();
  return (
    <section id="insights-artigos" ref={ref} className="py-24 lg:py-32 gutter" style={{ background: '#f5f5f5' }}>
      <div className="mb-14 max-w-[700px]">
        <p className="eyebrow text-muted mb-6" data-animate>ÚLTIMAS ANÁLISES</p>
        <h2 className="mb-4" style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 'clamp(32px,4vw,50px)', letterSpacing: '-0.5px', lineHeight: 1, color: '#152852' }} data-animate>
          Do dado bruto à decisão.
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ARTIGOS.map((c) => (
          <div key={c.titulo} className="flex flex-col cursor-pointer group bg-white" style={{ borderRadius: 20, padding: 21, minHeight: 440, border: '1px solid #ecedf0' }} data-animate>
            <div className="overflow-hidden mb-4" style={{ borderRadius: 20, height: 210 }}>
              <img src={`/images/${c.img}.webp`} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>
            <p style={{ fontFamily: 'Inter', fontSize: 11, fontWeight: 400, letterSpacing: '2.2px', color: '#2d4ebf', marginBottom: 12 }}>{c.cat}</p>
            <p style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 19, lineHeight: 1.3, color: '#152852', marginBottom: 12 }}>{c.titulo}</p>
            <p style={{ fontFamily: 'Inter', fontSize: 14.5, lineHeight: '23px', color: '#a7a4a4', marginTop: 'auto' }}>{c.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* Linhas editoriais — 3 cards coloridos com tilt */
function LinhaCard({ l }: { l: (typeof LINHAS)[number] }) {
  const tilt = useTilt<HTMLDivElement>(5, 7);
  const { Icon } = l;
  return (
    <div ref={tilt} className="flex flex-col rounded-[20px] p-8 min-h-[300px]" style={{ background: l.bg }} data-animate>
      <span className="flex items-center justify-center rounded-full mb-auto" style={{ width: 56, height: 56, background: l.iconBg }}>
        <Icon size={26} strokeWidth={2} color={l.iconColor} />
      </span>
      <p className="mb-3 mt-8" style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 10.5, letterSpacing: '1.8px', textTransform: 'uppercase', color: l.tagColor }}>{l.tag}</p>
      <h3 className="mb-3" style={{ fontFamily: 'Luxenta', fontWeight: 600, fontSize: 24, lineHeight: 1.05, color: l.text }}>{l.titulo}</h3>
      <p style={{ fontFamily: 'Inter', fontSize: 14, lineHeight: '23px', color: l.sub }}>{l.desc}</p>
    </div>
  );
}

function SecLinhas() {
  const ref = useReveal<HTMLElement>();
  return (
    <section ref={ref} className="py-24 lg:py-32 gutter bg-white">
      <div className="mb-14 max-w-[700px]">
        <p className="eyebrow text-muted mb-6" data-animate>LINHAS EDITORIAIS</p>
        <h2 className="mb-4" style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 'clamp(32px,4vw,50px)', letterSpacing: '-0.5px', lineHeight: 1, color: '#152852' }} data-animate>
          Três lentes sobre o mesmo futuro.
        </h2>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {LINHAS.map((l) => <LinhaCard key={l.tag} l={l} />)}
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
        eyebrow="OBSERVATÓRIO · PESQUISAS · INTELIGÊNCIA ESTRATÉGICA"
        title={<>O que o mundo debate,<br />a gente documenta,<br /><span style={{ color: '#d2e718' }}>analisa e antecipa.</span></>}
        sub="HUB PAN Insights é a frente de inteligência do ecossistema: observatórios, white papers e análises sobre IA, educação e cooperação internacional — do dado bruto à decisão."
        actions={<>
          <HubButton size="lg" variant="lime" onClick={() => ScrollSmoother.get()?.scrollTo('#insights-artigos', true)}>Explorar análises</HubButton>
          <Link to="/contato"><HubButton size="lg" variant="blue">Falar com o Insights</HubButton></Link>
        </>}
        stats={STATS}
        strip={STRIP_THEMES.light}
      />
      <SecDestaque />
      <SecArtigos />
      <SecLinhas />
      <CTABanner
        title={<>Tem uma pauta, pesquisa ou <span style={{ color: '#d2e718' }}>parceria editorial?</span></>}
        sub="O Insights trabalha com dados do ecossistema e parceiros acadêmicos — e a agenda está sempre aberta."
        actions={<Link to="/contato"><HubButton size="lg" variant="lime">Propor uma pauta</HubButton></Link>}
      />
    </>
  );
}
