import { useReveal } from '../components/useReveal';
import HubButton from '../components/HubButton';
import ArrowIcon from '../components/ArrowIcon';
import { Icon1, Icon2, Icon3, Icon4 } from '../components/ManifestoIcons';

const circleData = [
  { Icon: Icon1, top: '13.49%', left: '63.31%' },
  { Icon: Icon2, top: '28.52%', left: '73.09%' },
  { Icon: Icon3, top: '46.15%', left: '72.66%' },
  { Icon: Icon4, top: '60.59%', left: '59.14%' },
];

export default function S2Manifesto() {
  const ref = useReveal<HTMLElement>();

  return (
    <section
      ref={ref}
      className="relative w-full overflow-hidden py-20 lg:py-0"
      style={{ background: 'linear-gradient(213deg, #ffffff 62.6%, #d2e718 100%)' }}
    >
      {/* Watermark HUB PAN — colada na base, levemente cortada pelo overflow da seção */}
      <p
        className="absolute pointer-events-none select-none left-0 whitespace-nowrap"
        style={{ bottom: '-10px', fontFamily: 'Luxenta', fontWeight: 600, fontSize: 'min(30vw, 447px)', lineHeight: 0.9, color: '#fff', opacity: 0.4, mixBlendMode: 'overlay' }}
      >
        HUB PAN
      </p>

      <div className="relative flex flex-col lg:grid lg:grid-cols-2 items-center lg:items-stretch gap-10 lg:gap-0 lg:h-[49.1667vw]">
        {/* Selo rotativo — anel de texto gira, globo central fica parado. Escala com a seção (vw) e não gruda na quina. */}
        <div
          className="hidden lg:block absolute z-10"
          style={{ width: 'clamp(96px, 11.25vw, 216px)', height: 'clamp(96px, 11.25vw, 216px)', right: '8.5%', top: '13%' }}
        >
          <img src="/icons/s2-selo-texto.svg" alt="" className="absolute inset-0 w-full h-full spin-slow" />
          <img src="/icons/s2-selo-globo.svg" alt="" className="absolute inset-0 w-full h-full" />
        </div>
        {/* Esquerda: imagem + círculos */}
        <div className="relative w-full h-[400px] lg:h-[49.1667vw] flex items-end justify-center">
          {/* "HUB PAN 2026" vertical */}
          <span
            className="hidden lg:block absolute left-0 top-[38%] -translate-y-1/2 origin-center whitespace-nowrap"
            style={{ fontFamily: 'Luxenta', fontWeight: 500, fontSize: 20, letterSpacing: '5.2px', color: '#152852', transform: 'rotate(-90deg) translateX(0)' }}
          >
            HUB PAN 2026
          </span>
          {/* Caixa da foto — proporção exata do Figma (695×845), alinhada na base */}
          <div className="relative" style={{ height: '89.5%', aspectRatio: '695 / 845' }} data-animate>
            <img
              src="/images/s2-manifesto-pessoa.webp"
              alt="Manifesto HUB PAN"
              className="w-full h-full object-cover rounded-2xl"
              style={{ objectPosition: 'center 15%' }}
            />
            {/* Círculos glass — posicionados relativos à foto p/ acompanhar responsividade */}
            {circleData.map(({ Icon, top, left }, i) => (
              <div
                key={i}
                className="absolute flex items-center justify-center"
                style={{
                  width: 115, height: 115, borderRadius: '50%', top, left,
                  backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
                  background: 'rgba(255,255,255,0.20)', border: '1px solid rgba(210,231,24,0.2)',
                }}
                data-animate
              >
                <Icon size={48} color="#d2e718" />
              </div>
            ))}
          </div>
        </div>

        {/* Direita: conteúdo */}
        <div className="relative w-full gutter lg:pl-0 lg:pr-[160px] flex flex-col justify-center">
          <h2 className="mb-8" style={{ fontFamily: 'Luxenta', fontWeight: 500, fontSize: 'clamp(40px,4.5vw,65px)', lineHeight: 1.06, color: '#152852' }} data-animate>
            Manifesto<br />Fundacional
          </h2>
          <div className="mb-10 space-y-6" style={{ maxWidth: 503 }} data-animate>
            <p style={{ fontFamily: 'Inter', fontSize: 18, lineHeight: '30px', color: '#000' }}>
              O <strong className="font-semibold">HUB PAN</strong> não nasce para apresentar uma nova marca. Ele nasce para dar <strong className="font-semibold">escala, forma e percepção global</strong> a tudo que o ecossistema já construiu.
            </p>
            <p style={{ fontFamily: 'Inter', fontSize: 18, lineHeight: '30px', color: '#000' }}>
              Uma década de entregas reais, relações institucionais concretas e acesso a ambientes que poucas organizações no Brasil conseguem alcançar.
            </p>
          </div>
          <div className="flex flex-wrap gap-4" data-animate>
            <HubButton size="lg" variant="blue" circleColor="#d2e718" icon={<span style={{ color: '#152852', fontSize: 12 }}>▶</span>}>
              Assistir Vídeo
            </HubButton>
            <HubButton size="lg" variant="navy" circleColor="rgba(0,0,0,0.1)" arrowColor="#d2e718" icon={<ArrowIcon color="#d2e718" size={13} />}>
              Leia nosso manifesto completo
            </HubButton>
          </div>
        </div>
      </div>
    </section>
  );
}
