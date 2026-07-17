const COLUMNS = [
  { title: 'Institucional', links: ['O HUB PAN', 'Manifesto', 'Legado', 'Governança', 'Imprensa'] },
  { title: 'Plataformas', links: ['PROINTER', 'Fórum Mundial de IA', 'GovIA', 'Academy', 'Alliance'] },
  { title: 'Conecte-se', links: ['Fale Conosco', 'Seja um Parceiro', 'Patrocinar o WAIF', 'Apoiar o PROINTER', 'LinkedIn'] },
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
              <a key={l} href="#" className="block hover:text-white transition-colors" style={{ fontFamily: 'Inter', fontSize: 16, lineHeight: '50px', color: '#a7a4a4' }}>{l}</a>
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
