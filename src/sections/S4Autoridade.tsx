import { useReveal } from '../components/useReveal';
import HubButton from '../components/HubButton';

/* Quebras exatas conferidas no Figma (6 linhas — natural wrap não reproduz esse padrão com nossa métrica de fonte) */
const TITLE_LINES: { text: string; color: 'white' | 'lime' }[] = [
  { text: 'Quase uma década', color: 'white' },
  { text: 'construindo relações', color: 'white' },
  { text: 'institucionais concretas', color: 'white' },
  { text: 'nos ambientes mais', color: 'lime' },
  { text: 'estratégicos', color: 'lime' },
  { text: 'do mundo.', color: 'lime' },
];

const TAGS = [
  ['NAÇÕES UNIDAS - NY', 'HARVARD SQUARE - CAMBRIDGE', 'MIPAD ONU'],
  ['EXPO BOSTON', 'EXPO NEW YORK', 'AV. PAULISTA - SP'],
];

/* Assets já vêm alinhados/dimensionados internamente (canvas uniforme 140×140,
   fundo transparente) — mesmo box pra todas. Os blend modes do Figma (plus-lighter/
   screen/luminosity) existiam pra disfarçar fundos sólidos dos arquivos antigos;
   com fundo transparente de verdade eles só lavam a cor contra o vídeo — normal
   em todas mantém a logo sempre legível. */
const LOGOS: { file: string }[] = [
  { file: 's4-logo-1' },
  { file: 's4-logo-2' },
  { file: 's4-logo-3' },
  { file: 's4-logo-4' },
  { file: 's4-logo-5' },
];
const LOGO_BOX = 115;

export default function S4Autoridade() {
  const ref = useReveal<HTMLElement>();

  return (
    <section ref={ref} className="relative w-full min-h-screen bg-hubblue overflow-hidden">
      <div className="relative flex flex-col lg:flex-row min-h-screen">
        {/* Esquerda: conteúdo — largura fixa, acomoda título e badges sem quebrar errado */}
        <div className="flex flex-col justify-center gutter lg:pr-10 py-20 lg:py-0 lg:flex-shrink-0" style={{ maxWidth: 950 }}>
          <p className="eyebrow mb-8" style={{ color: 'rgba(255,255,255,0.69)' }} data-animate>AUTORIDADE & PRESENÇA</p>
          <h2 className="mb-10" style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 'clamp(32px, 4vw + 20px, 65px)', lineHeight: 1, maxWidth: 738 }} data-animate>
            {TITLE_LINES.map((line, i) => (
              <span key={i} style={{ display: 'block', color: line.color === 'white' ? '#fff' : '#d2e718' }}>
                {line.text}
              </span>
            ))}
          </h2>

          {/* Tags — 2 linhas fixas, sem quebrar dentro da linha */}
          <div className="flex flex-col gap-[19px] mb-12 max-w-full" data-animate>
            {TAGS.map((row, r) => (
              <div key={r} className="flex flex-wrap lg:flex-nowrap gap-[23px] lg:overflow-x-auto no-scrollbar">
                {row.map((t) => (
                  <span key={t} className="inline-flex items-center justify-center px-5 shrink-0" style={{ height: 40, border: '1.16px solid rgba(255,255,255,0.69)', borderRadius: 58, fontFamily: 'Inter', fontWeight: 500, fontSize: 16, color: '#fff', whiteSpace: 'nowrap' }}>
                    {t}
                  </span>
                ))}
              </div>
            ))}
          </div>

          <div data-animate>
            <HubButton size="lg" variant="lime">Conheça a nossa História</HubButton>
          </div>
        </div>

        {/* Direita: vídeo — sempre ocupa a altura toda (object-cover, nunca "letterbox") */}
        <div className="relative hidden lg:block flex-1 min-w-0 overflow-hidden">
          <video autoPlay muted loop playsInline className="absolute top-0 h-full w-full object-cover" style={{ left: -140 }}>
            <source src="/images/s4-autoridade-video.webm" type="video/webm" />
          </video>
        </div>
      </div>

      {/* Logos — posicionadas a partir da SEÇÃO inteira (referência do Figma), margem ~137px/1920 ≈ 7.14%.
          Escondidas em telas mais estreitas pra dar espaço ao vídeo (prioridade: vídeo em altura cheia). */}
      <div className="hidden xl:flex absolute top-0 bottom-0 flex-col justify-center gap-10 z-10" style={{ right: '7.14%' }}>
        {LOGOS.map((l) => (
          <img
            key={l.file}
            src={`/images/${l.file}.png`}
            alt=""
            style={{ width: LOGO_BOX, height: LOGO_BOX, objectFit: 'contain' }}
            data-animate
          />
        ))}
      </div>
    </section>
  );
}
