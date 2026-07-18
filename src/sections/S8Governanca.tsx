import { useReveal } from '../components/useReveal';
import HubButton from '../components/HubButton';

const CARDS = [
  { title: 'Transparência', desc: 'Critérios públicos de participação e prestação de contas.' },
  { title: 'Compliance', desc: 'Alinhamento com marcos regulatórios nacionais e internacionais.' },
  { title: 'Governança de IA', desc: 'Uso responsável de IA centrado nas pessoas e nos ODS.' },
  { title: 'Impacto ODS', desc: 'Projetos orientados aos Objetivos de Desenvolvimento Sustentável da ONU.' },
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

  return (
    <section ref={ref} className="relative w-full lg:min-h-screen grid lg:grid-cols-[3fr_2fr]">
      {/* Esquerda: imagem + overlay + cards glass */}
      <div className="relative overflow-hidden py-20 gutter">
        <img src="/images/s8-governanca-bg.webp" alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="relative z-10">
          <p className="eyebrow mb-6" style={{ color: 'rgba(255,255,255,0.6)' }} data-animate>GOVERNANÇA GLOBAL</p>
          <h2 className="mb-6" style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 'clamp(36px,4vw,60px)', lineHeight: 1, letterSpacing: '-1.2px', maxWidth: 568 }} data-animate>
            <span className="text-white">Estrutura que </span>
            <span style={{ color: '#d2e718' }}>sustenta a ambição.</span>
          </h2>
          <p className="mb-10" style={{ fontFamily: 'Inter', fontSize: 16, lineHeight: '25px', color: '#fff', maxWidth: 524 }} data-animate>
            Transparência, compliance e responsabilidade institucional não como acessório, mas como vacina reputacional.
          </p>
          <div className="grid sm:grid-cols-2 gap-6 max-w-[800px]">
            {CARDS.map((c) => (
              <div key={c.title} style={{ backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: 24 }} data-animate>
                <p style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 24, color: '#fff', marginBottom: 12 }}>{c.title}</p>
                <div className="w-full h-px bg-white/30 mb-3" />
                <p style={{ fontFamily: 'Inter', fontWeight: 300, fontSize: 14, lineHeight: '20px', color: '#fff' }}>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Direita: fundo blue + lista numerada — alinhado ao topo, como a esquerda (não mais centralizado) */}
      <div className="relative bg-hubblue py-20 flex flex-col">
        <div className="gutter lg:pl-16">
          {/* Espaçador invisível — mesma altura do eyebrow da esquerda, pra alinhar a base dos 2 títulos */}
          <div aria-hidden style={{ height: 48 }} />
          <h2 className="mb-6" style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 'clamp(36px,4vw,60px)', lineHeight: 1, letterSpacing: '-1.2px' }} data-animate>
            <span className="text-white">Ecossistema</span>
            <span style={{ color: '#d2e718' }}> Fundador</span>
          </h2>
          {/* Espaçador invisível — mesma altura do parágrafo de descrição da esquerda, pra alinhar linhas com os cards */}
          <div aria-hidden style={{ height: 74 }} />
        </div>
        {/* Linhas divisórias — full-bleed na coluna azul, igual ao Figma (texto continua alinhado à sanga) */}
        <div className="mb-10" data-animate>
          {ECOSSISTEMA.map((item, i) => (
            <div key={i} className="border-t border-white/30">
              <div className="flex items-center justify-between gutter lg:pl-16" style={{ minHeight: 64 }}>
                <span style={{ fontFamily: 'Inter', fontSize: 16, color: '#fff' }}>{item}</span>
                <span style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 30, color: '#fff', letterSpacing: '-0.6px' }}>{String(i + 1).padStart(2, '0')}</span>
              </div>
            </div>
          ))}
          <div className="border-t border-white/30" />
        </div>
        <div className="gutter lg:pl-16" data-animate>
          <HubButton size="lg" variant="lime" circleColor="rgba(0,0,0,0.1)" arrowColor="#2d4ebf">
            <span style={{ color: '#2d4ebf' }}>Ver governança completa</span>
          </HubButton>
        </div>
      </div>
    </section>
  );
}
