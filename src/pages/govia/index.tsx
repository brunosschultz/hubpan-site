import { useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import {
  BrainCircuit, GraduationCap, Newspaper, Telescope, Check, Clock, CreditCard, ShieldOff, Puzzle,
} from 'lucide-react';
import Hero80, { STRIP_THEMES } from '../../components/Hero80';
import HubButton, { WHATSAPP_URL } from '../../components/HubButton';
import CreditCardMock from '../../components/CreditCardMock';
import { useReveal } from '../../components/useReveal';
import { useTilt } from '../../components/useTilt';
import { EIcon, ERich, ET, useEditColor, useEditColors, useEditImage, BgEditChip } from '../../editor/fields';

gsap.registerPlugin(ScrollTrigger);

/* ═══════════ Dados — extraídos do wireframe oficial (page-govia) ═══════════ */
/* Sem bloco de stats no wireframe original — números abaixo são fatos reais citados
   no próprio texto da página (planos, demo, observatório), não estimativas novas. */
const STATS = [
  { value: 0, editKey: 'govia.hero.stat1.valor', editLabel: 'Hero — stat 1 (valor)', label: <ET k="govia.hero.stat1.label" v="Cartão de crédito exigido" l="Hero — stat 1 (rótulo)" /> },
  { value: 4, editKey: 'govia.hero.stat2.valor', editLabel: 'Hero — stat 2 (valor)', label: <ET k="govia.hero.stat2.label" v="Eixos em um único contrato" l="Hero — stat 2 (rótulo)" /> },
  { value: 'MG', editKey: 'govia.hero.stat3.valor', editLabel: 'Hero — stat 3 (valor)', label: <ET k="govia.hero.stat3.label" v="Observatório em campo" l="Hero — stat 3 (rótulo)" />, accent: true },
  { value: 30, suffix: 'min', editKey: 'govia.hero.stat4.valor', editLabel: 'Hero — stat 4 (valor)', label: <ET k="govia.hero.stat4.label" v="Demonstração gratuita" l="Hero — stat 4 (rótulo)" /> },
  { value: 1, editKey: 'govia.hero.stat5.valor', editLabel: 'Hero — stat 5 (valor)', label: <ET k="govia.hero.stat5.label" v="Dia útil de resposta" l="Hero — stat 5 (rótulo)" /> },
];

const EIXOS: { slug: string; Icon: typeof BrainCircuit; titulo: string; desc: string; itens: string[] }[] = [
  {
    slug: 'ferramentas', Icon: BrainCircuit, titulo: 'Ferramentas de IA curadas',
    desc: 'Acesso curado a ferramentas de IA relevantes para o setor público — triadas quanto a segurança, utilidade e adequação governamental. Sem cartão de crédito, sem burocracia de contratação individual.',
    itens: ['Ferramentas para comunicação pública', 'IA para análise de dados e relatórios', 'Assistentes para atendimento ao cidadão', 'Automação de processos administrativos'],
  },
  {
    slug: 'formacao', Icon: GraduationCap, titulo: 'Formação e capacitação',
    desc: 'Trilhas de aprendizagem desenhadas para servidores públicos — do básico ao avançado. Sem jargão técnico, com foco em aplicações reais no cotidiano da administração pública.',
    itens: ['Trilhas por área de atuação (saúde, educação, fazenda)', 'Certificações pelo HUB PAN Academy', 'Formação de multiplicadores internos', 'Acesso ao AVA HUB PAN via subdomínio dedicado'],
  },
  {
    slug: 'conteudo', Icon: Newspaper, titulo: 'Conteúdo especializado',
    desc: 'Produção contínua de conteúdo sobre IA no contexto da administração pública — artigos, alertas regulatórios, casos de uso e tendências internacionais. Conectado ao HUB PAN Insights.',
    itens: ['Newsletter semanal de IA para gestores públicos', 'Análises de legislação e regulação de IA', 'Cases de uso de IA em outros municípios', 'Acesso ao Fórum Mundial de IA como membro'],
  },
  {
    slug: 'observatorio', Icon: Telescope, titulo: 'Observatório de IA',
    desc: 'Acesso exclusivo aos dados do Observatório HUB PAN — mapeamento do uso de IA na administração pública, benchmarks estaduais e nacionais e comparativos internacionais. Ativo único no mercado.',
    itens: ['Dados de mapeamento em Minas Gerais (em andamento)', 'Comparativo com região de Boston (previsto 2027)', 'Relatórios trimestrais de tendências', 'Dados para políticas públicas de IA'],
  },
];

const OBS_DADOS = [
  'Uso de IA por área de governo (saúde, educação, fazenda, obras, comunicação)',
  'Ferramentas mais adotadas e barreiras de implementação relatadas',
  'Nível de letramento de IA dos servidores por município',
  'Comparativo com benchmarks internacionais — Boston em 2027',
];

const PLANOS = [
  {
    id: 'basico', tag: undefined, nome: 'Básico', sub: 'Municipal', desc: 'Para prefeituras com até 100.000 habitantes',
    inclui: ['Acesso a 5 ferramentas curadas', 'Trilha básica para até 20 servidores', 'Newsletter semanal GovIA', 'Relatório trimestral do Observatório'],
    incluiLabel: 'INCLUI',
    variant: 'outline-dark' as const, bg: '#fff', border: true,
  },
  {
    id: 'profissional', tag: 'Mais contratado', nome: 'Profissional', sub: 'Estadual ou Consórcio', desc: 'Estados, consórcios e municípios acima de 100.000 habitantes',
    inclui: ['Acesso ilimitado a ferramentas curadas', 'Trilhas avançadas para até 200 servidores', 'Acesso completo ao Observatório de IA', 'Ingresso no Fórum Mundial de IA', 'Suporte técnico dedicado'],
    incluiLabel: 'INCLUI TUDO DO BÁSICO, MAIS',
    variant: 'lime' as const, bg: '#152852', border: false,
  },
  {
    id: 'enterprise', tag: undefined, nome: 'Enterprise', sub: 'Personalizado', desc: 'Para grandes estados, ministérios e estruturas especiais',
    inclui: ['Plataforma white label com subdomínio', 'Pesquisa exclusiva no Observatório', 'Co-branding no Fórum Mundial de IA', 'Serviços de consultoria inclusos'],
    incluiLabel: 'INCLUI TUDO DO PROFISSIONAL, MAIS',
    variant: 'outline-dark' as const, bg: '#fff', border: true,
  },
];

const DEMO_BENEFICIOS = [
  { slug: '30min', tag: '30', Icon: Clock, titulo: '30 minutos de demonstração', desc: 'Online, sem deslocamento, sem compromisso' },
  { slug: 'plano-basico', tag: 'PB', Icon: Check, titulo: 'Plano básico disponível imediatamente', desc: 'Municípios podem ativar o Municipal em poucos dias' },
  { slug: 'observatorio', tag: 'OB', Icon: Telescope, titulo: 'Acesso ao Observatório de IA incluído', desc: 'Dados inéditos sobre IA no setor público no Brasil' },
];

const NECESSIDADES = ['Acesso a ferramentas de IA', 'Formação de servidores', 'Dados e benchmarks do Observatório', 'Diagnóstico do uso de IA na minha gestão', 'Quero entender tudo que o GovIA oferece'];

const ECOSSISTEMA = [
  { tag: '2027', t: 'Fórum Mundial de IA — Cambridge', to: '/forum-mundial-ia', color: 'lime' as const },
  { tag: 'ESG', t: 'PROINTER — Intercâmbio de impacto', to: '/prointer', color: 'blue' as const },
  { tag: 'Dados', t: 'HUB PAN Insights — Observatório de IA', to: '/insights', color: 'navy' as const },
  { tag: 'Cases', t: 'Casos de uso em governos', to: '/casos-de-uso', color: 'blue' as const },
];

const ECO_COLORS = {
  blue: { bg: '#2d4ebf', text: '#fff', sub: 'rgba(255,255,255,0.7)' },
  lime: { bg: '#d2e718', text: '#152852', sub: 'rgba(21,40,82,0.65)' },
  navy: { bg: '#152852', text: '#fff', sub: 'rgba(255,255,255,0.6)' },
};

const FAQ = [
  { slug: 'o-que-e', q: 'O que é o GovIA?', a: 'O GovIA é uma plataforma de assinatura institucional de inteligência artificial desenvolvida especificamente para municípios, estados e consórcios públicos brasileiros. Ele resolve duas barreiras simultâneas: o acesso a ferramentas de IA (que normalmente exigem cartão de crédito, inexistente na maioria dos governos municipais) e a formação dos servidores para usar essas ferramentas de forma eficiente e responsável.' },
  { slug: 'contratacao-sem-cartao', q: 'Como um município contrata o GovIA sem cartão de crédito?', a: 'O GovIA aceita contratação via nota de empenho, dispensa de licitação e outros mecanismos compatíveis com a gestão pública municipal e estadual. O processo é feito com suporte da equipe HUB PAN, sem necessidade de cartão de crédito corporativo ou infraestrutura de pagamento digital que a maioria das prefeituras não possui.' },
  { slug: 'diferenciais', q: 'O GovIA se diferencia de outras plataformas de IA para governos?', a: 'Sim. As principais diferenças são: (1) modelo de contratação compatível com o setor público sem cartão de crédito; (2) curadoria de ferramentas específica para o contexto governamental, com critérios de segurança e adequação; (3) formação integrada para servidores — não apenas acesso a ferramentas; (4) o Observatório de IA, ativo exclusivo com dados inéditos sobre uso de IA na administração pública brasileira, disponível apenas para assinantes.' },
  { slug: 'observatorio', q: 'O que é o Observatório de IA do GovIA?', a: 'O Observatório de IA é uma pesquisa sistemática e contínua sobre o uso de inteligência artificial na administração pública brasileira. Iniciando por Minas Gerais, com comparativo previsto com a região metropolitana de Boston em 2027, o Observatório gera dados inéditos sobre quais ferramentas os governos estão usando, quais barreiras enfrentam e qual o nível de letramento digital dos servidores — dados exclusivos para assinantes do GovIA.' },
  { slug: 'quais-governos', q: 'Quais governos podem assinar o GovIA?', a: 'O GovIA atende prefeituras e secretarias municipais, governos estaduais, consórcios públicos, autarquias e fundações públicas. O plano Municipal é indicado para prefeituras com até 100.000 habitantes; o plano Estadual ou Consórcio atende estruturas maiores; e o plano Enterprise é customizado para grandes estados, ministérios e estruturas especiais.' },
];

const INPUT_STYLE: React.CSSProperties = {
  height: 50, borderRadius: 10, background: '#f5f5f5', border: '1px solid #ecedf0',
  fontFamily: 'Inter', fontSize: 14.5, color: '#152852', padding: '0 16px', width: '100%', outline: 'none',
};

/* ═══════════ Seções ═══════════ */

/* Posições em px — só a ponta/borda do card deve tocar o cartão, o resto fica pra fora */
const PROBLEMA_PILLS = [
  { slug: 'cartao', Icon: CreditCard, t: 'Sem cartão de crédito', d: 'Nota de empenho e dispensa de licitação', pos: { top: -24, left: -82 } },
  { slug: 'burocracia', Icon: ShieldOff, t: 'Sem burocracia', d: 'Um único contrato institucional', pos: { top: 228, left: 396 } },
  { slug: 'formacao', Icon: Puzzle, t: 'Acesso + formação', d: 'Ferramenta certa, servidor preparado', pos: { top: 498, left: -36 } },
];

/** Cards de vidro que sobrevoam o cartão 3D — flutuação contínua e sutil via GSAP. */
function FloatingPills() {
  const wrapRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const pills = gsap.utils.toArray<HTMLElement>('.problema-pill', wrap);
    const ctx = gsap.context(() => {
      pills.forEach((pill, i) => {
        gsap.to(pill, {
          y: i % 2 === 0 ? -16 : 14,
          rotation: i % 2 === 0 ? 1.5 : -1.5,
          duration: 3 + i * 0.6,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          delay: i * 0.3,
        });
      });
    }, wrap);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={wrapRef} className="absolute inset-0 pointer-events-none z-10">
      {PROBLEMA_PILLS.map(({ slug, Icon, t, d, pos }) => (
        <div
          key={slug}
          className="problema-pill absolute rounded-[16px] p-4 pointer-events-auto"
          style={{ ...pos, width: 190, backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', background: 'rgba(255,255,255,0.4)', border: '1px solid rgba(210,231,24,0.6)', boxShadow: '0 12px 32px rgba(21,40,82,0.12)' }}
        >
          <span className="flex items-center justify-center rounded-full mb-3" style={{ width: 38, height: 38, background: 'rgba(21,40,82,0.07)' }}>
            <EIcon k={`govia.problema.pill.${slug}.icone`} l={`Pill "${t}" — ícone`} defaultSize={18}>
              <Icon size={18} strokeWidth={2} color="#152852" />
            </EIcon>
          </span>
          <p style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 13, color: '#152852' }}>
            <ET k={`govia.problema.pill.${slug}.titulo`} v={t} l={`Pill "${t}" — título`} />
          </p>
          <p style={{ fontFamily: 'Inter', fontSize: 11.5, lineHeight: '16px', color: 'rgba(21,40,82,0.65)' }}>
            <ERich k={`govia.problema.pill.${slug}.desc`} l={`Pill "${t}" — descrição`}>{d}</ERich>
          </p>
        </div>
      ))}
    </div>
  );
}

