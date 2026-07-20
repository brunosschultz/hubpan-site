import { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import {
  Landmark, GraduationCap, Building2, Scale, BrainCircuit, Globe2, ShieldCheck, HeartHandshake, FileCheck2, MapPin, Rocket,
} from 'lucide-react';
import FAQAccordion from '../../components/FAQAccordion';
import CTABanner from '../../components/CTABanner';
import HubButton from '../../components/HubButton';
import { useReveal, useRevealBidirectional } from '../../components/useReveal';
import { useTilt } from '../../components/useTilt';
import { BgEditChip, EIcon, EImg, ERich, ET, useEditColor, useEditColors, useEditImage } from '../../editor/fields';

gsap.registerPlugin(ScrollTrigger);

/* ═══════════ Dados ═══════════ */

const STATS: { id: string; value: number | string; prefix?: string; label: string; lime?: boolean }[] = [
  { id: 'edicoes-realizadas', value: 15, label: 'Edições realizadas' },
  { id: 'anos-trajetoria', value: 10, label: 'Anos de trajetória' },
  { id: 'edicoes-ny', value: 4, label: 'Edições em Nova York' },
  { id: 'territorios-estrategicos', value: 6, label: 'Territórios estratégicos' },
  { id: 'projetos-abrigados', value: 100, prefix: '+', label: 'Projetos abrigados' },
  { id: 'presenca-institucional', value: 'ONU', label: 'Presença institucional', lime: true },
];

const FUNDADORAS = [
  {
    id: 'brasil-master',
    Icon: Landmark, tag: 'LEGADO · ORIGEM', nome: 'Brasil Master® Group',
    bg: '#152852', text: '#fff', sub: 'rgba(255,255,255,0.75)', iconBg: 'rgba(255,255,255,0.1)', iconColor: '#d2e718', tagColor: 'rgba(255,255,255,0.6)',
    desc: 'Base histórica e credencial de tudo que o HUB PAN representa. Quase uma década de fóruns, programas, relações e entregas documentadas.',
    bullets: ['Marca registrada no INPI', 'Origem do Fórum Pan-Americano da Inovação', 'Histórico desde 2017 em Belo Horizonte', 'Credencial de 15 edições realizadas'],
  },
  {
    id: 'premier-niveau',
    Icon: GraduationCap, tag: 'EDUCAÇÃO · EXCELÊNCIA', nome: 'Premier Niveau®',
    bg: '#fff', text: '#152852', sub: '#797979', iconBg: '#f5f5f5', iconColor: '#2d4ebf', tagColor: '#a7a4a4',
    desc: 'A frente educacional de alto padrão do ecossistema. Extensão universitária, pós-graduação lato sensu, educação executiva e formação com diferenciais acadêmicos reais.',
    bullets: ['Marca registrada no INPI', 'Programas de extensão e pós-graduação', 'Rede de formadores e especialistas', 'Base que originou o HUB PAN Academy'],
  },
  {
    id: 'egov-tecnologia',
    Icon: Building2, tag: 'GOVTECH · INOVAÇÃO PÚBLICA', nome: 'eGov Tecnologia®',
    bg: '#2d4ebf', text: '#fff', sub: 'rgba(255,255,255,0.8)', iconBg: 'rgba(255,255,255,0.12)', iconColor: '#d2e718', tagColor: 'rgba(255,255,255,0.6)',
    desc: 'A origem em inovação governamental e transformação digital do setor público. O nicho que deu origem ao GovIA como produto escalável.',
    bullets: ['Marca registrada no INPI', 'Experiência real com municípios e estados', 'Base técnica do GovIA', 'Conexão com o Fórum Pan-Americano'],
  },
];

type Tile = {
  id: string; img: string; tag: string; nome: string; desc: string;
  kind: 'photocard' | 'image' | 'typo';
  color?: 'navy' | 'blue' | 'lime' | 'white';
  Icon?: typeof MapPin;
};

const TERRITORIOS: Tile[] = [
  {
    id: 'cambridge', kind: 'photocard', img: 'inst-cambridge-harvard', tag: 'SEDE GLOBAL · AUTORIDADE', nome: 'Cambridge / Harvard Square',
    desc: 'Sede global do HUB PAN. O metro quadrado de inovação mais disputado das Américas, no entorno de Harvard e MIT. Ancoragem de autoridade máxima em um único endereço.',
  },
  {
    id: 'africa', kind: 'photocard', img: 's3-accordion-forum', tag: 'COOPERAÇÃO · MIPAD · FUTURO', nome: 'África',
    desc: 'Eixo pan-africano ativado pela parceria com o MIPAD, vinculado à ONU. Liderança, afroempreendedorismo e cooperação Sul-Sul como pilares estratégicos.',
  },
  {
    id: 'belo-horizonte', kind: 'typo', color: 'navy', Icon: MapPin, img: 's6-numero-3', tag: 'ORIGEM · DESDE 2017', nome: 'Belo Horizonte',
    desc: 'Marco zero do ecossistema. Primeira cidade brasileira a conectar ODS com Smart Cities em um fórum estruturado.',
  },
  {
    id: 'sao-paulo', kind: 'typo', color: 'blue', Icon: Building2, img: 'inst-sao-paulo', tag: 'SEDE BRASIL · 2026', nome: 'São Paulo',
    desc: 'Sede brasileira ancorada na Avenida Paulista — centro econômico e institucional do Brasil.',
  },
  {
    id: 'boston', kind: 'typo', color: 'white', Icon: Rocket, img: 'inst-boston-mit', tag: 'INOVAÇÃO · TECH', nome: 'Boston',
    desc: 'Sede da 1ª Expo Boston (maio 2026) e futuro host do Fórum Mundial de IA em 2027.',
  },
  {
    id: 'nova-york', kind: 'typo', color: 'lime', Icon: Landmark, img: 'inst-nyc-onu', tag: 'DIPLOMACIA · ONU', nome: 'Nova York',
    desc: 'Quatro edições realizadas. Em novembro de 2026, o 4º andar inteiro das Nações Unidas — no Delegates Dining Room.',
  },
];

const TIMELINE = [
  { id: '2017-expo-bh', ano: '2017', quando: 'Dezembro', titulo: '1ª edição EXPO BH — Belo Horizonte', major: true, desc: 'Marco zero. Sem precedentes no Brasil de conexão entre ODS e Smart Cities em um fórum estruturado.' },
  { id: '2018-expansao-forum', ano: '2018', quando: '2018–2019', titulo: 'Expansão do Fórum Pan-Americano', major: false, desc: 'Consolidação do modelo em Belo Horizonte. Crescimento de participantes, projetos abrigados e relações institucionais.' },
  { id: '2020-extensao-pos', ano: '2020', quando: '2020–2022', titulo: 'Extensão universitária e pós-graduação', major: false, desc: 'Primeiro ciclo de LTV real. Programas de extensão e pós-graduação lato sensu. Construção da carteira educacional que sustenta o PROINTER.' },
  { id: '2023-harvard-mit', ano: '2023', quando: '2023', titulo: 'Harvard Square e MIT — Cambridge, MA', major: false, desc: 'Chegada ao ecossistema de inovação de Cambridge. Ancoragem como sede global.' },
  { id: '2024-onu', ano: '2024', quando: '2024', titulo: '1ª entrada nas Nações Unidas · Nova York', major: true, desc: 'Primeiro contato real com o ambiente interno da ONU — mapeamento, relações e Top 100 da ONU.' },
  { id: '2026-expo-boston', ano: '2026', quando: 'Maio 2026', titulo: '1ª Expo Boston · Contrato do 4º andar da ONU', major: false, desc: 'Primeira edição fora do Brasil e de Nova York. Fechamento do contrato para ocupar o 4º andar inteiro das Nações Unidas.' },
  { id: '2026-portal', ano: '2026', quando: 'Junho 2026', titulo: 'Lançamento do Portal HUB PAN', major: true, desc: 'O ecossistema se torna uma plataforma global. Portal, sede SP na Paulista, parceria MIPAD ONU e campanha do Fórum Mundial de IA.' },
  { id: '2027-forum-ia', ano: '2027', quando: 'Próximo capítulo', titulo: 'Fórum Mundial de Inteligência Artificial', major: true, desc: 'Cambridge, Massachusetts. O maior ativo proprietário do HUB PAN — autoridade global em IA em escala internacional.' },
];

const GOVERNANCA = [
  { id: 'institucional', Icon: Scale, titulo: 'Governança Institucional', desc: 'Estrutura formal de decisão, critérios de admissão de parceiros e prestação de contas públicos e rastreáveis.' },
  { id: 'academica', Icon: GraduationCap, titulo: 'Governança Acadêmica', desc: 'Validação de programas educacionais, seleção de bolsistas do PROINTER e supervisão de conteúdo da Academy.' },
  { id: 'ia', Icon: BrainCircuit, titulo: 'Governança de IA', desc: 'IA responsável centrada nas pessoas e alinhada aos ODS. Política de dados e transparência algorítmica.' },
  { id: 'programas', Icon: Globe2, titulo: 'Governança de Programas', desc: 'Critérios de seleção, gestão de recursos e rastreabilidade de impacto para missões e fóruns internacionais.' },
  { id: 'compliance', Icon: ShieldCheck, titulo: 'Compliance e Integridade', desc: 'Alinhamento com marcos regulatórios nacionais e internacionais. Proteção de propriedade intelectual.' },
  { id: 'impacto', Icon: HeartHandshake, titulo: 'Princípios de Impacto', desc: 'ODS da ONU como critério de avaliação. Diversidade, equidade e inclusão como valores não negociáveis.' },
];

const MARCAS = ['Brasil Master® Group', 'Premier Niveau®', 'eGov Tecnologia®', 'EXPO BH®', 'EXPO NYC®'];

const FAQ_RAW = [
  { id: 'empresa-ou-marca', q: 'O HUB PAN é uma nova empresa ou uma nova marca?', a: 'Nem um nem outro exclusivamente. O HUB PAN é a nova narrativa global de um ecossistema que já existe há quase dez anos. As marcas operacionais continuam ativas (Brasil Master, Premier Niveau, eGov), mas o HUB PAN é a identidade unificadora que comunica a dimensão real do conjunto — para o mercado global.' },
  { id: 'academy-vs-digital', q: 'Qual é a diferença entre HUB PAN Academy e HUB PAN Digital?', a: 'Academy é o que você aprende — formação, cursos, trilhas, extensão, pós-graduação, comunidades educacionais e certificações. Digital é onde você acessa — portal, aplicativo, AVA, área do aluno, biblioteca e infraestrutura técnica do ecossistema. São complementares, não redundantes.' },
  { id: 'historico-ou-construcao', q: 'O HUB PAN já tem histórico ou ainda está em construção?', a: 'O histórico é extenso e documentado: 15 edições do Fórum Pan-Americano da Inovação, 4 edições em Nova York, 1 edição em Boston, entrada na ONU, ancoragem em Harvard Square, centenas de projetos abrigados desde 2017. O HUB PAN é a nova narrativa desse histórico — não uma promessa vazia.' },
  { id: 'como-conectar', q: 'Como se conectar ao ecossistema?', a: 'Depende do seu perfil. Governos entram pelo GovIA. Empresas e investidores pelo Fórum Mundial de IA ou pela HUB PAN Alliance. Educadores e profissionais pelo PROINTER ou pela Academy. Qualquer perfil pode começar pelo formulário de contato institucional.' },
  { id: 'o-que-e-alliance', q: 'O que é a HUB PAN Alliance?', a: 'A Alliance é a rede estratégica de organizações do ecossistema — empresas, startups, universidades, ICTs e governos que fazem parte da comunidade HUB PAN com acesso a networking institucional, missões internacionais, visibilidade global e colaboração em projetos de impacto.' },
];

const FAQ = FAQ_RAW.map((f) => ({
  q: <ET k={`inst.faq.${f.id}.q`} v={f.q} l={`FAQ — pergunta (${f.id})`} />,
  a: <ERich k={`inst.faq.${f.id}.a`} l={`FAQ — resposta (${f.id})`}>{f.a}</ERich>,
}));

/* ═══════════ Contador animado ═══════════ */

function Counter({ value, prefix = '' }: { value: number; prefix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((es) => {
      if (es.some((e) => e.isIntersecting)) {
        io.disconnect();
        const obj = { v: 0 };
        gsap.to(obj, {
          v: value, duration: 1.4, ease: 'power2.out', delay: 0.15,
          onUpdate: () => { el.textContent = prefix + String(Math.round(obj.v)); },
        });
      }
    });
    io.observe(el);
    return () => io.disconnect();
  }, [value, prefix]);
  return <span ref={ref}>{prefix}0</span>;
}

