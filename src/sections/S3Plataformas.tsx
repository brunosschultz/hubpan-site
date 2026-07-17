import { useState, useEffect, useRef } from 'react';
import { useReveal } from '../components/useReveal';
import HubButton from '../components/HubButton';

/* ---------- Accordion (linha 1) ---------- */
interface AccItem {
  id: string;
  icon: string;
  iconSize: number;
  label: string;
  title: string;
  desc: string;
  image: string;
  hasButton?: boolean;
  buttonText?: string;
}

const ACC: AccItem[] = [
  {
    id: 'prointer', icon: '/icons/s3-icon-pi.svg', iconSize: 73,
    label: 'INTERCÂMBIO · IMPACTO · ESG', title: 'ProInter',
    desc: 'Programa de intercâmbio de alto impacto para professores da rede pública e afroempreendedores. Harvard Square, ONU, Nova York, Boston.',
    image: '/images/s3-accordion-prointer.webp', hasButton: true, buttonText: 'Conheça o PROINTER',
  },
  {
    id: 'forum', icon: '/icons/s3-icon-ia.svg', iconSize: 68,
    label: 'IA GLOBAL · CAMBRIDGE 2027', title: 'Fórum Mundial de IA',
    desc: 'O maior ativo proprietário do HUB PAN. Autoridade, patrocínio, relacionamento e geração de negócios em inteligência artificial.',
    image: '/images/s3-accordion-forum.webp',
  },
  {
    id: 'govia', icon: '/icons/s3-icon-gv.svg', iconSize: 68,
    label: 'ASSINATURA · GOVERNOS', title: 'GovIA',
    desc: 'Plataforma de assinatura de IA para municípios e consórcios públicos. Ferramentas, formação e Observatório de IA.',
    image: '/images/s3-accordion-govia.webp',
  },
];