function SecProblema() {
  const ref = useReveal<HTMLElement>();
  const [[degA, degB], degProps] = useEditColors('Problema central — fundo (gradiente)', [
    { key: 'govia.problema.bg.1', label: 'Problema central — fundo, cor 1', fallback: '#ffffff' },
    { key: 'govia.problema.bg.2', label: 'Problema central — fundo, cor 2', fallback: '#d2e718' },
  ]);
  return (
    <section ref={ref} id="govia-problema" className="relative w-full overflow-hidden" {...degProps} style={{ background: `linear-gradient(39.8deg, ${degA} 65.3%, ${degB} 99%)` }}>
      <div className="gutter grid lg:grid-cols-[1fr_1fr] gap-12 lg:gap-10 py-20 lg:py-0 lg:min-h-screen items-center">
        <div className="lg:py-24">
          <p className="eyebrow text-muted mb-8" data-animate>
            <ET k="govia.problema.eyebrow" v="O PROBLEMA CENTRAL" l="Problema central — selo" />
          </p>
          <h2 className="mb-9" style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 'clamp(38px,5.5vw,68px)', letterSpacing: '-1px', lineHeight: 1.02, color: '#152852' }} data-animate>
            <ERich k="govia.problema.titulo" l="Problema central — título">
              Governos não têm<br /><span style={{ color: '#d2e718' }}>cartão de crédito.</span>
            </ERich>
          </h2>
          <p className="mb-5" style={{ fontFamily: 'Inter', fontSize: 16.5, lineHeight: '28px', color: '#797979', maxWidth: 560 }} data-animate>
            <ERich k="govia.problema.texto1" l="Problema central — parágrafo 1" baseW={560}>
              Municípios brasileiros enfrentam uma barreira estrutural para acessar ferramentas de IA: a maioria das plataformas do mercado exige cartão de crédito — infraestrutura que governos municipais, em geral, não têm.
            </ERich>
          </p>
          <p className="mb-9" style={{ fontFamily: 'Inter', fontSize: 16.5, lineHeight: '28px', color: '#797979', maxWidth: 560 }} data-animate>
            <ERich k="govia.problema.texto2" l="Problema central — parágrafo 2" baseW={560}>
              O GovIA resolve as duas dores — acesso e formação — em um único contrato institucional, sem complexidade técnica e com suporte especializado no setor público.
            </ERich>
          </p>
          <div className="flex flex-wrap gap-4" data-animate>
            <HubButton size="lg" variant="navy" onClick={() => ScrollSmoother.get()?.scrollTo('#govia-planos', true)} iconKey="govia.problema.cta.icone" iconLabel="Problema central — botão, ícone" styleKey="govia.problema.cta" styleLabel="Problema central — botão">
              <ET k="govia.problema.cta" v="Ver como contratar" l="Problema central — botão" />
            </HubButton>
          </div>
        </div>

        <div className="relative mx-auto" style={{ width: 504, height: 576 }} data-animate>
          <div className="absolute" style={{ left: '50%', top: 48, transform: 'translateX(-50%)' }}>
            <CreditCardMock />
          </div>
          <FloatingPills />
        </div>
      </div>
    </section>
  );
}

