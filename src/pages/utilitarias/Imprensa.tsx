import { Link } from 'react-router-dom';
import { ArrowUpRight, Download, Newspaper } from 'lucide-react';
import PageHero from '../../components/PageHero';
import HubButton from '../../components/HubButton';
import { useReveal } from '../../components/useReveal';

const RELEASES = [
  {
    data: 'Junho 2026', cat: 'LANÇAMENTO',
    titulo: 'HUB PAN lança portal global e unifica ecossistema de dez anos sob uma nova narrativa',
    desc: 'A plataforma reúne Brasil Master, Premier Niveau e eGov Tecnologia sob uma identidade internacional, com sedes em Harvard Square e na Avenida Paulista.',
  },
  {
    data: 'Maio 2026', cat: 'EVENTO',
    titulo: '1ª Expo Boston marca a estreia do ecossistema no principal polo tech dos EUA',
    desc: 'Primeira edição fora do eixo Brasil–Nova York abre a rota de eventos que culmina no Fórum Mundial de IA de 2027.',
  },
  {
    data: 'Novembro 2026', cat: 'AGENDA',
    titulo: 'HUB PAN ocupa o 4º andar das Nações Unidas para campanha global do WAIF',
    desc: 'Delegates Dining Room recebe o evento de lançamento internacional do Fórum Mundial de IA, em parceria com o MIPAD.',
  },
  {
    data: '2027', cat: 'PRÓXIMO CAPÍTULO',
    titulo: 'Fórum Mundial de IA confirma primeira edição em Cambridge, Massachusetts',
    desc: 'O maior ativo proprietário do HUB PAN estreia entre Harvard e MIT, com eixos de governo, educação, negócios e impacto.',
  },
];

const KIT = [
  { bg: '#152852', logo: '/images/logo-hubpan-white.png', label: 'Logo sobre fundo escuro' },
  { bg: '#ffffff', logo: '/images/logo-hubpan.png', label: 'Logo sobre fundo claro', border: true },
  { bg: '#d2e718', logo: '/images/logo-hubpan.png', label: 'Logo sobre lime' },
];

export default function Imprensa() {
  const ref = useReveal<HTMLElement>();
  const kitRef = useReveal<HTMLElement>();
  return (
    <>
      <PageHero
        eyebrow="SALA DE IMPRENSA · MÍDIA"
        title={<>A história é grande.<br /><span style={{ color: '#d2e718' }}>Os fatos também.</span></>}
        sub="Releases, dados verificáveis do ecossistema e kit de marca — tudo que uma boa pauta precisa."
        actions={<Link to="/contato"><HubButton size="lg" variant="lime">Contato para imprensa</HubButton></Link>}
      />

      {/* Releases */}
      <section ref={ref} className="py-24 lg:py-32 gutter bg-white">
        <div className="mb-14 max-w-[700px]">
          <p className="eyebrow text-muted mb-6" data-animate>RELEASES E PAUTAS</p>
          <h2 className="mb-4" style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 'clamp(32px,4vw,50px)', letterSpacing: '-0.5px', lineHeight: 1, color: '#152852' }} data-animate>
            O que está acontecendo.
          </h2>
        </div>
        <div>
          {RELEASES.map((r) => (
            <Link key={r.titulo} to="/contato" className="group grid md:grid-cols-[140px_1fr_auto] gap-4 md:gap-10 items-center py-8 border-b" style={{ borderColor: '#ecedf0' }} data-animate>
              <div>
                <p style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 11, letterSpacing: '2px', textTransform: 'uppercase', color: '#2d4ebf' }}>{r.cat}</p>
                <p style={{ fontFamily: 'Inter', fontSize: 14, color: '#a7a4a4' }}>{r.data}</p>
              </div>
              <div>
                <h3 className="mb-2 transition-colors group-hover:text-hubblue" style={{ fontFamily: 'Luxenta', fontWeight: 600, fontSize: 23, lineHeight: 1.15, color: '#152852' }}>{r.titulo}</h3>
                <p style={{ fontFamily: 'Inter', fontSize: 14.5, lineHeight: '24px', color: '#797979', maxWidth: 720 }}>{r.desc}</p>
              </div>
              <span className="hidden md:flex items-center justify-center rounded-full shrink-0 transition-colors duration-200 group-hover:bg-lime" style={{ width: 48, height: 48, border: '1px solid #ecedf0' }}>
                <ArrowUpRight size={20} color="#152852" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Kit de marca */}
      <section ref={kitRef} className="py-24 lg:py-32 gutter" style={{ background: '#f5f5f5' }}>
        <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-[700px]">
            <p className="eyebrow text-muted mb-6" data-animate>KIT DE MARCA</p>
            <h2 className="mb-4" style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 'clamp(32px,4vw,50px)', letterSpacing: '-0.5px', lineHeight: 1, color: '#152852' }} data-animate>
              Use a marca do jeito certo.
            </h2>
          </div>
          <div data-animate>
            <Link to="/contato">
              <HubButton size="md" variant="navy" icon={<Download size={14} color="#fff" />}>Solicitar kit completo</HubButton>
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {KIT.map((k) => (
            <div key={k.label} data-animate>
              <div className="rounded-[20px] h-[220px] flex items-center justify-center" style={{ background: k.bg, border: k.border ? '1px solid #ecedf0' : undefined }}>
                <img src={k.logo} alt="Logo HUB PAN" className="h-[110px] object-contain" />
              </div>
              <p className="mt-4" style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 14, color: '#152852' }}>{k.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contato de imprensa */}
      <section className="py-20 gutter bg-white">
        <div className="rounded-[20px] bg-navy p-10 lg:p-14 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <span className="hidden sm:flex items-center justify-center rounded-full shrink-0" style={{ width: 64, height: 64, background: 'rgba(255,255,255,0.08)' }}>
              <Newspaper size={28} strokeWidth={2} color="#d2e718" />
            </span>
            <div>
              <h3 className="mb-2" style={{ fontFamily: 'Luxenta', fontWeight: 600, fontSize: 26, lineHeight: 1.1, color: '#fff' }}>Cobrindo uma pauta com prazo?</h3>
              <p style={{ fontFamily: 'Inter', fontSize: 15, lineHeight: '25px', color: 'rgba(255,255,255,0.75)', maxWidth: 520 }}>
                Sinalize no formulário que é imprensa e nossa equipe prioriza o retorno com dados, fotos e porta-vozes.
              </p>
            </div>
          </div>
          <div className="shrink-0">
            <Link to="/contato"><HubButton size="lg" variant="lime">Falar com a assessoria</HubButton></Link>
          </div>
        </div>
      </section>
    </>
  );
}