function AccordionCard({ item, active, onHover }: { item: AccItem; active: boolean; onHover: () => void }) {
  return (
    <div
      onMouseEnter={onHover}
      className="relative bg-white border border-gray200 flex overflow-hidden transition-[flex-grow] duration-[400ms] ease-out cursor-pointer"
      style={{ borderRadius: 17, flexGrow: active ? 2 : 1, flexBasis: 0, minWidth: 0, height: 454 }}
      data-animate
    >
      {/* Conteúdo */}
      <div className="flex flex-col shrink-0" style={{ padding: '32px 24px 28px 32px', width: active ? '50%' : '100%' }}>
        <img src={item.icon} alt="" style={{ width: item.iconSize, height: item.iconSize, flexShrink: 0 }} />
        <div style={{ height: 16, flexShrink: 0 }} />
        <p style={{ fontFamily: 'Inter', fontSize: 14, lineHeight: '40px', letterSpacing: '1.4px', color: '#a7a4a4', flexShrink: 0 }}>{item.label}</p>
        <p style={{ fontFamily: 'Luxenta', fontWeight: 600, fontSize: 35, lineHeight: '40px', color: '#000', flexShrink: 0, whiteSpace: active ? 'normal' : 'normal' }}>{item.title}</p>
        <div style={{ height: 12, flexShrink: 0 }} />
        <p style={{ fontFamily: 'Inter', fontSize: 14, lineHeight: '28px', color: '#797979' }}>{item.desc}</p>
        {item.hasButton && (
          <>
            <div style={{ flex: 1 }} />
            <div className="mt-2">
              <HubButton size="md" variant="blue" circleColor="#d2e718" arrowColor="#152852">{item.buttonText}</HubButton>
            </div>
          </>
        )}
      </div>
      {/* Imagem (só card ativo) */}
      {active && (
        <div className="hidden md:block" style={{ width: '50%', padding: '20px 20px 20px 0' }}>
          <div className="w-full h-full overflow-hidden" style={{ borderRadius: 16 }}>
            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- Cards plataforma (linha 2) ---------- */
interface PlatCard {
  icon: string; iconSize: number; label: string; name: string; nameColor: string;
  desc: string; bg: string; labelColor: string; hubColor: string; descColor: string;
  btnBg: string; btnText: string; btnCircle: string; btnArrow: string;
}

const PLAT: PlatCard[] = [
  {
    icon: '/icons/s3-icon-academy.svg', iconSize: 54, label: 'ACADEMY', name: 'Academy', nameColor: '#2d4ebf',
    desc: 'Formação, cursos, extensão, pós-graduação e comunidades educacionais.',
    bg: '#fff', labelColor: '#a7a4a4', hubColor: '#152852', descColor: '#797979',
    btnBg: '#d2e718', btnText: '#152852', btnCircle: 'rgba(0,0,0,0.1)', btnArrow: '#152852',
  },
  {
    icon: '/icons/s3-icon-alliance.svg', iconSize: 51, label: 'ALLIANCE', name: 'Alliance', nameColor: '#d2e718',
    desc: 'Rede estratégica de empresas, startups, universidades, ICTs e governos.',
    bg: '#2d4ebf', labelColor: 'rgba(255,255,255,0.7)', hubColor: '#fff', descColor: '#fff',
    btnBg: '#d2e718', btnText: '#2d4ebf', btnCircle: 'rgba(0,0,0,0.1)', btnArrow: '#2d4ebf',
  },
  {
    icon: '/icons/s3-icon-insights.svg', iconSize: 44, label: 'INSIGHT', name: 'Insights', nameColor: '#d2e718',
    desc: 'Observatórios, pesquisas, white papers, artigos e inteligência estratégica.',
    bg: '#152852', labelColor: '#a7a4a4', hubColor: '#fff', descColor: '#fff',
    btnBg: '#d2e718', btnText: '#152852', btnCircle: 'rgba(0,0,0,0.1)', btnArrow: '#152852',
  },
  {
    icon: '/icons/s3-icon-digital.svg', iconSize: 45, label: 'DIGITAL', name: 'Digital', nameColor: '#2d4ebf',
    desc: 'Portal, app, AVA, área do aluno e infraestrutura de acesso ao ecossistema.',
    bg: '#d2e718', labelColor: 'rgba(21,40,82,0.5)', hubColor: '#152852', descColor: '#152852',
    btnBg: '#2d4ebf', btnText: '#fff', btnCircle: 'rgba(0,0,0,0.1)', btnArrow: '#fff',
  },
];

function PlatformCard({ c }: { c: PlatCard }) {
  return (
    <div className="flex flex-col" style={{ background: c.bg, borderRadius: 17, height: 372, padding: 28, border: c.bg === '#fff' ? '1px solid #ecedf0' : undefined }} data-animate>
      <img src={c.icon} alt="" style={{ width: c.iconSize, height: c.iconSize, marginBottom: 16 }} />
      <p style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 11.9, letterSpacing: '3.58px', textTransform: 'uppercase', color: c.labelColor, marginBottom: 8 }}>{c.label}</p>
      <p style={{ marginBottom: 'auto' }}>
        <span style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 30, color: c.hubColor }}>HUP PAN</span>{' '}
        <span style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: 20, color: c.nameColor }}>{c.name}</span>
      </p>
      <p style={{ fontFamily: 'Inter', fontSize: 14, lineHeight: '21px', color: c.descColor, marginBottom: 20 }}>{c.desc}</p>
      <div className="self-start">
        <HubButton size="sm" variant="blue" circleColor={c.btnCircle} arrowColor={c.btnArrow}
          className="" >
          <span style={{ color: c.btnText }}>Explorar</span>
        </HubButton>
      </div>
    </div>
  );
}

export default function S3Plataformas() {
  const ref = useReveal<HTMLElement>();
  const [active, setActive] = useState(0);
  const pausedRef = useRef(false);

  useEffect(() => {
    const t = setInterval(() => {
      if (!pausedRef.current) setActive((a) => (a + 1) % ACC.length);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <section ref={ref} className="relative w-full bg-gray150 py-20 gutter" onMouseEnter={() => (pausedRef.current = true)} onMouseLeave={() => (pausedRef.current = false)}>
      <p className="eyebrow text-muted mb-6" data-animate>PLATAFORMAS ESTRATÉGICAS</p>
      <h2 className="mb-12" style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 'clamp(32px,4vw,50px)', letterSpacing: '-0.5px', color: '#152852' }} data-animate>
        Três carros-chefe. Uma narrativa global.
      </h2>

      {/* Linha 1 — Accordion */}
      <div className="flex flex-col lg:flex-row gap-4 mb-8">
        {ACC.map((item, i) => (
          <AccordionCard key={item.id} item={item} active={i === active} onHover={() => setActive(i)} />
        ))}
      </div>

      {/* Linha 2 — Plataformas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {PLAT.map((c) => <PlatformCard key={c.name} c={c} />)}
      </div>
    </section>
  );
}
