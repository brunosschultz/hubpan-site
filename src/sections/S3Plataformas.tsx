import { useState, useEffect, useRef } from 'react';
import { useReveal } from '../components/useReveal';
import HubButton from '../components/HubButton';
import { EIcon, EImg, ERich, ET, useEditColor } from '../editor/fields';

/* ---------- Accordion (linha 1) ---------- */
interface AccItem {
  id: string;
  icon: string;
  iconSize: number;
  label: string;
  title: string;
  desc: string;
  image: string;
  buttonText: string;
}

const ACC: AccItem[] = [
  {
    id: 'prointer', icon: '/icons/s3-icon-pi.svg', iconSize: 73,
    label: 'INTERCÂMBIO · IMPACTO · ESG', title: 'ProInter',
    desc: 'Programa de intercâmbio de alto impacto para professores da rede pública e afroempreendedores. Harvard Square, ONU, Nova York, Boston.',
    image: '/images/s3-accordion-prointer.webp', buttonText: 'Conheça o PROINTER',
  },
  {
    id: 'forum', icon: '/icons/s3-icon-ia.svg', iconSize: 68,
    label: 'IA GLOBAL · CAMBRIDGE 2027', title: 'Fórum\nMundial de IA',
    desc: 'O maior ativo proprietário do HUB PAN. Autoridade, patrocínio, relacionamento e geração de negócios em inteligência artificial.',
    image: '/images/s3-accordion-forum.webp', buttonText: 'Conheça o Fórum',
  },
  {
    id: 'govia', icon: '/icons/s3-icon-gv.svg', iconSize: 68,
    label: 'ASSINATURA · GOVERNOS', title: 'GovIA',
    desc: 'Plataforma de assinatura de IA para municípios e consórcios públicos. Ferramentas, formação e Observatório de IA.',
    image: '/images/s3-accordion-govia.webp', buttonText: 'Conheça a GovIA',
  },
];

const ACC_NOMES: Record<string, string> = { prointer: 'PROINTER', forum: 'Fórum Mundial de IA', govia: 'GovIA' };

