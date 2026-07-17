import { useReveal } from '../components/useReveal';
import HubButton from '../components/HubButton';

interface Persona {
  img: string; label: string; active?: boolean; btn?: string; high: boolean;
}

// Zigue-zague: cards 1,3,5 no topo (label em cima), 2,4 embaixo (label na base)
const PERSONAS: Persona[] = [
  { img: 's7-persona-1', label: 'Sou Governo', active: true, btn: 'Conhecer GovIA', high: true },
  { img: 's7-persona-2', label: 'Sou Empresa', high: false },
  { img: 's7-persona-3', label: 'Sou Educador', high: true },
  { img: 's7-persona-4', label: 'Sou Investidor', high: false },
  { img: 's7-persona-5', label: 'Sou Comunidade', high: true },
];

export default function S7ParaQuem() {
  const ref = useReveal<HTMLElement>();

  return (
    <section ref={ref} className="relative w-full py-20 gutter bg-white">
      <p className="eyebrow text-muted mb-6" data-animate>PARA QUEM É O HUB PAN</p>
      <h2 className="mb-4" style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 'clamp(32px,4vw,50px)', color: '#152852' }} data-animate>
        Qual é o seu caminho?
      </h2>
      <p className="mb-16" style={{ fontFamily: 'Inter', fontSize: 16, color: '#a7a4a4', maxWidth: 875 }} data-animate>
        O ecossistema conecta perfis diferentes ao que cada um precisa. Escolha o seu ponto de entrada.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 items-start">
        {PERSONAS.map((p) => (
          <div key={p.label} className={`relative ${p.high ? '' : 'lg:mt-[122px]'}`} data-animate>
            {/* Card de fundo */}
            <div
              className="relative rounded-[20px] flex flex-col p-5 transition-colors duration-200 group"
              style={{ background: p.active ? '#d2e718' : '#ebebeb', minHeight: 400 }}
            >
              {p.high && !p.active && (
                <p className="mb-4" style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 16, color: '#152852' }}>{p.label}</p>
              )}
              {p.active && (
                <p className="mb-4" style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 20, color: '#152852' }}>{p.label}</p>
              )}
              {/* Imagem */}
              <div className="overflow-hidden rounded-[20px]" style={{ aspectRatio: '259/280' }}>
                <img src={`/images/${p.img}.webp`} alt={p.label} className="w-full h-full object-cover" />
              </div>
              {!p.high && !p.active && (
                <p className="mt-4" style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 16, color: '#152852' }}>{p.label}</p>
              )}
              {p.active && p.btn && (
                <div className="mt-5">
                  <HubButton size="sm" variant="blue">{p.btn}</HubButton>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
