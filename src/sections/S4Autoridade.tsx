import { useReveal } from '../components/useReveal';
import HubButton from '../components/HubButton';
import { EImg, ERich, ET, useEditColor } from '../editor/fields';

const TAGS = [
  ['NAÇÕES UNIDAS - NY', 'HARVARD SQUARE - CAMBRIDGE', 'MIPAD ONU'],
  ['EXPO BOSTON', 'EXPO NEW YORK', 'AV. PAULISTA - SP'],
];

/* Assets já vêm alinhados/dimensionados internamente (canvas uniforme 140×140,
   fundo transparente) — mesmo box pra todas. */
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
  const [bg, bgProps] = useEditColor('s4.bg', '#2d4ebf', 'Fundo da seção Autoridade');

  return (
    <section ref={ref} id="home-autoridade" className="relative w-full min-h-screen overflow-hidden" {...bgProps} style={{ background: bg }}>
      <div className="relative flex flex-col lg:flex-row min-h-screen">
        {/* Esquerda: conteúdo — largura fixa, acomoda título e badges sem quebrar errado */}
        <div className="flex flex-col justify-center gutter lg:pr-10 py-20 lg:py-0 lg:flex-shrink-0" style={{ maxWidth: 950 }}>
          <p className="eyebrow mb-8" style={{ color: 'rgba(255,255,255,0.69)' }} data-animate>
            <ET k="s4.eyebrow" v="AUTORIDADE & PRESENÇA" l="Autoridade — selo da seção" />
          </p>
          {/* Quebras exatas conferidas no Figma (6 linhas) — mantidas nos <br/> */}
          <h2 className="mb-10" style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 'clamp(32px, 4vw + 20px, 65px)', lineHeight: 1 }} data-animate>
            <ERich k="s4.titulo" l="Autoridade — título" baseW={738}>
              <span style={{ color: '#fff' }}>Quase uma década<br />construindo relações<br />institucionais concretas<br /></span>
              <span style={{ color: '#d2e718' }}>nos ambientes mais<br />estratégicos<br />do mundo.</span>
            </ERich>
          </h2>

          {/* Tags — 2 linhas fixas, sem quebrar dentro da linha */}
          <div className="flex flex-col gap-[19px] mb-12 max-w-full" data-animate>
            {TAGS.map((row, r) => (
              <div key={r} className="flex flex-wrap lg:flex-nowrap gap-[23px] lg:overflow-x-auto no-scrollbar">
                {row.map((t, i) => (
                  <span key={t} className="inline-flex items-center justify-center px-5 shrink-0" style={{ height: 40, border: '1.16px solid rgba(255,255,255,0.69)', borderRadius: 58, fontFamily: 'Inter', fontWeight: 500, fontSize: 16, color: '#fff', whiteSpace: 'nowrap' }}>
                    <ET k={`s4.tag.${r}.${i}`} v={t} l={`Autoridade — tag "${t}"`} />
                  </span>
                ))}
              </div>
            ))}
          </div>

          <div data-animate>
            <HubButton size="lg" variant="lime" iconKey="s4.btn.icone" iconLabel="Autoridade — botão, ícone" styleKey="s4.btn" styleLabel="Autoridade — botão" to="/o-hub-pan#inst-jornada">
              <ET k="s4.btn" v="Conheça a nossa História" l="Autoridade — botão" />
            </HubButton>
          </div>
        </div>

        {/* Direita: vídeo — sempre ocupa a altura toda (object-cover, nunca "letterbox") */}
        <div className="relative hidden lg:block flex-1 min-w-0 overflow-hidden">
          <video autoPlay muted loop playsInline className="absolute top-0 h-full w-full object-cover" style={{ left: -140 }}>
            <source src="/images/s4-autoridade-video.webm" type="video/webm" />
          </video>
        </div>
      </div>

      {/* Logos — posicionadas a partir da SEÇÃO inteira (referência do Figma), margem ~137px/1920 ≈ 7.14%. */}
      <div className="hidden xl:flex absolute top-0 bottom-0 flex-col justify-center gap-10 z-10" style={{ right: '7.14%' }}>
        {LOGOS.map((l, i) => (
          <span key={l.file} data-animate>
            <EImg
              k={`s4.logo.${i}`} v={`/images/${l.file}.png`}
              l={`Autoridade — logo ${i + 1}`}
              spec={{ w: 300, h: 300, shape: 'quadrada', fit: 'contain', note: 'Logo institucional com fundo transparente (PNG ou SVG).' }}
              style={{ width: LOGO_BOX, height: LOGO_BOX, objectFit: 'contain' }}
              alt={`Logo de parceiro institucional ${i + 1}`}
            />
          </span>
        ))}
      </div>
    </section>
  );
}