/* ═══════════ Hero 80vh + faixa de números 20vh ═══════════ */

function HeroInst() {
  const ref = useReveal<HTMLElement>();
  const [bgSrc, bgImgProps] = useEditImage(
    'inst.hero.bg', '/images/inst-hero-onu.webp', 'Hero institucional — imagem de fundo',
    { w: 2400, h: 1600, shape: 'paisagem', note: 'Fica atrás de um degradê escuro com texto branco por cima — prefira fotos com boa área escura à esquerda.' }
  );
  const [stripBg, stripBgProps] = useEditColor('inst.stats.bg', '#060919', 'Faixa de números — fundo');
  return (
    <section ref={ref} className="relative w-full">
      <div className="relative w-full h-[80vh] min-h-[560px] flex items-center overflow-hidden">
        <img src={bgSrc} alt="Delegação do HUB PAN na sede da ONU em Nova York" className="absolute inset-0 w-full h-full object-cover" {...bgImgProps} />
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(90deg, rgba(6,9,25,0.93) 0%, rgba(6,9,25,0.72) 45%, rgba(6,9,25,0.35) 100%)' }} />
        <div className="absolute inset-x-0 bottom-0 h-40 pointer-events-none" style={{ background: 'linear-gradient(to top, rgba(6,9,25,0.9), transparent)' }} />
        <BgEditChip
          k="inst.hero.bg" v="/images/inst-hero-onu.webp" l="Hero institucional — imagem de fundo"
          spec={{ w: 2400, h: 1600, shape: 'paisagem', note: 'Fica atrás de um degradê escuro com texto branco por cima — prefira fotos com boa área escura à esquerda.' }}
          style={{ bottom: 24, right: 24 }}
        />

        <div className="relative gutter w-full pt-[150px] lg:pt-[190px] pb-12">
          {/* Rótulo no padrão do hero da home: Inter 500 13px, tracking 5.85px, branco 50% */}
          <p className="text-[13px] font-medium uppercase mb-6" style={{ fontFamily: 'Inter', letterSpacing: '5.85px', color: 'rgba(255,255,255,0.5)' }} data-animate>
            <ET k="inst.hero.eyebrow" v="QUEM SOMOS · LEGADO · PROPÓSITO · PRESENÇA GLOBAL" l="Hero institucional — selo" />
          </p>
          {/* Quebras manuais de melhor encaixe — padrão para os H1 das páginas internas */}
          <h1 className="mb-7 text-white" style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 'clamp(32px, 3vw + 18px, 62px)', lineHeight: 1, letterSpacing: '-1.2px' }} data-animate>
            <ERich k="inst.hero.titulo" l="Hero institucional — título">
              Uma narrativa global<br />
              construída sobre uma<br />
              <span style={{ color: '#d2e718' }}>década de entregas reais.</span>
            </ERich>
          </h1>
          <p className="mb-9" style={{ fontFamily: 'Inter', fontSize: 17, lineHeight: '29px', color: '#d6d6d6', maxWidth: 660 }} data-animate>
            <ERich k="inst.hero.desc" l="Hero institucional — texto de apoio" baseW={660}>
              O HUB PAN não nasce do zero. Nasce da convergência de tudo que o ecossistema Brasil Master, Premier Niveau e eGov Tecnologia construiu e validou em quase dez anos de trabalho real.
            </ERich>
          </p>
          <div className="flex flex-wrap gap-4" data-animate>
            <Link to="/contato"><HubButton size="lg" variant="lime"><ET k="inst.hero.btn.principal" v="Fale com nossa equipe" l="Hero institucional — botão principal" /></HubButton></Link>
            <HubButton size="lg" variant="blue" onClick={() => ScrollSmoother.get()?.scrollTo('#inst-manifesto', true)}>
              <ET k="inst.hero.btn.secundario" v="Leia o manifesto" l="Hero institucional — botão secundário" />
            </HubButton>
          </div>
        </div>
      </div>

      <div className="w-full border-t border-white/10 h-[20vh] min-h-[150px] flex items-center" {...stripBgProps} style={{ background: stripBg }}>
        <div className="gutter w-full">
          <div className="grid grid-cols-3 lg:grid-cols-6 gap-y-6">
            {STATS.map((s, i) => (
              <div key={s.id} className={`text-center px-2 ${i > 0 ? 'lg:border-l lg:border-white/10' : ''}`}>
                <p style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 'clamp(34px, 3vw, 56px)', lineHeight: 1, color: s.lime ? '#d2e718' : '#fff' }}>
                  <ERich k={`inst.stats.${s.id}.valor`} l={`Faixa de números — valor "${s.label}"`}>
                    {typeof s.value === 'number' ? <Counter value={s.value} prefix={s.prefix} /> : s.value}
                  </ERich>
                </p>
                <p className="mt-2" style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 10.5, letterSpacing: '1.6px', textTransform: 'uppercase', color: '#a7a4a4' }}>
                  <ET k={`inst.stats.${s.id}.label`} v={s.label} l={`Faixa de números — rótulo "${s.label}"`} />
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════ Manifesto — 100vh no estilo da S2 da home (persona + degradê lime) ═══════════ */