const PANEL_THEME = {
  navy900: { bg: '#060919', title: '#fff', desc: 'rgba(255,255,255,0.75)', iconBg: 'rgba(255,255,255,0.08)', iconColor: '#d2e718', bigNum: 'rgba(255,255,255,0.05)' },
  navy: { bg: '#152852', title: '#fff', desc: 'rgba(255,255,255,0.78)', iconBg: 'rgba(255,255,255,0.1)', iconColor: '#d2e718', bigNum: 'rgba(255,255,255,0.06)' },
  blue: { bg: '#2d4ebf', title: '#fff', desc: 'rgba(255,255,255,0.82)', iconBg: 'rgba(255,255,255,0.14)', iconColor: '#d2e718', bigNum: 'rgba(255,255,255,0.08)' },
  white: { bg: '#ffffff', title: '#152852', desc: '#797979', iconBg: '#f5f5f5', iconColor: '#2d4ebf', bigNum: 'rgba(21,40,82,0.045)' },
} as const;
/* 1º eixo usa a mesma cor de fundo do cabeçalho (navy900) pra não ter salto de cor na virada */
const PANEL_ORDER: (keyof typeof PANEL_THEME)[] = ['navy900', 'blue', 'white', 'navy'];

/**
 * Seção "O que está incluso" inteira (título + 4 eixos) cabe em 100vh: a
 * seção fixa a tela (pin) enquanto o scroll vertical do usuário empurra o
 * trilho de eixos pro lado — mesmo mecanismo de trilho deslizante original.
 * Ao passar do último eixo, o pin libera e o scroll normal continua.
 */
