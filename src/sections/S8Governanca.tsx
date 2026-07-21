import { useReveal } from '../components/useReveal';
import HubButton from '../components/HubButton';
import { ERich, ET, useEditColor, useEditImage } from '../editor/fields';

const CARDS = [
  { id: 'transparencia', title: 'Transparência', desc: 'Critérios públicos de participação e prestação de contas.' },
  { id: 'compliance', title: 'Compliance', desc: 'Alinhamento com marcos regulatórios nacionais e internacionais.' },
  { id: 'governanca-ia', title: 'Governança de IA', desc: 'Uso responsável de IA centrado nas pessoas e nos ODS.' },
  { id: 'impacto-ods', title: 'Impacto ODS', desc: 'Projetos orientados aos Objetivos de Desenvolvimento Sustentável da ONU.' },
];

const ECOSSISTEMA = [
  'Brasil Master® Group — Legado e origem',
  'Premier Niveau® — Excelência educacional',
  'eGov Tecnologia® — Inovação pública',
  'EXPO BH® — Marco inicial',
  'EXPO NYC® — Diplomacia global',
];

export default function S8Governanca() {
  const ref = useReveal<HTMLElement>();
  const [bgSrc, bgImgProps] = useEditImage(
    's8.bg', '/images/s8-governanca-bg.webp', 'Governança — imagem de fundo',
    { w: 1600, h: 1200, shape: 'paisagem', note: 'Fica atrás do texto branco — prefira fotos escuras ou com área escura à esquerda.' }
  );
  const [rightBg, rightBgProps] = useEditColor('s8.direita.bg', '#2d4ebf', 'Fundo da coluna Ecossistema Fundador');

  return (
    <section ref={ref} className="relative w-full lg:min-h-screen grid lg:grid-cols-[3fr_2fr]">
      {/* Esquerda: imagem + overlay + cards glass */}
      <div id="home-governanca" className="relative overflow-hidden py-20 gutter">
        <img src={bgSrc} alt="" className="absolute inset-0 w-full h-full object-cover" {...bgImgProps} />
        <div className="relative z-10 pointer-events-none">
          <div className="pointer-events-auto">
          <p className="eyebrow mb-6" style={{ color: 'rgba(255,255,255,0.6)' }} data-animate>
            <ET k="s8.eyebrow" v="GOVERNANÇA GLOBAL" l="Governança — selo da seção" />
          </p>
          <h2 className="mb-6" style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 'clamp(36px,4vw,60px)', lineHeight: 1, letterSpacing: '-1.2px' }} data-animate>
            <ERich k="s8.titulo" l="Governança — título" baseW={568}>
              <span style={{ color: '#ffffff' }}>Estrutura que </span><span style={{ color: '#d2e718' }}>sustenta a ambição.</span>
            </ERich>
          </h2>
          <p className="mb-10" style={{ fontFamily: 'Inter', fontSize: 16, lineHeight: '25px', color: '#fff' }} data-animate>
            <ERich k="s8.desc" l="Governança — texto de apoio" baseW={524}>
              Transparência, compliance e responsabilidade institucional não como acessório, mas como vacina reputacional.
            </ERich>
          </p>
          <div className="grid sm:grid-cols-2 gap-6 max-w-[800px]">
            {CARDS.map((c) => (
              <div key={c.id} style={{ backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: 24 }} data-animate>
                <p style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 24, color: '#fff', marginBottom: 12 }}>
                  <ET k={`s8.card.${c.id}.titulo`} v={c.title} l={`Governança — card "${c.title}", título`} />
                </p>
                <div className="w-full h-px bg-white/30 mb-3" />
                <p style={{ fontFamily: 'Inter', fontWeight: 300, fontSize: 14, lineHeight: '20px', color: '#fff' }}>
                  <ERich k={`s8.card.${c.id}.desc`} l={`Governança — card "${c.title}", descrição`}>
                    {c.desc}
                  </ERich>
                </p>
              </div>
            ))}
          </div>
          </div>
        </div>
      </div>

      {/* Direita: fundo blue + lista numerada */}
      <div id="home-eco-fundador" className="relative py-20 flex flex-col" {...rightBgProps} style={{ background: rightBg }}>
        <div className="gutter lg:pl-16">
          {/* Espaçador invisível — mesma altura do eyebrow da esquerda, pra alinhar a base dos 2 títulos */}
          <div aria-hidden style={{ height: 48 }} />
          <h2 className="mb-6" style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 'clamp(36px,4vw,60px)', lineHeight: 1, letterSpacing: '-1.2px' }} data-animate>
            <ERich k="s8.eco.titulo" l="Ecossistema Fundador — título">
              <span style={{ color: '#ffffff' }}>Ecossistema</span><span style={{ color: '#d2e718' }}> Fundador</span>
            </ERich>
          </h2>
          {/* Espaçador invisível — mesma altura do parágrafo da esquerda, pra alinhar linhas com os cards */}
          <div aria-hidden style={{ height: 74 }} />
        </div>
        {/* Linhas divisórias — full-bleed na coluna azul, igual ao Figma */}
        <div className="mb-10" data-animate>
          {ECOSSISTEMA.map((item, i) => (
            <div key={i} className="border-t border-white/30">
              <div className="flex items-center justify-between gutter lg:pl-16" style={{ minHeight: 64 }}>
                <span style={{ fontFamily: 'Inter', fontSize: 16, color: '#fff' }}>
                  <ET k={`s8.eco.item.${i}`} v={item} l={`Ecossistema Fundador — item ${i + 1}`} />
                </span>
                <span style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 30, color: '#fff', letterSpacing: '-0.6px' }}>{String(i + 1).padStart(2, '0')}</span>
              </div>
            </div>
          ))}
          <div className="border-t border-white/30" />
        </div>
        <div className="gutter lg:pl-16" data-animate>
          <HubButton size="lg" variant="lime" circleColor="rgba(0,0,0,0.1)" arrowColor="#2d4ebf" iconKey="s8.eco.btn.icone" iconLabel="Ecossistema Fundador — botão, ícone" styleKey="s8.eco.btn" styleLabel="Ecossistema Fundador — botão">
            <span style={{ color: '#2d4ebf' }}><ET k="s8.eco.btn" v="Ver governança completa" l="Ecossistema Fundador — botão" /></span>
          </HubButton>
        </div>
      </div>
    </section>
  );
}
