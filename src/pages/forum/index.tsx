import { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import {
  BrainCircuit, GraduationCap, Building2, HeartHandshake, Scale, Globe2, Megaphone, Users, Mic,
} from 'lucide-react';
import Hero80, { STRIP_THEMES } from '../../components/Hero80';
import FAQAccordion from '../../components/FAQAccordion';
import CTABanner from '../../components/CTABanner';
import HubButton from '../../components/HubButton';
import { useReveal, useRevealBidirectional } from '../../components/useReveal';
import { useTilt } from '../../components/useTilt';

gsap.registerPlugin(ScrollTrigger);

/* ═══════════ Dados ═══════════ */

const STATS = [
  { value: '2027', label: 'Primeira edição · Cambridge', accent: true },
  { value: 15, label: 'Edições de legado' },
  { value: 4, label: 'Continentes conectados' },
  { value: 'ONU', label: 'Rota institucional 2026' },
  { value: 100, suffix: '%', label: 'Ativo proprietário' },
  { value: 'WAIF', label: 'Marca global do fórum' },
];

const ROTA = [
  { ano: '2026', quando: 'Maio', titulo: '1ª Expo Boston', major: false, desc: 'A primeira edição do ecossistema fora do eixo Brasil–Nova York. Boston entra no mapa como palco de tecnologia e inovação.' },
  { ano: '2026', quando: 'Junho', titulo: 'Lançamento do Portal HUB PAN', major: false, desc: 'O ecossistema vira plataforma global — e a campanha do Fórum Mundial de IA começa oficialmente.' },
  { ano: '2026', quando: 'Novembro', titulo: '4º andar das Nações Unidas', major: true, desc: 'O Delegates Dining Room inteiro, dentro da ONU, em Nova York. O palco institucional que apresenta o WAIF ao mundo.' },
  { ano: '2027', quando: 'O destino', titulo: 'Fórum Mundial de IA · Cambridge, MA', major: true, desc: 'Entre Harvard e MIT, a primeira edição do maior ativo proprietário do HUB PAN. Autoridade global em IA, construída tijolo a tijolo.' },
];

const PORQUE = [
  { img: 'inst-boston-mit', tag: 'VIZINHANÇA IMEDIATA', nome: 'MIT', desc: 'O epicentro mundial da pesquisa aplicada em IA fica a minutos do endereço do fórum.' },
  { img: 'inst-cambridge-harvard', tag: 'AUTORIDADE ACADÊMICA', nome: 'Harvard', desc: 'Harvard Square é a sede global do HUB PAN — o fórum acontece em casa, não em território alugado.' },
  { img: 'forum-onu-flags', tag: 'LEGITIMIDADE INSTITUCIONAL', nome: 'Rota ONU', desc: 'A campanha de lançamento passa por dentro das Nações Unidas — não por um outdoor.' },
];

const EIXOS = [
  { Icon: BrainCircuit, titulo: 'IA & Governos', desc: 'Políticas públicas, regulação e o Estado como usuário de IA.' },
  { Icon: GraduationCap, titulo: 'IA & Educação', desc: 'Formação, futuro do trabalho e a sala de aula na era dos modelos.' },
  { Icon: Building2, titulo: 'IA & Negócios', desc: 'Adoção real, produtividade e os novos mercados da inteligência.' },
  { Icon: HeartHandshake, titulo: 'IA & Impacto', desc: 'ODS, diversidade e a cooperação Sul-Sul como pauta central.' },
  { Icon: Scale, titulo: 'Ética & Governança', desc: 'Transparência algorítmica, dados e confiança pública.' },
  { Icon: Globe2, titulo: 'Cooperação Internacional', desc: 'Américas e África na mesma mesa — a assinatura do HUB PAN.' },
];

const PARTICIPE = [
  {
    Icon: Megaphone, bg: '#152852', text: '#fff', sub: 'rgba(255,255,255,0.78)', iconBg: 'rgba(255,255,255,0.1)', iconColor: '#d2e718',
    tag: 'PATROCINADORES', titulo: 'Coloque sua marca na fundação', desc: 'Cotas fundadoras com naming, ativação nos territórios e relacionamento de alto nível — antes de o mundo inteiro chegar.',
    btn: <HubButton size="md" variant="lime">Quero patrocinar</HubButton>,
  },
  {
    Icon: Users, bg: '#2d4ebf', text: '#fff', sub: 'rgba(255,255,255,0.82)', iconBg: 'rgba(255,255,255,0.12)', iconColor: '#d2e718',
    tag: 'DELEGAÇÕES', titulo: 'Leve seu governo ou empresa', desc: 'Delegações oficiais com agenda estruturada em Cambridge e Boston — imersão, negócios e relações institucionais.',
    btn: <HubButton size="md" variant="lime">Montar delegação</HubButton>,
  },
  {
    Icon: Mic, bg: '#d2e718', text: '#152852', sub: 'rgba(21,40,82,0.85)', iconBg: 'rgba(21,40,82,0.08)', iconColor: '#152852',
    tag: 'PALESTRANTES & PARCEIROS', titulo: 'Entre para a programação', desc: 'Chamada de conteúdo, parcerias acadêmicas e institucionais para compor os eixos temáticos da primeira edição.',
    btn: <HubButton size="md" variant="navy">Propor participação</HubButton>,
  },
];

const FAQ = [
  { q: 'Quando e onde acontece o Fórum Mundial de IA?', a: 'A primeira edição está marcada para 2027, em Cambridge, Massachusetts — no entorno imediato de Harvard e MIT, onde fica a sede global do HUB PAN. As edições preparatórias da rota (Expo Boston e o evento no 4º andar da ONU) acontecem ao longo de 2026.' },
  { q: 'Quem organiza o fórum?', a: 'O WAIF é o maior ativo proprietário do HUB PAN — organizado pelo próprio ecossistema, que soma 15 edições de fóruns internacionais realizados em quase dez anos, incluindo quatro em Nova York e presença dentro das Nações Unidas.' },
  { q: 'Qual é a relação do fórum com a ONU?', a: 'A campanha global de lançamento do WAIF passa por dentro das Nações Unidas: em novembro de 2026, o HUB PAN ocupa o 4º andar inteiro da sede da ONU em Nova York, no Delegates Dining Room, com a parceria do MIPAD — organismo vinculado à ONU.' },
  { q: 'Como patrocinar a primeira edição?', a: 'As cotas fundadoras de patrocínio estão abertas para conversa — com naming, presença nos territórios do ecossistema durante toda a rota 2026-2027 e relacionamento direto com as delegações. Fale com a equipe pelo formulário de contato.' },
  { q: 'Por que Cambridge, e não um centro de convenções qualquer?', a: 'Porque autoridade não se aluga. Cambridge concentra a maior densidade de pesquisa e inovação em IA do mundo, e o HUB PAN tem sede em Harvard Square desde 2023. O fórum acontece onde a conversa global de IA já mora.' },
];

/* ═══════════ Rota até 2027 — timeline com anos gigantes e linha animada ═══════════ */

function RotaItem({ item, side }: { item: (typeof ROTA)[number]; side: 'left' | 'right' }) {
  const ref = useRevealBidirectional<HTMLDivElement>(0.08);
  return (
    <div ref={ref} className="relative py-14 lg:py-20">
      {/* Ano gigante centralizado */}
      <p
        className="relative text-center select-none"
        style={{
          fontFamily: 'Luxenta', fontWeight: 400, fontSize: 'clamp(80px, 11vw, 190px)', lineHeight: 0.9, letterSpacing: '-4px',
          color: item.major ? '#152852' : 'transparent',
          WebkitTextStroke: item.major ? undefined : '1.5px rgba(21,40,82,0.35)',
        }}
        data-animate
      >
        {item.ano}
      </p>
      {/* Bolinha no trilho */}
      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 w-[14px] h-[14px] rounded-full bg-white" style={{ border: '2px solid #152852' }} />
      {/* Info em ziguezague */}
      <div className={`mt-8 lg:mt-0 lg:absolute lg:top-1/2 lg:-translate-y-1/2 lg:w-[38%] ${side === 'left' ? 'lg:left-0 lg:text-right' : 'lg:right-0'}`} data-animate>
        <p className="mb-2" style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 11, letterSpacing: '2.2px', textTransform: 'uppercase', color: '#2d4ebf' }}>{item.quando}</p>
        <h3 className="mb-2" style={{ fontFamily: 'Luxenta', fontWeight: 600, fontSize: 23, lineHeight: 1.1, color: '#152852' }}>{item.titulo}</h3>
        <p style={{ fontFamily: 'Inter', fontSize: 14.5, lineHeight: '23px', color: '#797979' }}>{item.desc}</p>
      </div>
    </div>
  );
}