function SecManifesto() {
  const ref = useReveal<HTMLElement>();
  const [[c1, c2], gradProps] = useEditColors('Manifesto — degradê de fundo', [
    { key: 'inst.manifesto.grad.1', label: 'Manifesto — cor 1 do degradê', fallback: '#ffffff' },
    { key: 'inst.manifesto.grad.2', label: 'Manifesto — cor 2 do degradê', fallback: '#d2e718' },
  ]);
  return (
    <section ref={ref} id="inst-manifesto" className="bg-white">
      <div
        className="relative w-full overflow-hidden"
        {...gradProps}
        style={{ background: `linear-gradient(213deg, ${c1} 55%, ${c2} 100%)` }}
      >
        {/* Alturas explícitas por coluna — grid com stretch deixava o conteúdo "estufar"
            a linha e deslocar tudo pra baixo (mesmo bug corrigido na S2 da home) */}
        <div className="relative grid lg:grid-cols-2">
          {/* Persona — alinhada na base, como na home */}
          <div className="relative order-2 lg:order-1 h-[420px] lg:h-screen flex items-end justify-center">
            {/* Rótulo vertical */}
            <span
              className="hidden lg:block absolute left-0 top-[42%] -translate-y-1/2 whitespace-nowrap"
              style={{ fontFamily: 'Luxenta', fontWeight: 500, fontSize: 20, letterSpacing: '5.2px', color: '#152852', transform: 'rotate(-90deg)' }}
            >
              <ET k="inst.manifesto.selo" v="MANIFESTO · 2026" l="Manifesto — selo vertical" />
            </span>
            <div className="relative self-end" style={{ height: '80%', aspectRatio: '695 / 845', maxWidth: '100%' }} data-animate>
              <EImg
                k="inst.manifesto.img" v="/images/s2-manifesto-pessoa.webp"
                l="Manifesto — foto da persona"
                spec={{ w: 1390, h: 1690, shape: 'retrato', note: 'Recorte alto, alinhado pela base da coluna esquerda.' }}
                alt="Manifesto HUB PAN"
                className="w-full h-full object-cover rounded-2xl"
                style={{ objectPosition: 'center 15%' }}
              />
            </div>
          </div>

          {/* Conteúdo — centralizado, com bastante respiro */}
          <div className="order-1 lg:order-2 lg:h-screen flex flex-col justify-center gutter lg:pl-16 lg:pr-24 xl:pr-[160px] py-16 lg:py-0">
            <p className="eyebrow text-muted mb-7" data-animate><ET k="inst.manifesto.eyebrow" v="MANIFESTO FUNDACIONAL" l="Manifesto — selo da seção" /></p>
            <h2 className="mb-8" style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 'clamp(32px,3vw,52px)', letterSpacing: '-0.8px', lineHeight: 1, color: '#152852' }} data-animate>
              <ERich k="inst.manifesto.titulo" l="Manifesto — título">Por que o HUB PAN existe.</ERich>
            </h2>
            <p className="mb-8" style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 'clamp(19px,1.6vw,25px)', lineHeight: 1.5, color: '#152852' }} data-animate>
              <ERich k="inst.manifesto.destaque" l="Manifesto — texto em destaque">
                Existe um problema de percepção que estamos aqui para resolver. Há um lastro real — mas ele ainda não está organizado em uma narrativa capaz de fazer o mercado perceber a <span style={{ color: '#2d4ebf' }}>verdadeira dimensão do ecossistema.</span>
              </ERich>
            </p>
            <div className="space-y-4 mb-10" data-animate>
              <p style={{ fontFamily: 'Inter', fontSize: 15.5, lineHeight: '27px', color: '#5a5a5a' }}>
                <ERich k="inst.manifesto.par1" l="Manifesto — parágrafo 1">
                  O HUB PAN não nasce para apresentar uma nova marca. Ele nasce para dar <strong style={{ color: '#152852' }}>escala, forma e percepção global</strong> a tudo que o ecossistema já construiu — experiências, programas, dados, comunidades e oportunidades reais.
                </ERich>
              </p>
              <p style={{ fontFamily: 'Inter', fontSize: 15.5, lineHeight: '27px', color: '#5a5a5a' }}>
                <ERich k="inst.manifesto.par2" l="Manifesto — parágrafo 2">
                  Somos uma comunidade global de inovação, pan-americana e pan-africana. Performamos nas Nações Unidas, temos sede em Harvard Square e estamos na Avenida Paulista — no lugar certo, na hora certa, com os ativos certos.
                </ERich>
              </p>
            </div>
            <div data-animate>
              <Link to="/contato"><HubButton size="lg" variant="navy"><ET k="inst.manifesto.btn" v="Fale com nossa equipe" l="Manifesto — botão" /></HubButton></Link>
            </div>
          </div>
        </div>
      </div>

      {/* Citação assinatura — full-bleed navy900 com watermark */}
      <div className="relative w-full bg-navy900 overflow-hidden">
        <p
          className="absolute pointer-events-none select-none left-0 whitespace-nowrap"
          style={{ bottom: '-10px', fontFamily: 'Luxenta', fontWeight: 600, fontSize: 'min(22vw, 320px)', lineHeight: 0.9, color: '#fff', opacity: 0.4, mixBlendMode: 'overlay' }}
        >
          HUB PAN
        </p>
        <div className="relative gutter py-24 lg:py-32 text-center">
          <p className="mb-4" style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 'clamp(30px, 4vw, 58px)', lineHeight: 1, letterSpacing: '-1px', color: '#fff' }} data-animate>
            <ERich k="inst.manifesto.citacao" l="Manifesto — citação assinatura">
              “One Vision. Two Continents.<br /><span style={{ color: '#d2e718' }}>A Shared Future.”</span>
            </ERich>
          </p>
          <p style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 11, letterSpacing: '2.2px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)' }} data-animate>
            <ET k="inst.manifesto.citacao.legenda" v="Linha institucional · HUB PAN" l="Manifesto — legenda da citação" />
          </p>
        </div>
      </div>
    </section>
  );
}

