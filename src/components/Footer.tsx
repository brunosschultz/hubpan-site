import { Link } from 'react-router-dom';

const COLUMNS: { title: string; links: { label: string; to: string }[] }[] = [
  {
    title: 'Institucional',
    links: [
      { label: 'O HUB PAN', to: '/o-hub-pan' },
      { label: 'Casos de Uso', to: '/casos-de-uso' },
      { label: 'Glossário', to: '/glossario' },
      { label: 'Imprensa', to: '/imprensa' },
    ],
  },
  {
    title: 'Plataformas',
    links: [
      { label: 'PROINTER', to: '/prointer' },
      { label: 'Fórum Mundial de IA', to: '/forum-mundial-ia' },
      { label: 'GovIA', to: '/govia' },
      { label: 'Insights', to: '/insights' },
    ],
  },
  {
    title: 'Conecte-se',
    links: [
      { label: 'Fale Conosco', to: '/contato' },
      { label: 'Seja um Parceiro', to: '/contato' },
      { label: 'Patrocinar o WAIF', to: '/forum-mundial-ia' },
      { label: 'Apoiar o PROINTER', to: '/prointer' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative w-full bg-navy">
      <div className="gutter py-20 grid gap-12 lg:grid-cols-[minmax(0,1.4fr)_1fr_1fr_1fr]">
        {/* Logo + descrição */}
        <div>
          <img src="/images/logo-hubpan-white.png" alt="HUB PAN" className="w-[180px] mb-6 object-contain" />
          <p style={{ fontFamily: 'Inter', fontSize: 16, lineHeight: '33px', color: '#fff', maxWidth: 383 }}>
            Infraestrutura global que conecta talentos, organizações, governos e territórios das Américas e da África a ecossistemas globais de inovação, educação, IA e cooperação.
          </p>
          <p className="mt-6" style={{ fontFamily: 'Inter', fontSize: 16, lineHeight: '33px', color: '#a7a4a4' }}>
            Sede Global: Harvard Square, Cambridge, MA<br />
            Sede Brasil: Av. Paulista, São Paulo, SP
          </p>
        </div>

        {/* Colunas */}
        {COLUMNS.map((col) => (
          <div key={col.title}>
            <p style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 24, lineHeight: '50px', color: '#fff', letterSpacing: '-0.48px' }}>{col.title}</p>
            {col.links.map((l) => (
              <Link key={l.label} to={l.to} className="block hover:text-white transition-colors" style={{ fontFamily: 'Inter', fontSize: 16, lineHeight: '50px', color: '#a7a4a4' }}>{l.label}</Link>
            ))}
          </div>
        ))}
      </div>

      {/* Barra inferior */}
      <div className="bg-black/20">
        <div className="gutter py-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p style={{ fontFamily: 'Inter', fontSize: 12, color: '#a7a4a4' }}>© 2026 HUB PAN. Todos os direitos reservados.</p>
          <p style={{ fontFamily: 'Inter', fontSize: 12, color: '#a7a4a4' }}>Brasil Master® Premier Niveau® eGov Tecnologia® EXPO BH® EXPO NYC®</p>
        </div>
      </div>
    </footer>
  );
}
