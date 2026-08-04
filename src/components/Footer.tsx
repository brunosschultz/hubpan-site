import { Link } from 'react-router-dom';
import { EImg, ERich, ET, useEditColor } from '../editor/fields';

/* Textos do rodapé são editáveis pelo editor visual (chaves f.*) — como o
   Footer é compartilhado, a edição vale automaticamente pra todas as páginas. */
const COLUMNS: { id: string; title: string; links: { label: string; to: string }[] }[] = [
  {
    id: 'institucional',
    title: 'Institucional',
    links: [
      { label: 'O HUB PAN', to: '/o-hub-pan' },
      { label: 'Casos de Uso', to: '/casos-de-uso' },
      { label: 'Glossário', to: '/glossario' },
      { label: 'Imprensa', to: '/imprensa' },
    ],
  },
  {
    id: 'plataformas',
    title: 'Plataformas',
    links: [
      { label: 'PROINTER', to: '/prointer' },
      { label: 'Fórum Mundial de IA', to: '/forum-mundial-ia' },
      { label: 'eGovIA', to: '/govia' },
      { label: 'Insights', to: '/insights' },
      /* EXPOs entra no FIM da lista de propósito: a chave de editor de cada
       * link é o ÍNDICE (`f.col.plataformas.link.<j>`) — inserir no meio
       * deslocaria todas as chaves seguintes e faria um override salvo
       * aparecer no link errado. Acrescentar no fim é seguro. */
      { label: 'EXPOs', to: '/expos' },
    ],
  },
  {
    id: 'conecte',
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
  const [bg, bgProps] = useEditColor('f.bg', '#152852', 'Fundo do rodapé');

  return (
    <footer className="relative w-full" {...bgProps} style={{ background: bg }}>
      <div className="gutter py-20 grid gap-12 lg:grid-cols-[minmax(0,1.4fr)_1fr_1fr_1fr]">
        {/* Logo + descrição */}
        <div>
          <EImg
            k="f.logo" v="/images/logo-hubpan-white.png"
            l="Logo do rodapé"
            spec={{ w: 540, h: 240, shape: 'paisagem', fit: 'contain', note: 'Versão clara da logo, fundo transparente (PNG ou SVG).' }}
            alt="HUB PAN"
            className="w-[180px] mb-6 object-contain"
          />
          <p style={{ fontFamily: 'Inter', fontSize: 16, lineHeight: '33px', color: '#fff' }}>
            <ERich k="f.desc" l="Rodapé — descrição" baseW={383}>
              Infraestrutura global que conecta talentos, organizações, governos e territórios das Américas e da África a ecossistemas globais de inovação, educação, IA e cooperação.
            </ERich>
          </p>
          <p className="mt-6" style={{ fontFamily: 'Inter', fontSize: 16, lineHeight: '33px', color: '#a7a4a4' }}>
            <ERich k="f.enderecos" l="Rodapé — endereços">
              Sede Global: Harvard Square, Cambridge, MA<br />
              Sede Brasil: Av. Paulista, São Paulo, SP
            </ERich>
          </p>
        </div>

        {/* Colunas */}
        {COLUMNS.map((col) => (
          <div key={col.id}>
            <p style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 24, lineHeight: '50px', color: '#fff', letterSpacing: '-0.48px' }}>
              <ET k={`f.col.${col.id}.titulo`} v={col.title} l={`Rodapé — título da coluna "${col.title}"`} />
            </p>
            {col.links.map((l, j) => (
              <Link key={l.label} to={l.to} className="block hover:text-white transition-colors" style={{ fontFamily: 'Inter', fontSize: 16, lineHeight: '50px', color: '#a7a4a4' }}>
                <ET k={`f.col.${col.id}.link.${j}`} v={l.label} l={`Rodapé — link "${l.label}"`} />
              </Link>
            ))}
          </div>
        ))}
      </div>

      {/* Barra inferior */}
      <div className="bg-black/20">
        <div className="gutter py-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p style={{ fontFamily: 'Inter', fontSize: 12, color: '#a7a4a4' }}>
            <ET k="f.copyright" v="© 2026 HUB PAN. Todos os direitos reservados." l="Rodapé — copyright" />
          </p>
          <p style={{ fontFamily: 'Inter', fontSize: 12, color: '#a7a4a4' }}>
            <ET k="f.marcas" v="Brasil Master® Premier Niveau® eGov Tecnologia® eGovIA® EXPO BH® EXPO NYC® EXPO BOSTON®" l="Rodapé — marcas" />
          </p>
        </div>
      </div>
    </footer>
  );
}