/* ═══════════ Ecossistema Fundador ═══════════ */

function SecFundador() {
  const ref = useReveal<HTMLElement>();
  return (
    <section ref={ref} className="lg:min-h-screen flex flex-col justify-center py-24 lg:py-32 gutter bg-white">
      <div className="mb-14 max-w-[640px]">
        <p className="eyebrow text-muted mb-6" data-animate><ET k="inst.fundador.eyebrow" v="ECOSSISTEMA FUNDADOR" l="Ecossistema Fundador — selo da seção" /></p>
        <h2 className="mb-4" style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 'clamp(32px,4vw,50px)', letterSpacing: '-0.5px', lineHeight: 1, color: '#152852' }} data-animate>
          <ERich k="inst.fundador.titulo" l="Ecossistema Fundador — título">De onde viemos define para onde vamos.</ERich>
        </h2>
        <p style={{ fontFamily: 'Inter', fontSize: 16, lineHeight: '27px', color: '#797979' }} data-animate>
          <ERich k="inst.fundador.desc" l="Ecossistema Fundador — texto de apoio">
            Três marcas registradas, centenas de projetos e relações institucionais que nenhuma plataforma recente pode replicar.
          </ERich>
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-5 mb-5">
        {FUNDADORAS.map((f) => (
          <div key={f.id} className="rounded-[20px] p-8 flex flex-col" style={{ background: f.bg, border: f.bg === '#fff' ? '1px solid #ecedf0' : 'none' }} data-animate>
            <div className="flex items-center justify-center mb-6" style={{ width: 56, height: 56, borderRadius: 14, background: f.iconBg }}>
              <EIcon k={`inst.fundador.${f.id}.icone`} l={`Ecossistema Fundador — ícone "${f.nome}"`} defaultSize={28}>
                <f.Icon size={28} strokeWidth={2} color={f.iconColor} />
              </EIcon>
            </div>
            <p className="mb-2" style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 10.5, letterSpacing: '2px', textTransform: 'uppercase', color: f.tagColor }}>
              <ET k={`inst.fundador.${f.id}.tag`} v={f.tag} l={`Ecossistema Fundador — selo "${f.nome}"`} />
            </p>
            <h3 className="mb-3" style={{ fontFamily: 'Luxenta', fontWeight: 600, fontSize: 24, color: f.text }}>
              <ET k={`inst.fundador.${f.id}.nome`} v={f.nome} l={`Ecossistema Fundador — nome "${f.nome}"`} />
            </h3>
            <p className="mb-6" style={{ fontFamily: 'Inter', fontSize: 14, lineHeight: '23px', color: f.sub }}>
              <ERich k={`inst.fundador.${f.id}.desc`} l={`Ecossistema Fundador — descrição "${f.nome}"`}>{f.desc}</ERich>
            </p>
            <ul className="space-y-2 mt-auto">
              {f.bullets.map((b, i) => (
                <li key={b} className="flex items-start gap-3" style={{ fontFamily: 'Inter', fontSize: 13, lineHeight: '20px', color: f.sub }}>
                  <span className="mt-[7px] shrink-0 w-[6px] h-[6px] rounded-full bg-lime" />
                  <ET k={`inst.fundador.${f.id}.bullet.${i}`} v={b} l={`Ecossistema Fundador — item ${i + 1} "${f.nome}"`} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="rounded-[20px] bg-lime p-8 lg:p-10 flex flex-col lg:flex-row lg:items-center gap-6" data-animate>
        <p className="shrink-0" style={{ fontFamily: 'Luxenta', fontWeight: 600, fontSize: 'clamp(32px,3vw,44px)', color: '#152852', whiteSpace: 'nowrap', lineHeight: 1 }}>
          <ET k="inst.fundador.cta.marca" v="HUB PAN" l="Ecossistema Fundador — bloco final, wordmark" />
        </p>
        <div className="hidden lg:block w-px self-stretch" style={{ background: 'rgba(21,40,82,0.25)' }} />
        <p style={{ fontFamily: 'Inter', fontSize: 16, lineHeight: '27px', color: '#152852' }}>
          <ERich k="inst.fundador.cta.desc" l="Ecossistema Fundador — bloco final, texto">
            <strong>O guarda-chuva global</strong> que organiza, reposiciona e escala tudo que já foi construído. Narrativa global, capilaridade, expansão, negócios, comunidade e futuro compartilhado entre Américas e África.
          </ERich>
        </p>
      </div>
    </section>
  );
}

/* ═══════════ Presença Global — bento misto (imagem + tipográfico) ═══════════ */

const TILE_COLORS = {
  navy: { bg: '#152852', text: '#fff', sub: 'rgba(255,255,255,0.78)', tagBorder: 'rgba(255,255,255,0.3)', tagText: '#fff', iconBg: 'rgba(255,255,255,0.1)', iconColor: '#d2e718' },
  blue: { bg: '#2d4ebf', text: '#fff', sub: 'rgba(255,255,255,0.82)', tagBorder: 'rgba(255,255,255,0.35)', tagText: '#fff', iconBg: 'rgba(255,255,255,0.12)', iconColor: '#d2e718' },
  lime: { bg: '#d2e718', text: '#152852', sub: 'rgba(21,40,82,0.85)', tagBorder: 'rgba(21,40,82,0.35)', tagText: '#152852', iconBg: 'rgba(21,40,82,0.08)', iconColor: '#152852' },
  white: { bg: '#fff', text: '#152852', sub: '#797979', tagBorder: 'rgba(21,40,82,0.2)', tagText: '#152852', iconBg: '#f5f5f5', iconColor: '#2d4ebf' },
} as const;

function TerritorioTile({ t, className = '' }: { t: Tile; className?: string }) {
  if (t.kind === 'photocard') {
    /* Foto em cima + card branco com infos embaixo (padrão dos cards da home) */
    return (
      <div className={`flex flex-col rounded-[20px] overflow-hidden bg-white ${className}`} style={{ border: '1px solid #ecedf0' }} data-animate>
        <div className="relative overflow-hidden shrink-0 h-[55%] min-h-[220px]">
          <EImg
            k={`inst.territorio.${t.id}.img`} v={`/images/${t.img}.webp`}
            l={`Presença Global — foto "${t.nome}"`}
            spec={{ w: 1000, h: 900, shape: 'paisagem', note: 'Ocupa a metade de cima do card, com um card branco de texto embaixo.' }}
            alt={t.nome}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>
        <div className="flex flex-col flex-1 p-7">
          <p className="mb-3" style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 10.5, letterSpacing: '1.8px', textTransform: 'uppercase', color: '#2d4ebf' }}>
            <ET k={`inst.territorio.${t.id}.tag`} v={t.tag} l={`Presença Global — selo "${t.nome}"`} />
          </p>
          <h3 className="mb-3" style={{ fontFamily: 'Luxenta', fontWeight: 600, fontSize: 24, lineHeight: 1.05, color: '#152852' }}>
            <ET k={`inst.territorio.${t.id}.nome`} v={t.nome} l={`Presença Global — nome "${t.nome}"`} />
          </h3>
          <p style={{ fontFamily: 'Inter', fontSize: 13.5, lineHeight: '21px', color: '#797979' }}>
            <ERich k={`inst.territorio.${t.id}.desc`} l={`Presença Global — descrição "${t.nome}"`}>{t.desc}</ERich>
          </p>
        </div>
      </div>
    );
  }

  if (t.kind === 'image') {
    return (
      <div className={`group relative rounded-[20px] overflow-hidden ${className}`} data-animate>
        <img src={`/images/${t.img}.webp`} alt={t.nome} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(6,9,25,0.88) 0%, rgba(6,9,25,0.35) 45%, rgba(6,9,25,0.12) 100%)' }} />
        <span
          className="absolute top-5 left-5 inline-flex items-center px-3 py-[6px] rounded-full"
          style={{
            backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
            background: 'rgba(250,255,202,0.12)', border: '0.88px solid rgba(255,255,255,0.25)',
            fontFamily: 'Inter', fontWeight: 500, fontSize: 10, letterSpacing: '1.6px', textTransform: 'uppercase', color: '#fff',
          }}
        >
          {t.tag}
        </span>
        <div className="absolute inset-x-0 bottom-0 p-6">
          <h3 className="mb-2" style={{ fontFamily: 'Luxenta', fontWeight: 600, fontSize: 22, lineHeight: 1.1, color: '#fff' }}>{t.nome}</h3>
          <p style={{ fontFamily: 'Inter', fontSize: 13, lineHeight: '20px', color: 'rgba(255,255,255,0.85)', maxWidth: 560 }}>{t.desc}</p>
        </div>
      </div>
    );
  }

  /* Tile tipográfico — cor do DS; no hover a foto surge com camada preta e o texto ganha contraste */
  const c = TILE_COLORS[t.color ?? 'navy'];
  const Icon = t.Icon ?? MapPin;
  /* Cards claros (texto escuro no repouso) precisam virar branco no hover — a foto + camada preta escurecem o fundo */
  const isLight = t.color === 'lime' || t.color === 'white';
  return (
    <div
      className={`group relative rounded-[20px] overflow-hidden ${className}`}
      style={{ background: c.bg, border: t.color === 'white' ? '1px solid #ecedf0' : undefined }}
      data-animate
    >
      {/* Foto revelada no hover */}
      <EImg
        k={`inst.territorio.${t.id}.img`} v={`/images/${t.img}.webp`}
        l={`Presença Global — foto "${t.nome}" (revelada no hover)`}
        spec={{ w: 900, h: 900, shape: 'quadrada', note: 'Só aparece quando o mouse passa por cima do card.' }}
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-0 scale-110 transition-all duration-500 ease-out group-hover:opacity-100 group-hover:scale-100"
      />
      <div className="absolute inset-0 bg-black/55 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <div className="relative h-full flex flex-col p-6">
        {/* Ícone — some quando a foto aparece */}
        <div
          className="flex items-center justify-center rounded-full mb-auto transition-opacity duration-300 group-hover:opacity-0"
          style={{ width: 56, height: 56, background: c.iconBg }}
        >
          <EIcon k={`inst.territorio.${t.id}.icone`} l={`Presença Global — ícone "${t.nome}"`} defaultSize={26}>
            <Icon size={26} strokeWidth={2} color={c.iconColor} />
          </EIcon>
        </div>

        <span
          className={`inline-flex self-start items-center px-3 py-[6px] rounded-full mb-3 transition-colors duration-300 ${isLight ? 'group-hover:!text-white group-hover:!border-white/40' : ''}`}
          style={{
            border: `1px solid ${c.tagBorder}`,
            fontFamily: 'Inter', fontWeight: 500, fontSize: 10, letterSpacing: '1.6px', textTransform: 'uppercase', color: c.tagText,
          }}
        >
          <ET k={`inst.territorio.${t.id}.tag`} v={t.tag} l={`Presença Global — selo "${t.nome}"`} />
        </span>
        <h3
          className={`mb-2 transition-colors duration-300 ${isLight ? 'group-hover:!text-white' : ''}`}
          style={{ fontFamily: 'Luxenta', fontWeight: 600, fontSize: 24, lineHeight: 1.15, color: c.text }}
        >
          <ET k={`inst.territorio.${t.id}.nome`} v={t.nome} l={`Presença Global — nome "${t.nome}"`} />
        </h3>
        <p
          className={`transition-colors duration-300 ${isLight ? 'group-hover:!text-white/90' : ''}`}
          style={{ fontFamily: 'Inter', fontSize: 13, lineHeight: '20px', color: c.sub }}
        >
          <ERich k={`inst.territorio.${t.id}.desc`} l={`Presença Global — descrição "${t.nome}"`}>{t.desc}</ERich>
        </p>
      </div>
    </div>
  );
}