function SecEixos() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<(HTMLSpanElement | null)[]>([]);

  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    const track = trackRef.current;
    if (!wrap || !track) return;

    // StrictMode roda o effect 2x em dev — garante que nenhum ScrollTrigger
    // "fantasma" de uma montagem anterior fique preso a este elemento antes
    // de criar o novo (senão sobram 2 pin-spacers aninhados e o pin trava mal).
    ScrollTrigger.getAll().filter((st) => st.trigger === wrap).forEach((st) => st.kill());

    const ctx = gsap.context(() => {
      const n = EIXOS.length;
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrap,
          start: 'top top',
          end: () => '+=' + (track.scrollWidth - window.innerWidth),
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const idx = Math.min(n - 1, Math.floor(self.progress * n));
            dotsRef.current.forEach((d, i) => {
              if (!d) return;
              d.style.opacity = i === idx ? '1' : '0.35';
              d.style.width = i === idx ? '26px' : '7px';
            });
          },
        },
      });
      tl.to(track, { x: () => -(track.scrollWidth - window.innerWidth), ease: 'none' });
    }, wrap);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={wrapRef} id="govia-incluso" className="relative w-full h-screen overflow-hidden flex flex-col bg-navy900">
      <div className="relative gutter pt-16 lg:pt-20 pb-4 shrink-0">
        <div className="max-w-[680px]">
          <p className="eyebrow mb-4" style={{ color: 'rgba(255,255,255,0.69)' }}>
            <ET k="govia.eixos.eyebrow" v="O QUE ESTÁ INCLUSO" l="Eixos — selo" />
          </p>
          <h2 className="mb-3" style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 'clamp(26px,3vw,40px)', letterSpacing: '-0.5px', lineHeight: 1, color: '#fff' }}>
            <ERich k="govia.eixos.titulo" l="Eixos — título">
              Quatro eixos. <span style={{ color: '#d2e718' }}>Um contrato.</span>
            </ERich>
          </h2>
          <p style={{ fontFamily: 'Inter', fontSize: 14.5, lineHeight: '23px', color: '#d6d6d6', maxWidth: 560 }}>
            <ERich k="govia.eixos.sub" l="Eixos — texto de apoio" baseW={560}>
              Role pra conhecer cada frente — acesso, formação, conteúdo e dados em uma estrutura só.
            </ERich>
          </p>
        </div>
      </div>

      <div className="relative flex-1">
        <div className="absolute inset-0 overflow-hidden">
          <div ref={trackRef} className="flex h-full" style={{ width: `${EIXOS.length * 100}vw` }}>
            {EIXOS.map((e, i) => {
              const t = PANEL_THEME[PANEL_ORDER[i % PANEL_ORDER.length]];
              const { Icon, slug } = e;
              const badgeTxt = `EIXO ${String(i + 1).padStart(2, '0')} DE ${EIXOS.length}`;
              return (
                <div key={e.titulo} className="relative h-full flex items-center shrink-0 overflow-hidden" style={{ width: '100vw', background: t.bg }}>
                <span className="absolute select-none pointer-events-none" style={{ right: '3vw', top: '50%', transform: 'translateY(-50%)', fontFamily: 'Luxenta', fontWeight: 400, fontSize: 'min(38vw, 380px)', lineHeight: 1, color: t.bigNum }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="relative gutter grid lg:grid-cols-[0.9fr_1.1fr] gap-8 items-center w-full">
                  <div>
                    <span className="flex items-center justify-center rounded-full mb-5" style={{ width: 60, height: 60, background: t.iconBg }}>
                      <EIcon k={`govia.eixo.${slug}.icone`} l={`Eixo "${e.titulo}" — ícone`} defaultSize={27}>
                        <Icon size={27} strokeWidth={2} color={t.iconColor} />
                      </EIcon>
                    </span>
                    <p className="mb-2" style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 11.5, letterSpacing: '2px', textTransform: 'uppercase', color: t.iconColor }}>
                      <ET k={`govia.eixo.${slug}.badge`} v={badgeTxt} l={`Eixo "${e.titulo}" — badge`} />
                    </p>
                    <h3 style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 'clamp(32px,4.2vw,58px)', lineHeight: 1.02, letterSpacing: '-0.8px', color: t.title }}>
                      <ERich k={`govia.eixo.${slug}.titulo`} l={`Eixo "${e.titulo}" — título`}>{e.titulo}</ERich>
                    </h3>
                  </div>
                  <div>
                    <p className="mb-5" style={{ fontFamily: 'Inter', fontSize: 'clamp(14px,1.1vw,16px)', lineHeight: '25px', color: t.desc, maxWidth: 520 }}>
                      <ERich k={`govia.eixo.${slug}.desc`} l={`Eixo "${e.titulo}" — descrição`} baseW={520}>{e.desc}</ERich>
                    </p>
                    <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2.5">
                      {e.itens.map((it, ii) => (
                        <li key={it} className="flex items-start gap-3">
                          <span className="mt-[8px] w-[5px] h-[5px] rounded-full shrink-0" style={{ background: t.iconColor }} />
                          <span style={{ fontFamily: 'Inter', fontSize: 13, lineHeight: '20px', color: t.desc }}>
                            <ET k={`govia.eixo.${slug}.item.${ii}`} v={it} l={`Eixo "${e.titulo}" — item ${ii + 1}`} />
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
          </div>
        </div>
      </div>

      <div className="relative pb-6 lg:pb-8 flex items-center justify-center gap-2 z-10 shrink-0">
        {EIXOS.map((_, i) => (
          <span
            key={i}
            ref={(el) => { dotsRef.current[i] = el; }}
            className="h-[7px] rounded-full transition-[width] duration-200"
            style={{ width: i === 0 ? 26 : 7, background: '#d2e718', opacity: i === 0 ? 1 : 0.35 }}
          />
        ))}
      </div>
    </section>
  );
}

/* Observatório — ativo exclusivo */
function SecObservatorio() {
  const ref = useReveal<HTMLElement>();
  const tilt = useTilt<HTMLDivElement>(3, 4);
  const [[degA, degB], degProps] = useEditColors('Observatório — fundo (gradiente)', [
    { key: 'govia.obs.bg.1', label: 'Observatório — fundo, cor 1', fallback: '#ffffff' },
    { key: 'govia.obs.bg.2', label: 'Observatório — fundo, cor 2', fallback: '#d2e718' },
  ]);
  return (
    <section id="govia-obs" ref={ref} className="py-24 lg:py-32 gutter" {...degProps} style={{ background: `linear-gradient(39.8deg, ${degA} 65.3%, ${degB} 99%)` }}>
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div ref={tilt} className="rounded-[20px] bg-navy p-8 lg:p-10" data-animate>
          <p className="mb-3" style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 11, letterSpacing: '2px', textTransform: 'uppercase', color: '#d2e718' }}>
            <ET k="govia.obs.esquerda.eyebrow" v="ATIVO EXCLUSIVO DO GOVIA" l="Observatório — selo (card escuro)" />
          </p>
          <h3 className="mb-5" style={{ fontFamily: 'Luxenta', fontWeight: 600, fontSize: 27, lineHeight: 1.15, color: '#fff' }}>
            <ERich k="govia.obs.esquerda.titulo" l="Observatório — título (card escuro)">Observatório de IA na Administração Pública</ERich>
          </h3>
          <p className="mb-7" style={{ fontFamily: 'Inter', fontSize: 15, lineHeight: '25px', color: 'rgba(255,255,255,0.8)' }}>
            <ERich k="govia.obs.esquerda.desc" l="Observatório — descrição (card escuro)">
              O primeiro mapeamento sistemático do uso de inteligência artificial na gestão pública brasileira. Dados inéditos, metodologia própria, atualizações periódicas — e comparativo futuro com a região metropolitana de Boston.
            </ERich>
          </p>
          <div className="flex gap-4 mb-8">
            <span className="rounded-full px-4 py-2" style={{ background: 'rgba(255,255,255,0.08)', fontFamily: 'Inter', fontSize: 12.5, color: '#fff' }}>
              <ERich k="govia.obs.pill.mg" l="Observatório — selo MG">
                <b style={{ color: '#d2e718' }}>MG</b> · Pesquisa em campo
              </ERich>
            </span>
            <span className="rounded-full px-4 py-2" style={{ background: 'rgba(255,255,255,0.08)', fontFamily: 'Inter', fontSize: 12.5, color: '#fff' }}>
              <ERich k="govia.obs.pill.2027" l="Observatório — selo 2027">
                <b style={{ color: '#d2e718' }}>2027</b> · Boston area
              </ERich>
            </span>
          </div>
          <div className="flex flex-wrap gap-4">
            <HubButton size="md" variant="lime" iconKey="govia.obs.cta.dados.icone" iconLabel="Observatório — botão Acessar dados, ícone" to="/insights" styleKey="govia.obs.cta.dados" styleLabel="Observatório — botão Acessar dados"><ET k="govia.obs.cta.dados" v="Acessar dados" l="Observatório — botão Acessar dados" /></HubButton>
            <HubButton size="md" variant="outline-light" iconKey="govia.obs.cta.relatorio.icone" iconLabel="Observatório — botão Baixar relatório, ícone" styleKey="govia.obs.cta.relatorio" styleLabel="Observatório — botão Baixar relatório" as="a" href={WHATSAPP_URL}><ET k="govia.obs.cta.relatorio" v="Baixar relatório" l="Observatório — botão Baixar relatório" /></HubButton>
          </div>
        </div>
        <div data-animate>
          <p className="mb-3" style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 11, letterSpacing: '2px', textTransform: 'uppercase', color: '#152852', opacity: 0.6 }}>
            <ET k="govia.obs.direita.eyebrow" v="POR QUE O OBSERVATÓRIO IMPORTA" l="Observatório — selo (coluna clara)" />
          </p>
          <h3 className="mb-5" style={{ fontFamily: 'Luxenta', fontWeight: 600, fontSize: 27, lineHeight: 1.15, color: '#152852' }}>
            <ERich k="govia.obs.direita.titulo" l="Observatório — título (coluna clara)">Dados que geram autoridade e mídia espontânea.</ERich>
          </h3>
          <p className="mb-6" style={{ fontFamily: 'Inter', fontSize: 15.5, lineHeight: '26px', color: 'rgba(21,40,82,0.8)' }}>
            <ERich k="govia.obs.direita.desc" l="Observatório — descrição (coluna clara)">
              O Observatório de IA é o principal mecanismo de geração de mídia espontânea do HUB PAN no lançamento — um ativo de dados inéditos que abre portas para cobertura jornalística, convites para eventos e relações institucionais.
            </ERich>
          </p>
          <ul className="space-y-3">
            {OBS_DADOS.map((d, i) => (
              <li key={d} className="flex items-start gap-3">
                <span className="mt-[9px] w-[6px] h-[6px] rounded-full shrink-0" style={{ background: '#152852' }} />
                <span style={{ fontFamily: 'Inter', fontSize: 14.5, lineHeight: '23px', color: '#152852' }}>
                  <ET k={`govia.obs.dado.${i}`} v={d} l={`Observatório — dado ${i + 1}`} />
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* Planos e preços */
function PlanoCard({ p }: { p: (typeof PLANOS)[number] }) {
  const tilt = useTilt<HTMLDivElement>(4, 6);
  const isDark = p.bg === '#152852';
  const [bg, bgProps] = useEditColor(`govia.plano.${p.id}.bg`, p.bg, `Plano "${p.nome}" — fundo do card`);
  return (
    <div
      ref={tilt}
      className="relative flex flex-col rounded-[20px] p-8"
      {...bgProps}
      style={{ background: bg, border: p.border ? '1px solid #ecedf0' : undefined }}
      data-animate
    >
      {p.tag && (
        <span className="absolute -top-3 left-8 rounded-full px-4 py-1" style={{ background: '#d2e718', fontFamily: 'Inter', fontWeight: 600, fontSize: 11, letterSpacing: '1px', textTransform: 'uppercase', color: '#152852' }}>
          <ET k={`govia.plano.${p.id}.tag`} v={p.tag} l={`Plano "${p.nome}" — selo`} />
        </span>
      )}
      <p className="mt-2 mb-1" style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 12, letterSpacing: '1.6px', textTransform: 'uppercase', color: isDark ? 'rgba(255,255,255,0.55)' : '#a7a4a4' }}>
        <ET k={`govia.plano.${p.id}.sub`} v={p.sub} l={`Plano "${p.nome}" — subtítulo`} />
      </p>
      <h3 className="mb-3" style={{ fontFamily: 'Luxenta', fontWeight: 600, fontSize: 30, lineHeight: 1.05, color: isDark ? '#fff' : '#152852' }}>
        <ET k={`govia.plano.${p.id}.nome`} v={p.nome} l={`Plano "${p.nome}" — nome`} />
      </h3>
      <p className="mb-7" style={{ fontFamily: 'Inter', fontSize: 14, lineHeight: '23px', color: isDark ? 'rgba(255,255,255,0.75)' : '#797979' }}>
        <ERich k={`govia.plano.${p.id}.desc`} l={`Plano "${p.nome}" — descrição`}>{p.desc}</ERich>
      </p>
      <p className="mb-4" style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 11, letterSpacing: '1.6px', textTransform: 'uppercase', color: isDark ? '#d2e718' : '#2d4ebf' }}>
        <ET k={`govia.plano.${p.id}.inclui_label`} v={p.incluiLabel} l={`Plano "${p.nome}" — rótulo "inclui"`} />
      </p>
      <ul className="space-y-3 mb-8 flex-1">
        {p.inclui.map((it, i) => (
          <li key={it} className="flex items-start gap-3">
            <Check size={16} strokeWidth={2.5} color={isDark ? '#d2e718' : '#2d4ebf'} className="mt-[3px] shrink-0" />
            <span style={{ fontFamily: 'Inter', fontSize: 14, lineHeight: '22px', color: isDark ? 'rgba(255,255,255,0.9)' : '#152852' }}>
              <ET k={`govia.plano.${p.id}.item.${i}`} v={it} l={`Plano "${p.nome}" — item ${i + 1}`} />
            </span>
          </li>
        ))}
      </ul>
      <HubButton size="md" variant={p.variant} className="w-full justify-center" iconKey={`govia.plano.${p.id}.cta.icone`} iconLabel={`Plano "${p.nome}" — botão, ícone`} styleKey={`govia.plano.${p.id}.cta`} styleLabel={`Plano "${p.nome}" — botão`} onClick={() => ScrollSmoother.get()?.scrollTo('#govia-form', true)}>
        <ET k={`govia.plano.${p.id}.cta`} v="Solicitar proposta" l={`Plano "${p.nome}" — botão`} />
      </HubButton>
    </div>
  );
}