function SecRota() {
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
    <section
      id="forum-rota"
      className="pt-24 lg:pt-32 gutter overflow-hidden"
      style={{ background: 'linear-gradient(39.8deg, #ffffff 65.3%, #d2e718 99%)' }}
    >
      <div ref={headRef} className="mb-16 max-w-[680px]">
        <p className="eyebrow text-muted mb-6" data-animate>A ROTA ATÉ 2027</p>
        <h2 className="mb-4" style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 'clamp(32px,4vw,50px)', letterSpacing: '-0.5px', lineHeight: 1, color: '#152852' }} data-animate>
          Ninguém chega a Cambridge por acaso.
        </h2>
        <p style={{ fontFamily: 'Inter', fontSize: 16, lineHeight: '27px', color: '#797979' }} data-animate>
          O WAIF não é um evento anunciado — é uma rota em execução, com cada etapa de 2026 construindo o palco de 2027.
        </p>
      </div>

      {/* pb aqui (não na section) pro trilho encostar na seção seguinte */}
      <div ref={wrapRef} className="relative pb-24 lg:pb-32">
        <div className="absolute top-1 bottom-0 w-px" style={{ left: 'calc(50% - 0.5px)', background: '#dcdcdc' }} />
        <div ref={progRef} className="absolute top-1 bottom-0 w-[2px] bg-hubblue" style={{ left: 'calc(50% - 1px)', transform: 'scaleY(0)' }} />
        {ROTA.map((item, i) => (
          <RotaItem key={`${item.ano}-${item.quando}`} item={item} side={i % 2 === 0 ? 'left' : 'right'} />
        ))}
      </div>
    </section>
  );
}