function SecPresenca() {
  const ref = useReveal<HTMLElement>();
  const [cambridge, africa, bh, sp, boston, ny] = TERRITORIOS;
  const [bg, bgProps] = useEditColor('inst.presenca.bg', '#f5f5f5', 'Fundo da seção Presença Global');
  return (
    <section ref={ref} className="py-24 lg:py-32 gutter" {...bgProps} style={{ background: bg }}>
      <div className="mb-14 max-w-[700px]">
        <p className="eyebrow text-muted mb-6" data-animate><ET k="inst.presenca.eyebrow" v="PRESENÇA GLOBAL" l="Presença Global — selo da seção" /></p>
        <h2 className="mb-4" style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 'clamp(32px,4vw,50px)', letterSpacing: '-0.5px', lineHeight: 1, color: '#152852' }} data-animate>
          <ERich k="inst.presenca.titulo" l="Presença Global — título">Onde o HUB PAN está — e o que cada território representa.</ERich>
        </h2>
        <p style={{ fontFamily: 'Inter', fontSize: 16, lineHeight: '27px', color: '#797979' }} data-animate>
          <ERich k="inst.presenca.desc" l="Presença Global — texto de apoio">
            Cada cidade cumpre uma função estratégica específica. Não é turismo institucional — é posicionamento deliberado.
          </ERich>
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:auto-rows-[270px]">
        {/* Esquerda: 2 cards altos (foto + card branco) · Direita: 4 tiles proporcionais */}
        <TerritorioTile t={cambridge} className="lg:row-span-2 min-h-[480px] lg:min-h-0" />
        <TerritorioTile t={africa} className="lg:row-span-2 min-h-[480px] lg:min-h-0" />
        <TerritorioTile t={bh} className="min-h-[270px]" />
        <TerritorioTile t={sp} className="min-h-[270px]" />
        <TerritorioTile t={boston} className="min-h-[270px]" />
        <TerritorioTile t={ny} className="min-h-[270px]" />
      </div>
    </section>
  );
}