function SecPlanos() {
  const ref = useReveal<HTMLElement>();
  const [bg, bgProps] = useEditColor('govia.planos.bg', '#f5f5f5', 'Planos e preços — fundo da seção');
  return (
    <section id="govia-planos" ref={ref} className="py-24 lg:py-32 gutter" {...bgProps} style={{ background: bg }}>
      <div className="mb-14 max-w-[720px]">
        <p className="eyebrow text-muted mb-6" data-animate>
          <ET k="govia.planos.eyebrow" v="PLANOS E PREÇOS" l="Planos — selo" />
        </p>
        <h2 className="mb-4" style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 'clamp(32px,4vw,50px)', letterSpacing: '-0.5px', lineHeight: 1, color: '#152852' }} data-animate>
          <ERich k="govia.planos.titulo" l="Planos — título">Um modelo desenhado para a realidade do setor público.</ERich>
        </h2>
        <p style={{ fontFamily: 'Inter', fontSize: 16, lineHeight: '27px', color: '#797979' }} data-animate>
          <ERich k="govia.planos.sub" l="Planos — texto de apoio">Contratação via nota de empenho, dispensa de licitação e mecanismos do setor público. Sem cartão de crédito.</ERich>
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-4 mb-8">
        {PLANOS.map((p) => <PlanoCard key={p.nome} p={p} />)}
      </div>
      <p style={{ fontFamily: 'Inter', fontSize: 13.5, color: '#a7a4a4' }} data-animate>
        <ERich k="govia.planos.nota" l="Planos — nota de rodapé">Todos os planos podem ser contratados via nota de empenho, dispensa de licitação e outros mecanismos do setor público.</ERich>
      </p>
    </section>
  );
}