/* Por que Cambridge — seção escura com 3 tiles fotográficos */
function SecPorque() {
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
        <div className="mb-14 max-w-[720px]">
          <p className="eyebrow mb-6" style={{ color: 'rgba(255,255,255,0.69)' }} data-animate>POR QUE CAMBRIDGE</p>
          <h2 className="mb-4" style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 'clamp(32px,4vw,50px)', letterSpacing: '-0.5px', lineHeight: 1, color: '#fff' }} data-animate>
            Autoridade <span style={{ color: '#d2e718' }}>não se aluga.</span> Se constrói no endereço certo.
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {PORQUE.map((t) => (
            <div key={t.nome} className="group relative rounded-[20px] overflow-hidden h-[380px]" data-animate>
              <img src={`/images/${t.img}.webp`} alt={t.nome} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(6,9,25,0.92) 0%, rgba(6,9,25,0.35) 50%, rgba(6,9,25,0.08) 100%)' }} />
              <div className="absolute inset-x-0 bottom-0 p-7">
                <p className="mb-2" style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 10, letterSpacing: '1.6px', textTransform: 'uppercase', color: '#d2e718' }}>{t.tag}</p>
                <h3 className="mb-2" style={{ fontFamily: 'Luxenta', fontWeight: 600, fontSize: 26, lineHeight: 1.05, color: '#fff' }}>{t.nome}</h3>
                <p style={{ fontFamily: 'Inter', fontSize: 13.5, lineHeight: '21px', color: 'rgba(255,255,255,0.85)' }}>{t.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* Eixos temáticos — 6 cards com tilt */
function EixoCard({ e }: { e: (typeof EIXOS)[number] }) {
  const tilt = useTilt<HTMLDivElement>(5, 7);
  const { Icon } = e;
  return (
    <div ref={tilt} className="rounded-[20px] bg-white p-7 flex flex-col" style={{ border: '1px solid #ecedf0' }} data-animate>
      <span className="flex items-center justify-center rounded-full mb-6" style={{ width: 52, height: 52, background: '#f5f5f5' }}>
        <Icon size={24} strokeWidth={2} color="#2d4ebf" />
      </span>
      <h3 className="mb-2" style={{ fontFamily: 'Luxenta', fontWeight: 600, fontSize: 21, lineHeight: 1.1, color: '#152852' }}>{e.titulo}</h3>
      <p style={{ fontFamily: 'Inter', fontSize: 14, lineHeight: '23px', color: '#797979' }}>{e.desc}</p>
    </div>
  );
}

function SecEixos() {
  const ref = useReveal<HTMLElement>();
  return (
    <section ref={ref} className="py-24 lg:py-32 gutter" style={{ background: '#f5f5f5' }}>
      <div className="mb-14 max-w-[700px]">
        <p className="eyebrow text-muted mb-6" data-animate>EIXOS TEMÁTICOS</p>
        <h2 className="mb-4" style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 'clamp(32px,4vw,50px)', letterSpacing: '-0.5px', lineHeight: 1, color: '#152852' }} data-animate>
          A agenda que o mundo precisa debater.
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {EIXOS.map((e) => <EixoCard key={e.titulo} e={e} />)}
      </div>
    </section>
  );
}