/* ═══════════ Timeline — anos gigantes + linha animada por scroll (GSAP scrub) ═══════════ */

function TimelineItem({ item, side }: { item: (typeof TIMELINE)[number]; side: 'left' | 'right' }) {
  // Reveal bidirecional: aparece ao descer, esconde de volta ao subir
  const ref = useRevealBidirectional<HTMLDivElement>(0.08);
  return (
    <div ref={ref} className="relative pb-20 last:pb-0">
      {/* Ponto — padrão uniforme, sem preenchimento */}
      <span
        className="absolute rounded-full top-0 left-1/2 -translate-x-1/2 z-10"
        style={{ width: 12, height: 12, background: '#fff', border: '2px solid #a7a4a4' }}
        data-animate
      />
      {/* Ano gigante no centro, sobre a linha */}
      <div className="relative z-[5] text-center pt-8 mb-5" data-animate>
        <p style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 'clamp(44px, 5.5vw, 96px)', lineHeight: 1, letterSpacing: '-2.5px', color: item.major ? '#2d4ebf' : '#c4c4c4' }}>
          <ET k={`inst.timeline.${item.id}.ano`} v={item.ano} l={`Timeline — ano "${item.titulo}"`} />
        </p>
        <p className="mt-2" style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 11, letterSpacing: '1.8px', textTransform: 'uppercase', color: '#a7a4a4' }}>
          <ET k={`inst.timeline.${item.id}.quando`} v={item.quando} l={`Timeline — período "${item.titulo}"`} />
        </p>
      </div>
      {/* Infos em zigue-zague — cada item de um lado */}
      <div
        className={`text-center lg:w-[calc(50%-56px)] ${side === 'left' ? 'lg:mr-auto lg:text-right' : 'lg:ml-auto lg:text-left'}`}
        data-animate
      >
        <h3 className="mb-2" style={{ fontFamily: 'Luxenta', fontWeight: 600, fontSize: 'clamp(18px,1.7vw,24px)', lineHeight: 1.1, color: '#152852' }}>
          <ET k={`inst.timeline.${item.id}.titulo`} v={item.titulo} l={`Timeline — título "${item.titulo}"`} />
        </h3>
        <p style={{ fontFamily: 'Inter', fontSize: 14, lineHeight: '23px', color: '#797979' }}>
          <ERich k={`inst.timeline.${item.id}.desc`} l={`Timeline — descrição "${item.titulo}"`}>{item.desc}</ERich>
        </p>
      </div>
    </div>
  );
}

function SecTimeline() {
  const headRef = useReveal<HTMLDivElement>();
  const wrapRef = useRef<HTMLDivElement>(null);
  const progRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    const prog = progRef.current;
    if (!wrap || !prog) return;
    const ctx = gsap.context(() => {
      // Linha lime "desenha" conforme o scroll atravessa a seção
      gsap.fromTo(
        prog,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          transformOrigin: 'top center',
          scrollTrigger: { trigger: wrap, start: 'top 62%', end: 'bottom 78%', scrub: 0.6 },
        }
      );
    }, wrap);
    return () => ctx.revert();
  }, []);

  const [[tc1, tc2], tGradProps] = useEditColors('Timeline — degradê de fundo', [
    { key: 'inst.timeline.grad.1', label: 'Timeline — cor 1 do degradê', fallback: '#ffffff' },
    { key: 'inst.timeline.grad.2', label: 'Timeline — cor 2 do degradê', fallback: '#d2e718' },
  ]);
  return (
    <section
      className="pt-24 lg:pt-32 gutter overflow-hidden"
      {...tGradProps}
      style={{ background: `linear-gradient(39.8deg, ${tc1} 65.3%, ${tc2} 99%)` }}
    >
      <div ref={headRef} className="mb-16 max-w-[680px]">
        <p className="eyebrow text-muted mb-6" data-animate><ET k="inst.timeline.eyebrow" v="10 ANOS DE TRAJETÓRIA" l="Timeline — selo da seção" /></p>
        <h2 className="mb-4" style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 'clamp(32px,4vw,50px)', letterSpacing: '-0.5px', lineHeight: 1, color: '#152852' }} data-animate>
          <ERich k="inst.timeline.titulo" l="Timeline — título">Uma jornada construída entrega por entrega.</ERich>
        </h2>
        <p style={{ fontFamily: 'Inter', fontSize: 16, lineHeight: '27px', color: '#797979' }} data-animate>
          <ERich k="inst.timeline.desc" l="Timeline — texto de apoio">
            Um ecossistema que prometeu, entregou e fez isso múltiplas vezes — em contextos diferentes, para públicos diferentes, em cidades diferentes.
          </ERich>
        </p>
      </div>

      {/* pb aqui (em vez de no <section>) faz o trilho ir até a borda real da seção, encostando na seção seguinte */}
      <div ref={wrapRef} className="relative pb-24 lg:pb-32">
        {/* Trilho central + linha de progresso animada (atrás dos anos) */}
        <div className="absolute top-1 bottom-0 w-px" style={{ left: 'calc(50% - 0.5px)', background: '#dcdcdc' }} />
        <div ref={progRef} className="absolute top-1 bottom-0 w-[2px] bg-lime" style={{ left: 'calc(50% - 1px)', transform: 'scaleY(0)' }} />
        {TIMELINE.map((item, i) => (
          <TimelineItem key={i} item={item} side={i % 2 === 0 ? 'left' : 'right'} />
        ))}
      </div>
    </section>
  );
}