/* Demo gratuita + formulário */
function SecDemo() {
  const ref = useReveal<HTMLElement>();
  const [bg, bgProps] = useEditColor('govia.demo.bg', '#ffffff', 'Demonstração — fundo da seção');
  return (
    <section id="govia-form" ref={ref} className="py-24 lg:py-32 gutter" {...bgProps} style={{ background: bg }}>
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
        <div>
          <p className="eyebrow text-muted mb-6" data-animate>
            <ET k="govia.demo.eyebrow" v="DEMONSTRAÇÃO GRATUITA" l="Demonstração — selo" />
          </p>
          <h2 className="mb-5" style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 'clamp(28px,3.4vw,42px)', letterSpacing: '-0.5px', lineHeight: 1.05, color: '#152852' }} data-animate>
            <ERich k="govia.demo.titulo" l="Demonstração — título">Veja o GovIA em ação no seu município.</ERich>
          </h2>
          <p className="mb-4" style={{ fontFamily: 'Inter', fontSize: 16, lineHeight: '27px', color: '#797979' }} data-animate>
            <ERich k="govia.demo.texto1" l="Demonstração — parágrafo 1">
              Em 30 minutos, nossa equipe apresenta o GovIA com foco nas dores específicas da sua gestão — ferramentas, formação e dados do Observatório aplicados ao seu contexto.
            </ERich>
          </p>
          <p className="mb-9" style={{ fontFamily: 'Inter', fontSize: 16, lineHeight: '27px', color: '#797979' }} data-animate>
            <ERich k="govia.demo.texto2" l="Demonstração — parágrafo 2">
              Sem compromisso de contratação. Sem cartão de crédito. Apenas uma conversa técnica para você entender o que o GovIA pode fazer pela sua gestão.
            </ERich>
          </p>
          <div className="space-y-5">
            {DEMO_BENEFICIOS.map(({ slug, Icon, titulo, desc }) => (
              <div key={slug} className="flex items-center gap-4" data-animate>
                <span className="flex items-center justify-center rounded-full shrink-0" style={{ width: 44, height: 44, background: '#f5f5f5' }}>
                  <EIcon k={`govia.demo.beneficio.${slug}.icone`} l={`Demonstração — benefício "${titulo}", ícone`} defaultSize={20}>
                    <Icon size={20} strokeWidth={2} color="#2d4ebf" />
                  </EIcon>
                </span>
                <div>
                  <p style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 14.5, color: '#152852' }}>
                    <ET k={`govia.demo.beneficio.${slug}.titulo`} v={titulo} l={`Demonstração — benefício "${titulo}", título`} />
                  </p>
                  <p style={{ fontFamily: 'Inter', fontSize: 13, color: '#a7a4a4' }}>
                    <ERich k={`govia.demo.beneficio.${slug}.desc`} l={`Demonstração — benefício "${titulo}", descrição`}>{desc}</ERich>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <form className="rounded-[20px] p-8 lg:p-9" style={{ background: '#f5f5f5' }} onSubmit={(e) => e.preventDefault()} data-animate>
          <h3 className="mb-2" style={{ fontFamily: 'Luxenta', fontWeight: 600, fontSize: 22, lineHeight: 1.1, color: '#152852' }}>
            <ET k="govia.demo.form.titulo" v="Solicitar demonstração" l="Demonstração — título do formulário" />
          </h3>
          <p className="mb-6" style={{ fontFamily: 'Inter', fontSize: 13.5, color: '#a7a4a4' }}>
            <ET k="govia.demo.form.sub" v="Nossa equipe entra em contato em até 1 dia útil." l="Demonstração — subtítulo do formulário" />
          </p>
          <div className="space-y-4">
            <input placeholder="Nome completo e cargo" style={INPUT_STYLE} />
            <input placeholder="Município / Estado / Esfera" style={INPUT_STYLE} />
            <div className="grid sm:grid-cols-2 gap-4">
              <input placeholder="E-mail institucional" style={INPUT_STYLE} />
              <input placeholder="Telefone" style={INPUT_STYLE} />
            </div>
            <select defaultValue="" style={{ ...INPUT_STYLE, color: '#152852' }}>
              <option value="" disabled>Principal necessidade</option>
              {NECESSIDADES.map((n) => <option key={n}>{n}</option>)}
            </select>
            <input placeholder="Quantos servidores seriam beneficiados?" style={INPUT_STYLE} />
            <HubButton size="md" variant="blue" className="w-full justify-center" iconKey="govia.demo.form.botao.icone" iconLabel="Demonstração — botão do formulário, ícone" styleKey="govia.demo.form.botao" styleLabel="Demonstração — botão do formulário" noLink>
              <ET k="govia.demo.form.botao" v="Agendar demonstração gratuita" l="Demonstração — botão do formulário" />
            </HubButton>
            <p className="text-center" style={{ fontFamily: 'Inter', fontSize: 12.5, color: '#a7a4a4' }}>
              <ET k="govia.demo.form.nota" v="Sem compromisso · Resposta em até 1 dia útil · 100% online" l="Demonstração — nota do formulário" />
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}

