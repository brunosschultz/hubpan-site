import { useReveal } from '../components/useReveal';
import HubButton, { WHATSAPP_URL } from '../components/HubButton';
import { Icon1, Icon2, Icon3, Icon4 } from '../components/ManifestoIcons';
import { EIcon, EImg, ERich, ET, OffsetDragHandle, OrderEditChip, ScaleDragHandle, useEditColors, useEditOffset, useEditOrder, useEditScale } from '../editor/fields';

const circleData = [
  { id: 'c1', Icon: Icon1, top: '13.49%', left: '63.31%' },
  { id: 'c2', Icon: Icon2, top: '28.52%', left: '73.09%' },
  { id: 'c3', Icon: Icon3, top: '46.15%', left: '72.66%' },
  { id: 'c4', Icon: Icon4, top: '60.59%', left: '59.14%' },
];

const pStyle: React.CSSProperties = { fontFamily: 'Inter', fontSize: 18, lineHeight: '30px', color: '#000' };

export default function S2Manifesto() {
  const ref = useReveal<HTMLElement>();
  const [[bgC1, bgC2], bgProps] = useEditColors('Fundo da seção Manifesto', [
    { key: 's2.bg.c1', label: 'Cor principal (topo)', fallback: '#ffffff' },
    { key: 's2.bg.c2', label: 'Cor do degradê (base)', fallback: '#d2e718' },
  ]);
  // Ordem (imagem↔conteúdo), posição fina e tamanho da foto — travados por
  // dispositivo (Mobile/Tablet/Desktop independentes), ver fields.tsx.
  const { inverted } = useEditOrder('s2.layout.order', 'Manifesto — ordem imagem/conteúdo');
  const { dx, dy } = useEditOffset('s2.foto', 'Manifesto — posição da foto');
  const { scale } = useEditScale('s2.foto', 'Manifesto — tamanho da foto');

  return (
    <section
      ref={ref}
      id="home-manifesto"
      className="relative w-full overflow-hidden py-20 lg:py-0"
      {...bgProps}
      style={{ background: `linear-gradient(213deg, ${bgC1} 62.6%, ${bgC2} 100%)` }}
    >
      {/* Watermark HUB PAN — colada na base, levemente cortada pelo overflow da seção */}
      <p
        className="absolute pointer-events-none select-none left-0 whitespace-nowrap"
        style={{ bottom: '-10px', fontFamily: 'Luxenta', fontWeight: 600, fontSize: 'min(30vw, 447px)', lineHeight: 0.9, color: '#fff', opacity: 0.4, mixBlendMode: 'overlay' }}
      >
        HUB PAN
      </p>

      <div className="relative flex flex-col lg:grid lg:grid-cols-2 items-center lg:items-stretch gap-10 lg:gap-0 lg:h-[49.1667vw]">
        {/* Selo rotativo — anel de texto gira, globo central fica parado. */}
        <div
          className="hidden lg:block absolute z-10"
          style={{ width: 'clamp(96px, 11.25vw, 216px)', height: 'clamp(96px, 11.25vw, 216px)', right: '8.5%', top: '13%' }}
        >
          <img src="/icons/s2-selo-texto.svg" alt="" className="absolute inset-0 w-full h-full spin-slow" />
          <img src="/icons/s2-selo-globo.svg" alt="" className="absolute inset-0 w-full h-full" />
        </div>
        <OrderEditChip k="s2.layout.order" label="Manifesto — ordem imagem/conteúdo" style={{ top: 12, left: 12 }} />
        {/* Esquerda: imagem + círculos — `order` controlável por dispositivo (ver useEditOrder acima) */}
        <div className="relative w-full h-[400px] lg:h-[49.1667vw] flex items-end justify-center" style={{ order: inverted ? 2 : 1 }}>
          {/* "HUB PAN 2026" vertical */}
          <span
            className="hidden lg:block absolute left-0 top-[38%] -translate-y-1/2 origin-center whitespace-nowrap"
            style={{ fontFamily: 'Luxenta', fontWeight: 500, fontSize: 20, letterSpacing: '5.2px', color: '#152852', transform: 'rotate(-90deg) translateX(0)' }}
          >
            HUB PAN 2026
          </span>
          {/* Caixa da foto — proporção exata do Figma (695×845), alinhada na
              base. `data-animate` (entrada fade+slide via GSAP, useReveal)
              fica SÓ na caixa externa — o GSAP escreve `transform` direto
              no DOM por fora do React, então aplicar a posição/tamanho
              (dx/dy/scale) no MESMO nó seria sobrescrito assim que a
              animação de entrada terminasse. Por isso um wrapper interno
              separado carrega a posição fina e o tamanho, controláveis por
              dispositivo (ver useEditOffset/useEditScale acima) — translate
              ANTES de scale, desloca em px reais sem interferir no tamanho. */}
          <div className="relative" style={{ height: '89.5%', aspectRatio: '695 / 845' }} data-animate>
            <div
              className="w-full h-full"
              style={{
                transform: [
                  (dx || dy) ? `translate(${dx}px, ${dy}px)` : '',
                  scale !== 100 ? `scale(${scale / 100})` : '',
                ].filter(Boolean).join(' ') || undefined,
              }}
            >
              <EImg
                k="s2.foto" v="/images/s2-manifesto-pessoa.webp"
                l="Manifesto — foto principal"
                spec={{ w: 1390, h: 1690, shape: 'retrato', note: 'Foto vertical. O rosto/assunto deve ficar na parte de cima da imagem.' }}
                alt="Manifesto HUB PAN"
                className="w-full h-full object-cover rounded-2xl"
                style={{ objectPosition: 'center 15%' }}
              />
              {/* Círculos glass — ícones editáveis (picker Lucide ou SVG próprio) */}
              {circleData.map(({ id, Icon, top, left }) => (
                <div
                  key={id}
                  className="absolute flex items-center justify-center"
                  style={{
                    width: 115, height: 115, borderRadius: '50%', top, left,
                    backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
                    background: 'rgba(255,255,255,0.20)', border: '1px solid rgba(210,231,24,0.2)',
                  }}
                  data-animate
                >
                  <EIcon k={`s2.circulo.${id}.icone`} l={`Manifesto — ícone do círculo ${id.slice(1)}`} defaultSize={48} style={{ color: '#d2e718' }}>
                    <Icon size={48} color="#d2e718" />
                  </EIcon>
                </div>
              ))}
            </div>
          </div>
          <OffsetDragHandle k="s2.foto" label="Manifesto — posição da foto" style={{ bottom: 8, right: 8 }} />
          <ScaleDragHandle k="s2.foto" label="Manifesto — tamanho da foto" style={{ bottom: 8, right: 52 }} />
        </div>

        {/* Direita: conteúdo — `order` controlável por dispositivo (ver useEditOrder acima) */}
        <div className="relative w-full gutter lg:pl-0 lg:pr-[160px] flex flex-col justify-center" style={{ order: inverted ? 1 : 2 }}>
          <h2 className="mb-8" style={{ fontFamily: 'Luxenta', fontWeight: 500, fontSize: 'clamp(40px,4.5vw,65px)', lineHeight: 1.06, color: '#152852' }} data-animate>
            <ERich k="s2.titulo" l="Manifesto — título">
              Manifesto<br />Fundacional
            </ERich>
          </h2>
          <div className="mb-10 space-y-6" data-animate>
            <p style={pStyle}>
              <ERich k="s2.p1" l="Manifesto — parágrafo 1" baseW={503}>
                O <strong className="font-semibold">HUB PAN</strong> não nasce para apresentar uma nova marca. Ele nasce para dar <strong className="font-semibold">escala, forma e percepção global</strong> a tudo que o ecossistema já construiu.
              </ERich>
            </p>
            <p style={pStyle}>
              <ERich k="s2.p2" l="Manifesto — parágrafo 2" baseW={503}>
                Uma década de entregas reais, relações institucionais concretas e acesso a ambientes que poucas organizações no Brasil conseguem alcançar.
              </ERich>
            </p>
          </div>
          <div className="flex flex-wrap gap-4" data-animate>
            <HubButton size="lg" variant="blue" circleColor="#d2e718" icon={<span style={{ color: '#152852', fontSize: 12 }}>▶</span>} styleKey="s2.btn1" styleLabel="Manifesto — botão vídeo" as="a" href={WHATSAPP_URL}>
              <ET k="s2.btn1" v="Assistir Vídeo" l="Manifesto — botão vídeo" />
            </HubButton>
            <HubButton size="lg" variant="navy" circleColor="rgba(0,0,0,0.1)" arrowColor="#d2e718" iconKey="s2.btn2.icone" iconLabel="Manifesto — botão manifesto, ícone" styleKey="s2.btn2" styleLabel="Manifesto — botão manifesto" to="/o-hub-pan#inst-manifesto">
              <ET k="s2.btn2" v="Leia nosso manifesto completo" l="Manifesto — botão manifesto" />
            </HubButton>
          </div>
        </div>
      </div>
    </section>
  );
}