/* ═══════════ MIPAD — seção escura com glass ═══════════ */

function SecMipad() {
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
      <div className="relative gutter py-24 lg:py-32 lg:min-h-screen grid lg:grid-cols-2 gap-12 lg:gap-20 items-center content-center">
        <div>
          <p className="eyebrow mb-6" style={{ color: 'rgba(255,255,255,0.69)' }} data-animate><ET k="inst.mipad.eyebrow" v="PARCEIRO ESTRATÉGICO FUNDACIONAL" l="MIPAD — selo da seção" /></p>
          <h2 className="mb-7" style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 'clamp(28px,2.6vw,44px)', letterSpacing: '-0.8px', lineHeight: 1, color: '#fff' }} data-animate>
            <ERich k="inst.mipad.titulo" l="MIPAD — título">
              <span style={{ color: '#d2e718' }}>MIPAD</span> · Most Influential People of African Descent
            </ERich>
          </h2>
          <div className="space-y-4 mb-8" data-animate>
            <p style={{ fontFamily: 'Inter', fontSize: 16, lineHeight: '27px', color: '#d6d6d6' }}>
              <ERich k="inst.mipad.par1" l="MIPAD — parágrafo 1">
                Um movimento global vinculado às Nações Unidas que reconhece e conecta as pessoas negras mais influentes do mundo nas áreas de negócios, política, cultura, ciência e impacto social.
              </ERich>
            </p>
            <p style={{ fontFamily: 'Inter', fontSize: 16, lineHeight: '27px', color: '#d6d6d6' }}>
              <ERich k="inst.mipad.par2" l="MIPAD — parágrafo 2">
                A parceria fundacional com o MIPAD posiciona o HUB PAN dentro de uma rede de influência genuinamente global — e valida o eixo pan-africano do ecossistema com a legitimidade de um organismo vinculado à ONU.
              </ERich>
            </p>
          </div>
          <div
            className="inline-flex items-center gap-4 rounded-full px-6 py-3 mb-8"
            style={{ backdropFilter: 'blur(17.6px)', WebkitBackdropFilter: 'blur(17.6px)', background: 'rgba(250,255,202,0.10)', border: '0.88px solid rgba(255,255,255,0.15)' }}
            data-animate
          >
            <EIcon k="inst.mipad.badge.icone" l="MIPAD — ícone do selo ONU" defaultSize={20}>
              <Globe2 size={20} strokeWidth={2} color="#d2e718" />
            </EIcon>
            <span style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 13, color: '#fff' }}>
              <ET k="inst.mipad.badge.texto" v="Vinculado às Nações Unidas · ONU" l="MIPAD — texto do selo ONU" />
            </span>
          </div>
          <div data-animate>
            <HubButton size="md" variant="lime"><ET k="inst.mipad.btn" v="Saiba mais sobre o MIPAD" l="MIPAD — botão" /></HubButton>
          </div>
        </div>

        <div
          className="rounded-[20px] p-8 lg:p-10"
          style={{ backdropFilter: 'blur(15px)', WebkitBackdropFilter: 'blur(15px)', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}
          data-animate
        >
          <div className="flex items-center justify-center py-10 mb-8 rounded-[14px]" style={{ background: 'rgba(255,255,255,0.04)' }}>
            <EImg
              k="inst.mipad.logo" v="/images/s10-logo-parceiro-1.png" l="MIPAD — logo do parceiro"
              spec={{ w: 400, h: 220, shape: 'paisagem', fit: 'contain', note: 'Logo com fundo transparente sobre painel escuro.' }}
              alt="MIPAD" className="max-h-[110px] object-contain"
            />
          </div>
          <p className="mb-2" style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 10.5, letterSpacing: '2px', textTransform: 'uppercase', color: '#d2e718' }}>
            <ET k="inst.mipad.card.tag" v="LANÇAMENTO DO PORTAL" l="MIPAD — card, selo" />
          </p>
          <h3 className="mb-3" style={{ fontFamily: 'Luxenta', fontWeight: 600, fontSize: 22, color: '#fff' }}>
            <ET k="inst.mipad.card.titulo" v="CEO Global do MIPAD presente em São Paulo" l="MIPAD — card, título" />
          </h3>
          <p style={{ fontFamily: 'Inter', fontSize: 14, lineHeight: '23px', color: '#d6d6d6' }}>
            <ERich k="inst.mipad.card.desc" l="MIPAD — card, descrição">
              O lançamento do portal HUB PAN contará com a presença física do CEO global do MIPAD, vindo de Londres — reforçando a parceria e atraindo cobertura institucional e midiática para o evento.
            </ERich>
          </p>
        </div>
      </div>
    </section>
  );
}

/* ═══════════ Governança — glass cards sobre hubblue ═══════════ */

/** Card com tilt 3D guiado pelo cursor + recolorização fluida no hover (GSAP):
    card fica branco, título navy, texto cinza, círculo lime e ícone navy. */