function SecEcossistema() {
  const [bg, bgProps] = useEditColor('govia.eco.bg', '#ffffff', 'Ecossistema — fundo da seção');
  return (
    <section id="govia-ecossistema" className="py-16 gutter" {...bgProps} style={{ background: bg }}>
      <p className="mb-6" style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 12, letterSpacing: '1.6px', textTransform: 'uppercase', color: '#a7a4a4' }}>
        <ET k="govia.eco.eyebrow" v="TAMBÉM NO ECOSSISTEMA HUB PAN" l="Ecossistema — selo" />
      </p>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {ECOSSISTEMA.map((e) => {
          const c = ECO_COLORS[e.color];
          const slug = e.to.replace(/^\//, '');
          return (
            <Link key={e.t} to={e.to} className="group rounded-[16px] p-5 flex flex-col justify-between h-[110px] transition-transform duration-300 hover:-translate-y-1" style={{ background: c.bg }}>
              <span style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 12, letterSpacing: '1px', color: c.sub }}>
                <ET k={`govia.eco.${slug}.tag`} v={e.tag} l={`Ecossistema — "${e.t}", selo`} />
              </span>
              <span style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 13.5, lineHeight: '19px', color: c.text }}>
                <ET k={`govia.eco.${slug}.titulo`} v={e.t} l={`Ecossistema — "${e.t}", título`} />
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

/**
 * Acordeão de FAQ local — réplica visual/funcional de `components/FAQAccordion`,
 * recriada aqui (não a componente compartilhada) só pra poder envolver
 * pergunta/resposta com ET/ERich e torná-las editáveis pelo painel.
 */
function GovIAFAQAccordion() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div>
      {FAQ.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.slug} className="border-b border-gray200">
            <button
              className="w-full flex items-center justify-between gap-6 py-5 text-left"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
            >
              <span style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 17, color: '#152852' }}>
                <ET k={`govia.faq.${item.slug}.q`} v={item.q} l={`FAQ — pergunta "${item.q}"`} />
              </span>
              <span
                className="shrink-0 flex items-center justify-center rounded-full transition-colors duration-200"
                style={{
                  width: 28, height: 28,
                  border: isOpen ? 'none' : '1.5px solid #a7a4a4',
                  background: isOpen ? '#152852' : 'transparent',
                  color: isOpen ? '#d2e718' : '#797979',
                  fontFamily: 'Inter', fontSize: 16, lineHeight: 1,
                }}
              >
                {isOpen ? '−' : '+'}
              </span>
            </button>
            <div
              className="overflow-hidden transition-[max-height] duration-300 ease-out"
              style={{ maxHeight: isOpen ? 400 : 0 }}
            >
              <p className="pb-6" style={{ fontFamily: 'Inter', fontSize: 15, lineHeight: '26px', color: '#797979', maxWidth: 720 }}>
                <ERich k={`govia.faq.${item.slug}.a`} l={`FAQ — resposta "${item.q}"`}>{item.a}</ERich>
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function SecFAQ() {
  const ref = useReveal<HTMLElement>();
  const [bg, bgProps] = useEditColor('govia.faq.bg', '#ffffff', 'FAQ — fundo da seção');
  return (
    <section ref={ref} id="govia-faq" className="py-24 lg:py-32 gutter" {...bgProps} style={{ background: bg }}>
      <div className="grid lg:grid-cols-[1fr_1.4fr] gap-12">
        <div>
          <p className="eyebrow text-muted mb-6" data-animate>
            <ET k="govia.faq.eyebrow" v="PERGUNTAS FREQUENTES" l="FAQ — selo" />
          </p>
          <h2 className="mb-4" style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 'clamp(32px,4vw,50px)', letterSpacing: '-0.5px', lineHeight: 1, color: '#152852' }} data-animate>
            <ERich k="govia.faq.titulo" l="FAQ — título">O que gestores públicos mais perguntam sobre o GovIA.</ERich>
          </h2>
          <p style={{ fontFamily: 'Inter', fontSize: 16, lineHeight: '27px', color: '#797979' }} data-animate>
            <ERich k="govia.faq.sub" l="FAQ — texto de apoio">Respostas diretas para prefeituras, estados e consórcios que querem entender como o GovIA funciona na prática.</ERich>
          </p>
        </div>
        <div data-animate>
          <GovIAFAQAccordion />
        </div>
      </div>
    </section>
  );
}