/* Participe — 3 cards coloridos */
function ParticipeCard({ p }: { p: (typeof PARTICIPE)[number] }) {
  const tilt = useTilt<HTMLDivElement>(5, 7);
  const { Icon } = p;
  return (
    <div ref={tilt} className="flex flex-col rounded-[20px] p-8" style={{ background: p.bg }} data-animate>
      <span className="flex items-center justify-center rounded-full mb-8" style={{ width: 56, height: 56, background: p.iconBg }}>
        <Icon size={26} strokeWidth={2} color={p.iconColor} />
      </span>
      <p className="mb-3" style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 10.5, letterSpacing: '1.8px', textTransform: 'uppercase', color: p.sub }}>{p.tag}</p>
      <h3 className="mb-3" style={{ fontFamily: 'Luxenta', fontWeight: 600, fontSize: 24, lineHeight: 1.05, color: p.text }}>{p.titulo}</h3>
      <p className="mb-8" style={{ fontFamily: 'Inter', fontSize: 14.5, lineHeight: '24px', color: p.sub }}>{p.desc}</p>
      <div className="mt-auto"><Link to="/contato">{p.btn}</Link></div>
    </div>
  );
}

function SecParticipe() {
  const ref = useReveal<HTMLElement>();
  return (
    <section ref={ref} className="py-24 lg:py-32 gutter bg-white">
      <div className="mb-14 max-w-[700px]">
        <p className="eyebrow text-muted mb-6" data-animate>COMO PARTICIPAR</p>
        <h2 className="mb-4" style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 'clamp(32px,4vw,50px)', letterSpacing: '-0.5px', lineHeight: 1, color: '#152852' }} data-animate>
          Três portas de entrada para 2027.
        </h2>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {PARTICIPE.map((p) => <ParticipeCard key={p.tag} p={p} />)}
      </div>
    </section>
  );
}

function SecFAQ() {
  const ref = useReveal<HTMLElement>();
  return (
    <section ref={ref} className="py-24 lg:py-32 gutter" style={{ background: '#f5f5f5' }}>
      <div className="grid lg:grid-cols-[1fr_1.4fr] gap-12">
        <div>
          <p className="eyebrow text-muted mb-6" data-animate>PERGUNTAS FREQUENTES</p>
          <h2 className="mb-4" style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 'clamp(32px,4vw,50px)', letterSpacing: '-0.5px', lineHeight: 1, color: '#152852' }} data-animate>
            O essencial sobre o WAIF.
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

export default function ForumMundialIA() {
  return (
    <>
      <Hero80
        img="/images/forum-hero-mit.webp"
        imgAlt="MIT Museum — Cambridge, MA"
        eyebrow="O MAIOR ATIVO PROPRIETÁRIO DO HUB PAN"
        title={<>O mundo vai debater IA.<br />O endereço será<br /><span style={{ color: '#d2e718' }}>Cambridge, 2027.</span></>}
        sub="O Fórum Mundial de Inteligência Artificial (WAIF) é o evento âncora do HUB PAN: autoridade, patrocínio, relacionamento e geração de negócios no epicentro global da inovação — entre Harvard e MIT."
        actions={<>
          <Link to="/contato"><HubButton size="lg" variant="lime">Quero patrocinar</HubButton></Link>
          <HubButton size="lg" variant="blue" onClick={() => ScrollSmoother.get()?.scrollTo('#forum-rota', true)}>Ver a rota até 2027</HubButton>
        </>}
        stats={STATS}
        strip={STRIP_THEMES.lime}
      />
      <SecRota />
      <SecPorque />
      <SecEixos />
      <SecParticipe />
      <SecFAQ />
      <CTABanner
        title={<>2027 está mais perto <span style={{ color: '#d2e718' }}>do que parece.</span></>}
        sub="Cotas fundadoras de patrocínio abertas para conversa — quem entra agora, entra na fundação."
        actions={<>
          <Link to="/contato"><HubButton size="lg" variant="lime">Patrocinar o WAIF</HubButton></Link>
          <Link to="/imprensa"><HubButton size="lg" variant="navy">Área de imprensa</HubButton></Link>
        </>}
      />
    </>
  );
}