/* Largura fixa do texto — não recalcula/reflow ao abrir. Só o card e a foto crescem. */
function AccordionCard({ item, active, onHover }: { item: AccItem; active: boolean; onHover: () => void }) {
  const nome = ACC_NOMES[item.id];
  return (
    <div
      onMouseEnter={onHover}
      className={`relative bg-white border border-gray200 flex overflow-hidden transition-[flex-grow] duration-[400ms] ease-out cursor-pointer lg:min-w-0 lg:basis-0 ${active ? 'lg:grow-[2]' : 'lg:grow'}`}
      style={{ borderRadius: 17, height: 454 }}
      data-animate
    >
      {/* Conteúdo — largura fixa no desktop (nunca recalcula com a abertura do card); fluida no mobile */}
      <div className="flex flex-col shrink-0 w-full lg:w-[331px]" style={{ padding: '36px 24px 26px 36px' }}>
        <EIcon k={`s3.acc.${item.id}.icone`} l={`Plataformas — ${nome}, ícone`} defaultSize={item.iconSize} className="self-start" style={{ flexShrink: 0 }}>
          <img src={item.icon} alt="" style={{ width: item.iconSize, height: item.iconSize }} />
        </EIcon>
        <div style={{ height: 16, flexShrink: 0 }} />
        <p style={{ fontFamily: 'Inter', fontSize: 14, lineHeight: '40px', letterSpacing: '1.4px', color: '#a7a4a4', flexShrink: 0 }}>
          <ET k={`s3.acc.${item.id}.label`} v={item.label} l={`Plataformas — ${nome}, selo`} />
        </p>
        <p style={{ fontFamily: 'Luxenta', fontWeight: 600, fontSize: 35, lineHeight: '36px', color: '#000', flexShrink: 0 }}>
          <ET k={`s3.acc.${item.id}.titulo`} v={item.title} l={`Plataformas — ${nome}, título`} multiline />
        </p>
        <div style={{ height: 12, flexShrink: 0 }} />
        <p style={{ fontFamily: 'Inter', fontSize: 14, lineHeight: '28px', color: '#797979' }}>
          <ERich k={`s3.acc.${item.id}.desc`} l={`Plataformas — ${nome}, descrição`}>
            {item.desc}
          </ERich>
        </p>
        {active && (
          <>
            <div style={{ flex: 1 }} />
            <div className="mt-2">
              <HubButton size="md" variant="blue" circleColor="#d2e718" arrowColor="#152852">
                <ET k={`s3.acc.${item.id}.btn`} v={item.buttonText} l={`Plataformas — ${nome}, botão`} />
              </HubButton>
            </div>
          </>
        )}
      </div>
      {/* Imagem (só card ativo) — ocupa o espaço restante, sem afetar a coluna de texto */}
      {active && (
        <div className="hidden md:block flex-1 min-w-0" style={{ padding: '20px 20px 20px 0' }}>
          <div className="w-full h-full overflow-hidden" style={{ borderRadius: 16 }}>
            <EImg
              k={`s3.acc.${item.id}.img`} v={item.image}
              l={`Plataformas — ${nome}, foto`}
              spec={{ w: 1000, h: 830, shape: 'paisagem', note: 'Aparece quando o card abre no carrossel.' }}
              alt={nome}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- Cards plataforma (linha 2) ---------- */
interface PlatCard {
  id: string; icon: string; iconSize: number; label: string; name: string; nameColor: string;
  desc: string; bg: string; labelColor: string; hubColor: string; descColor: string;
  btnBg: string; btnText: string; btnCircle: string; btnArrow: string;
}

const PLAT: PlatCard[] = [
  {
    id: 'academy', icon: '/icons/s3-icon-academy.svg', iconSize: 54, label: 'ACADEMY', name: 'Academy', nameColor: '#2d4ebf',
    desc: 'Formação, cursos, extensão, pós-graduação e comunidades educacionais.',
    bg: '#fff', labelColor: '#a7a4a4', hubColor: '#152852', descColor: '#797979',
    btnBg: '#d2e718', btnText: '#152852', btnCircle: 'rgba(0,0,0,0.1)', btnArrow: '#152852',
  },
  {
    id: 'alliance', icon: '/icons/s3-icon-alliance.svg', iconSize: 51, label: 'ALLIANCE', name: 'Alliance', nameColor: '#d2e718',
    desc: 'Rede estratégica de empresas, startups, universidades, ICTs e governos.',
    bg: '#2d4ebf', labelColor: 'rgba(255,255,255,0.7)', hubColor: '#fff', descColor: '#fff',
    btnBg: '#d2e718', btnText: '#2d4ebf', btnCircle: 'rgba(0,0,0,0.1)', btnArrow: '#2d4ebf',
  },
  {
    id: 'insights', icon: '/icons/s3-icon-insights.svg', iconSize: 44, label: 'INSIGHT', name: 'Insights', nameColor: '#d2e718',
    desc: 'Observatórios, pesquisas, white papers, artigos e inteligência estratégica.',
    bg: '#152852', labelColor: '#a7a4a4', hubColor: '#fff', descColor: '#fff',
    btnBg: '#d2e718', btnText: '#152852', btnCircle: 'rgba(0,0,0,0.1)', btnArrow: '#152852',
  },
  {
    id: 'digital', icon: '/icons/s3-icon-digital.svg', iconSize: 45, label: 'DIGITAL', name: 'Digital', nameColor: '#2d4ebf',
    desc: 'Portal, app, AVA, área do aluno e infraestrutura de acesso ao ecossistema.',
    bg: '#d2e718', labelColor: 'rgba(21,40,82,0.5)', hubColor: '#152852', descColor: '#152852',
    btnBg: '#2d4ebf', btnText: '#fff', btnCircle: 'rgba(0,0,0,0.1)', btnArrow: '#fff',
  },
];

function PlatformCard({ c }: { c: PlatCard }) {
  const [bg, bgProps] = useEditColor(`s3.plat.${c.id}.bg`, c.bg, `Card ${c.name} — cor de fundo`, `Card HUB PAN ${c.name}`);
  return (
    <div className="flex flex-col" {...bgProps} style={{ background: bg, borderRadius: 17, height: 372, padding: '36px 68px 48px 67px', border: bg === '#fff' ? '1px solid #ecedf0' : undefined }} data-animate>
      {/* gap ícone→rótulo varia por card p/ manter o rótulo sempre na mesma altura, como no Figma */}
      <EIcon k={`s3.plat.${c.id}.icone`} l={`Card ${c.name} — ícone`} defaultSize={c.iconSize} className="self-start" style={{ marginBottom: 75 - c.iconSize }}>
        <img src={c.icon} alt="" style={{ width: c.iconSize, height: c.iconSize }} />
      </EIcon>
      <p style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 11.9, letterSpacing: '3.58px', textTransform: 'uppercase', color: c.labelColor, marginBottom: 18 }}>
        <ET k={`s3.plat.${c.id}.label`} v={c.label} l={`Card ${c.name} — selo`} />
      </p>
      <p style={{ marginBottom: 13 }}>
        <span style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 30, color: c.hubColor }}>
          <ET k="s3.plat.marca" v="HUB PAN" l="Cards de plataforma — marca" />
        </span>{' '}
        <span style={{ fontFamily: 'Inter', fontWeight: 400, fontSize: 20, color: c.nameColor }}>
          <ET k={`s3.plat.${c.id}.nome`} v={c.name} l={`Card ${c.name} — nome`} />
        </span>
      </p>
      {/* margin-bottom:auto empurra o botão pra base do card, independente do nº de linhas da descrição */}
      <p style={{ fontFamily: 'Inter', fontSize: 14, lineHeight: '21px', color: c.descColor, marginBottom: 'auto' }}>
        <ERich k={`s3.plat.${c.id}.desc`} l={`Card ${c.name} — descrição`}>
          {c.desc}
        </ERich>
      </p>
      <div className="self-start mt-5">
        <HubButton
          size="sm"
          variant={c.btnBg === '#d2e718' ? 'lime' : 'blue'}
          textColor={c.btnText}
          circleColor={c.btnCircle}
          arrowColor={c.btnArrow}
          circleSize={36}
          arrowSize={13}
        >
          <ET k={`s3.plat.${c.id}.btn`} v="Explorar" l={`Card ${c.name} — botão`} />
        </HubButton>
      </div>
    </div>
  );
}

export default function S3Plataformas() {
  const ref = useReveal<HTMLElement>();
  const [active, setActive] = useState(0);
  const pausedRef = useRef(false);
  const [bg, bgProps] = useEditColor('s3.bg', '#ebebeb', 'Fundo da seção Plataformas');

  useEffect(() => {
    const t = setInterval(() => {
      if (!pausedRef.current) setActive((a) => (a + 1) % ACC.length);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <section ref={ref} className="relative w-full py-20 gutter" {...bgProps} style={{ background: bg }} onMouseEnter={() => (pausedRef.current = true)} onMouseLeave={() => (pausedRef.current = false)}>
      <p className="eyebrow text-muted mb-6" data-animate>
        <ET k="s3.eyebrow" v="PLATAFORMAS ESTRATÉGICAS" l="Plataformas — selo da seção" />
      </p>
      <h2 className="mb-12" style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 'clamp(32px,4vw,50px)', letterSpacing: '-0.5px', color: '#152852' }} data-animate>
        <ERich k="s3.titulo" l="Plataformas — título da seção">Três carros-chefe. Uma narrativa global.</ERich>
      </h2>

      {/* Linha 1 — Accordion */}
      <div className="flex flex-col lg:flex-row gap-4 mb-5">
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