/* ═══════════ Página ═══════════ */

function GovIAHero() {
  const heroImgSpec = { w: 2400, h: 1500, shape: 'paisagem' as const, note: 'Fica atrás de um overlay escuro com o texto do hero por cima.' };
  const [heroImg] = useEditImage('govia.hero.bg', '/images/s8-governanca-bg.webp', 'Hero — imagem de fundo', heroImgSpec);
  const [stripBg, stripBgProps] = useEditColor('govia.hero.strip.bg', STRIP_THEMES.navy.bg, 'Hero — fundo da faixa de números');
  return (
    <div style={{ position: 'relative' }}>
      <Hero80
        id="govia-hero"
        img={heroImg}
        imgAlt="Prédio institucional"
        eyebrow={<ET k="govia.hero.eyebrow" v="PLATAFORMA DE IA PARA O SETOR PÚBLICO · ASSINATURA INSTITUCIONAL · OBSERVATÓRIO" l="Hero — eyebrow" />}
        title={<ERich k="govia.hero.titulo" l="Hero — título">GovIA</ERich>}
        sub={<ERich k="govia.hero.sub" l="Hero — subtítulo">A primeira plataforma de inteligência artificial desenvolvida especificamente para municípios, estados e consórcios públicos brasileiros. Acesso a ferramentas, formação de servidores, conteúdo especializado e o Observatório de IA — tudo em uma assinatura institucional sem cartão de crédito.</ERich>}
        actions={<>
          <HubButton size="lg" variant="lime" onClick={() => ScrollSmoother.get()?.scrollTo('#govia-form', true)} iconKey="govia.hero.cta.demo.icone" iconLabel="Hero — botão Solicitar demonstração, ícone" styleKey="govia.hero.cta.demo" styleLabel="Hero — botão Solicitar demonstração"><ET k="govia.hero.cta.demo" v="Solicitar demonstração" l="Hero — botão Solicitar demonstração" /></HubButton>
          <HubButton size="lg" variant="blue" onClick={() => ScrollSmoother.get()?.scrollTo('#govia-planos', true)} iconKey="govia.hero.cta.planos.icone" iconLabel="Hero — botão Ver planos, ícone" styleKey="govia.hero.cta.planos" styleLabel="Hero — botão Ver planos"><ET k="govia.hero.cta.planos" v="Ver planos" l="Hero — botão Ver planos" /></HubButton>
          <HubButton size="lg" variant="outline-light" onClick={() => ScrollSmoother.get()?.scrollTo('#govia-obs', true)} iconKey="govia.hero.cta.observatorio.icone" iconLabel="Hero — botão Observatório de IA, ícone" styleKey="govia.hero.cta.observatorio" styleLabel="Hero — botão Observatório de IA"><ET k="govia.hero.cta.observatorio" v="Observatório de IA" l="Hero — botão Observatório de IA" /></HubButton>
        </>}
        stats={STATS}
        strip={{ ...STRIP_THEMES.navy, bg: stripBg }}
        stripProps={stripBgProps}
      />
      <BgEditChip k="govia.hero.bg" v="/images/s8-governanca-bg.webp" l="Hero — imagem de fundo" spec={heroImgSpec} style={{ top: 24, right: 24 }} />
    </div>
  );
}

export default function GovIA() {
  return (
    <>
      <GovIAHero />
      <SecProblema />
      <SecEixos />
      <SecObservatorio />
      <SecPlanos />
      <SecDemo />
      <SecEcossistema />
      <SecFAQ />
    </>
  );
}
