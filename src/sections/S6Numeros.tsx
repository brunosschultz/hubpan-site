import { useReveal } from '../components/useReveal';
import HubButton from '../components/HubButton';
import { EImg, ERich, ET, useEditColor } from '../editor/fields';

interface NumCard {
  id: string; num: string; img: string; desc: string; btn: string; edicoes?: boolean;
}

const CARDS: NumCard[] = [
  { id: 'forum', num: '15', img: 's6-numero-1', desc: 'Edições do Fórum Pan-Americano', btn: 'Saiba mais', edicoes: true },
  { id: 'ny', num: '04', img: 's6-numero-2', desc: 'Edições em Nova York', btn: 'Explorar', edicoes: true },
  { id: 'inicio', num: '2017', img: 's6-numero-3', desc: 'Início em Belo Horizonte', btn: 'Explorar' },
  { id: 'projetos', num: '+100', img: 's6-numero-4', desc: 'Projetos de inovação abrigados', btn: 'Explorar' },
];

export default function S6Numeros() {
  const ref = useReveal<HTMLElement>();
  const [bg, bgProps] = useEditColor('s6.bg', '#ecedf0', 'Fundo da seção Números');

  return (
    <section ref={ref} className="relative w-full pt-20 pb-[200px] gutter" {...bgProps} style={{ background: bg }}>
      <p className="eyebrow text-muted mb-6" data-animate>
        <ET k="s6.eyebrow" v="NÚMEROS VALIDADOS" l="Números — selo da seção" />
      </p>
      <h2 className="mb-12" style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 'clamp(32px,4vw,50px)', color: '#152852' }} data-animate>
        <ERich k="s6.titulo" l="Números — título da seção">O que foi construído é real.</ERich>
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {CARDS.map((c) => {
          const fontSize = c.num.length >= 4 ? 140 : 150;
          const tracking = c.num.length >= 4 ? '-7px' : '-7.5px';
          return (
            <div key={c.id} className="flex flex-col bg-white overflow-hidden" style={{ borderRadius: 20, height: 330 }} data-animate>
              {/* Imagem full-bleed + número — overflow:clip (não hidden): hidden ainda
                  permite scroll programático, e o focus da edição do número rolava o
                  recorte pra mostrar o cursor, "encolhendo" a foto visualmente */}
              <div className="relative flex items-end shrink-0" style={{ height: 205, borderRadius: '0 0 20px 20px', overflow: 'clip' }}>
                <EImg
                  k={`s6.card.${c.id}.img`} v={`/images/${c.img}.webp`}
                  l={`Números — foto do card "${c.desc}"`}
                  spec={{ w: 800, h: 460, shape: 'paisagem', note: 'O número grande fica sobre a parte de baixo da foto.' }}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 32%, rgba(0,0,0,0.4))' }} />
                <div className="relative flex items-end px-5 w-full pointer-events-none">
                  <span className="pointer-events-auto" style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize, letterSpacing: tracking, color: '#fff', lineHeight: 0.72, marginBottom: -13 }}>
                    <ET k={`s6.card.${c.id}.num`} v={c.num} l={`Números — número do card "${c.desc}"`} />
                  </span>
                  {c.edicoes && (
                    <span className="mb-4 ml-2 pointer-events-auto" style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 20, letterSpacing: '3px', textTransform: 'uppercase', color: '#fff' }}>
                      <ET k={`s6.card.${c.id}.sufixo`} v="Edições" l={`Números — sufixo do card "${c.desc}"`} />
                    </span>
                  )}
                </div>
              </div>
              {/* Descrição + botão */}
              <div className="flex flex-col flex-1" style={{ padding: '16px 20px 20px' }}>
                <p style={{ fontFamily: 'Inter', fontSize: 16, lineHeight: '24px', color: '#152852' }}>
                  <ERich k={`s6.card.${c.id}.desc`} l={`Números — descrição do card "${c.desc}"`}>
                    {c.desc}
                  </ERich>
                </p>
                <div style={{ flex: 1 }} />
                <div className="self-start">
                  <HubButton size="sm" variant="lime">
                    <ET k={`s6.card.${c.id}.btn`} v={c.btn} l={`Números — botão do card "${c.desc}"`} />
                  </HubButton>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
