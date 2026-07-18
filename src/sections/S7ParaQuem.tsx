import { useReveal } from '../components/useReveal';
import HubButton from '../components/HubButton';

interface Persona {
  img: string; label: string; btn: string;
}

// Todos os 5 cards seguem o mesmo padrão (sem zigue-zague): caixa cinza embaixo
// por padrão, foto sempre alinhada no mesmo lugar; no hover a caixa sobe, fica
// lima, e o botão aparece embaixo, centrado na linha onde a foto termina.
const PERSONAS: Persona[] = [
  { img: 's7-persona-1', label: 'Sou Governo', btn: 'Conhecer GovIA' },
  { img: 's7-persona-2', label: 'Sou Empresa', btn: 'Saiba mais' },
  { img: 's7-persona-3', label: 'Sou Educador', btn: 'Saiba mais' },
  { img: 's7-persona-4', label: 'Sou Investidor', btn: 'Saiba mais' },
  { img: 's7-persona-5', label: 'Sou Comunidade', btn: 'Saiba mais' },
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
          // Wrapper com proporção fixa — reserva o espaço máximo (caixa baixa + botão do hover)
          // pra nada nunca empurrar a seção de baixo.
          <div key={p.label} className="group relative w-full" style={{ aspectRatio: '1 / 1.379' }} data-animate>
            {/* Caixa colorida — cinza embaixo por padrão; no hover sobe pro topo + fica lima */}
            <div className="absolute left-0 top-[29.8%] w-full h-[70.2%] rounded-[20px] transition-all duration-200 bg-gray150 group-hover:bg-lime group-hover:top-0" />

            {/* Label — acompanha a caixa; no hover vai pro topo junto */}
            <p
              className="absolute left-0 right-0 top-[88.96%] text-center px-4 transition-all duration-200 font-medium text-[16px] group-hover:font-semibold group-hover:text-[20px] group-hover:top-[4.87%]"
              style={{ fontFamily: 'Inter', color: '#152852' }}
            >
              {p.label}
            </p>

            {/* Foto — posição sempre fixa, igual em todos os cards e em qualquer estado.
                No hover só um leve zoom (scale), nunca muda de posição. */}
            <div
              className="absolute left-1/2 -translate-x-1/2 top-[15.25%] overflow-hidden rounded-[20px] w-[87.3%]"
              style={{ aspectRatio: '259 / 280' }}
            >
              <img
                src={`/images/${p.img}.webp`}
                alt={p.label}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            {/* Botão — só visível no hover; o CENTRO do botão fica exatamente na linha
                onde a foto termina (83.68% da altura do wrapper). */}
            <div className="absolute left-1/2 top-[83.68%] -translate-x-1/2 -translate-y-1/2 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto">
              <HubButton size="sm" variant="blue">{p.btn}</HubButton>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