function GovCard({ g }: { g: (typeof GOVERNANCA)[number] }) {
  const tiltRef = useTilt<HTMLDivElement>(8, 10);

  useLayoutEffect(() => {
    const el = tiltRef.current;
    if (!el) return;
    const q = gsap.utils.selector(el);
    const D = 0.35;
    const enter = () => {
      gsap.to(el, { backgroundColor: '#ffffff', borderColor: '#ecedf0', duration: D, ease: 'power2.out' });
      gsap.to(q('.gov-title'), { color: '#152852', duration: D, ease: 'power2.out' });
      gsap.to(q('.gov-desc'), { color: '#797979', duration: D, ease: 'power2.out' });
      gsap.to(q('.gov-circle'), { backgroundColor: '#d2e718', borderColor: 'rgba(210,231,24,0)', color: '#152852', duration: D, ease: 'power2.out' });
    };
    const leave = () => {
      gsap.to(el, { backgroundColor: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.1)', duration: 0.45, ease: 'power2.out' });
      gsap.to(q('.gov-title'), { color: '#ffffff', duration: 0.45, ease: 'power2.out' });
      gsap.to(q('.gov-desc'), { color: 'rgba(255,255,255,0.8)', duration: 0.45, ease: 'power2.out' });
      gsap.to(q('.gov-circle'), { backgroundColor: 'rgba(255,255,255,0.18)', borderColor: 'rgba(210,231,24,0.5)', color: '#ffffff', duration: 0.45, ease: 'power2.out' });
    };
    el.addEventListener('mouseenter', enter);
    el.addEventListener('mouseleave', leave);
    return () => {
      el.removeEventListener('mouseenter', enter);
      el.removeEventListener('mouseleave', leave);
      gsap.killTweensOf([el, ...q('.gov-title'), ...q('.gov-desc'), ...q('.gov-circle')]);
    };
  }, [tiltRef]);

  return (
    <div
      ref={tiltRef}
      className="rounded-[20px] p-7 cursor-default"
      style={{ backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.1)' }}
      data-animate
    >
      {/* Ícone herda a cor do círculo (currentColor) pra animar junto */}
      <div
        className="gov-circle flex items-center justify-center rounded-full mb-6"
        style={{ width: 64, height: 64, backdropFilter: 'blur(30px)', WebkitBackdropFilter: 'blur(30px)', background: 'rgba(255,255,255,0.18)', border: '1px solid rgba(210,231,24,0.5)', color: '#fff' }}
      >
        <EIcon k={`inst.governanca.${g.id}.icone`} l={`Governança — ícone "${g.titulo}"`} defaultSize={28}>
          <g.Icon size={28} strokeWidth={2} />
        </EIcon>
      </div>
      <h3 className="gov-title mb-2" style={{ fontFamily: 'Luxenta', fontWeight: 600, fontSize: 20, color: '#fff' }}>
        <ET k={`inst.governanca.${g.id}.titulo`} v={g.titulo} l={`Governança — título "${g.titulo}"`} />
      </h3>
      <p className="gov-desc" style={{ fontFamily: 'Inter', fontSize: 13.5, lineHeight: '22px', color: 'rgba(255,255,255,0.8)' }}>
        <ERich k={`inst.governanca.${g.id}.desc`} l={`Governança — descrição "${g.titulo}"`}>{g.desc}</ERich>
      </p>
    </div>
  );
}

function SecGovernanca() {
  const ref = useReveal<HTMLElement>();
  return (
    <section ref={ref} className="w-full bg-hubblue py-24 lg:py-32 gutter">
      <div className="text-center max-w-[640px] mx-auto mb-14">
        <p className="eyebrow mb-6" style={{ color: 'rgba(255,255,255,0.69)' }} data-animate><ET k="inst.governanca.eyebrow" v="GOVERNANÇA GLOBAL" l="Governança — selo da seção" /></p>
        <h2 className="mb-4 text-white" style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 'clamp(32px,4vw,50px)', letterSpacing: '-0.5px', lineHeight: 1 }} data-animate>
          <ERich k="inst.governanca.titulo" l="Governança — título">
            Estrutura que <span style={{ color: '#d2e718' }}>sustenta a ambição.</span>
          </ERich>
        </h2>
        <p style={{ fontFamily: 'Inter', fontSize: 16, lineHeight: '27px', color: 'rgba(255,255,255,0.8)' }} data-animate>
          <ERich k="inst.governanca.desc" l="Governança — texto de apoio">
            O HUB PAN conecta setor privado, setor público, educação, organismos internacionais e projetos de impacto. Sem governança, essa articulação parece frágil. Com ela, é uma garantia.
          </ERich>
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
        {GOVERNANCA.map((g) => (
          <GovCard key={g.id} g={g} />
        ))}
      </div>

      <div
        className="rounded-[20px] p-8 lg:p-10 grid md:grid-cols-2 gap-10 items-start"
        style={{ backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}
        data-animate
      >
        <div>
          <div className="flex items-center gap-3 mb-5">
            <EIcon k="inst.governanca.marcas.icone" l="Governança — ícone Marcas Registradas" defaultSize={22}>
              <FileCheck2 size={22} strokeWidth={2} color="#d2e718" />
            </EIcon>
            <h3 style={{ fontFamily: 'Luxenta', fontWeight: 600, fontSize: 21, color: '#fff' }}>
              <ET k="inst.governanca.marcas.titulo" v="Marcas Registradas no INPI" l="Governança — título Marcas Registradas" />
            </h3>
          </div>
          <div>
            {MARCAS.map((m, i) => (
              <div key={m} className="flex items-center gap-3 py-[9px] border-b border-white/10 last:border-0">
                <span className="w-[6px] h-[6px] rounded-full bg-lime shrink-0" />
                <span style={{ fontFamily: 'Inter', fontSize: 14, color: '#fff' }}>
                  <ET k={`inst.governanca.marca.${i}`} v={m} l={`Governança — marca registrada ${i + 1}`} />
                </span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="mb-4" style={{ fontFamily: 'Luxenta', fontWeight: 600, fontSize: 21, color: '#fff' }}>
            <ET k="inst.governanca.pi.titulo" v="Propriedade Intelectual" l="Governança — título Propriedade Intelectual" />
          </h3>
          <p className="mb-7" style={{ fontFamily: 'Inter', fontSize: 14, lineHeight: '24px', color: 'rgba(255,255,255,0.8)' }}>
            <ERich k="inst.governanca.pi.desc" l="Governança — descrição Propriedade Intelectual">
              Todo o conteúdo, metodologias, programas, marcas e ativos digitais do ecossistema HUB PAN são protegidos por registro de propriedade intelectual e por políticas internas de uso e licenciamento. Parceiros e patrocinadores recebem autorização formal e documentada de uso.
            </ERich>
          </p>
          <HubButton size="sm" variant="lime"><ET k="inst.governanca.pi.btn" v="Ver política de governança" l="Governança — botão Propriedade Intelectual" /></HubButton>
        </div>
      </div>
    </section>
  );
}

/* ═══════════ FAQ ═══════════ */

function SecFAQ() {
  const ref = useReveal<HTMLElement>();
  return (
    <section ref={ref} className="bg-white py-24 lg:py-32 gutter">
      <div className="grid lg:grid-cols-[1fr_2fr] gap-10 lg:gap-[72px] items-start">
        <div data-animate>
          <p className="eyebrow text-muted mb-6"><ET k="inst.faq.eyebrow" v="PERGUNTAS FREQUENTES" l="FAQ — selo da seção" /></p>
          <h2 className="mb-4" style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 'clamp(26px,2.5vw,36px)', letterSpacing: '-0.5px', lineHeight: 1, color: '#152852' }}>
            <ERich k="inst.faq.titulo" l="FAQ — título">O que as pessoas mais querem saber.</ERich>
          </h2>
          <p style={{ fontFamily: 'Inter', fontSize: 16, lineHeight: '27px', color: '#797979' }}>
            <ERich k="inst.faq.desc" l="FAQ — texto de apoio">
              Respostas diretas sobre a estrutura, o propósito e o funcionamento do HUB PAN.
            </ERich>
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

export default function Institucional() {
  return (
    <>
      <HeroInst />
      <SecManifesto />
      <SecFundador />
      <SecPresenca />
      <SecTimeline />
      <SecMipad />
      <SecGovernanca />
      <SecFAQ />
      <CTABanner
        title={
          <ERich k="inst.cta.titulo" l="CTA final — título">
            Conecte-se ao futuro das <span style={{ color: '#d2e718' }}>Américas e da África.</span>
          </ERich>
        }
        sub={<ET k="inst.cta.sub" v="Seja como governo, empresa, educador, investidor ou comunidade — há um caminho para você no HUB PAN." l="CTA final — subtítulo" />}
        actions={
          <>
            <Link to="/contato"><HubButton size="lg" variant="lime"><ET k="inst.cta.btn.principal" v="Fale com nossa equipe" l="CTA final — botão principal" /></HubButton></Link>
            <Link to="/prointer"><HubButton size="lg" variant="navy"><ET k="inst.cta.btn.secundario" v="Conhecer o PROINTER" l="CTA final — botão secundário" /></HubButton></Link>
          </>
        }
      />
    </>
  );
}
