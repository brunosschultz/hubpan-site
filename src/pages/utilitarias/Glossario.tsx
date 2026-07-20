import { useState } from 'react';
import { Link } from 'react-router-dom';
import PageHero from '../../components/PageHero';
import HubButton from '../../components/HubButton';
import { useReveal } from '../../components/useReveal';
import { ERich, ET, useEditColor } from '../../editor/fields';

/* ═══════════ Dados — extraídos do wireframe oficial (page-glossario) ═══════════ */

const CATEGORIAS = ['Todos', 'Inovação', 'Inteligência Artificial', 'Governança', 'Impacto Social', 'Cooperação'];
const CATEGORIA_SLUGS: Record<string, string> = {
  Todos: 'todos',
  Inovação: 'inovacao',
  'Inteligência Artificial': 'ia',
  Governança: 'governanca',
  'Impacto Social': 'impacto-social',
  Cooperação: 'cooperacao',
};

const TERMOS: { id: string; categoria: string; termo: string; p1: string; p2: string }[] = [
  {
    id: 'inovacao-de-impacto',
    categoria: 'Inovação', termo: 'Inovação de Impacto',
    p1: 'Inovação de impacto são soluções inovadoras — tecnológicas, sociais, pedagógicas ou organizacionais — que geram benefícios mensuráveis para comunidades, territórios ou sistemas, com alinhamento aos Objetivos de Desenvolvimento Sustentável da ONU (ODS). Não é inovação apenas pelo uso de tecnologia, mas pelo efeito real que ela produz na vida das pessoas.',
    p2: 'No contexto do HUB PAN, inovação de impacto é o critério central de seleção de projetos nos fóruns pan-americanos — qualquer iniciativa que orbite os ODS e gere mudança verificável é elegível.',
  },
  {
    id: 'ods',
    categoria: 'Impacto Social', termo: 'ODS — Objetivos de Desenvolvimento Sustentável',
    p1: 'Os ODS são os 17 Objetivos de Desenvolvimento Sustentável da Agenda 2030 da ONU — uma agenda global aprovada em 2015 por 193 países para erradicar a pobreza, proteger o planeta e garantir prosperidade para todos até 2030. Cada objetivo tem metas específicas e indicadores mensuráveis.',
    p2: 'O HUB PAN alinha suas plataformas diretamente a três ODS prioritários: ODS 4 (educação de qualidade, via PROINTER e Academy), ODS 10 (redução das desigualdades, via PROINTER e afroempreendedorismo) e ODS 17 (parcerias para os objetivos, via HUB PAN Alliance e cooperação internacional).',
  },
  {
    id: 'govtech',
    categoria: 'Inteligência Artificial', termo: 'GovTech',
    p1: 'GovTech — abreviação de Government Technology — é o campo que reúne tecnologias, plataformas e soluções digitais aplicadas ao setor público. Inclui desde softwares de gestão administrativa até inteligência artificial, big data, automação de serviços ao cidadão e plataformas de transparência e participação.',
    p2: 'O HUB PAN nasceu do nicho GovTech — mas expandiu sua narrativa para além dele. O GovIA é a plataforma que representa a evolução desse campo dentro do ecossistema, com foco específico em inteligência artificial para governos municipais e estaduais.',
  },
  {
    id: 'esg',
    categoria: 'Governança', termo: 'ESG',
    p1: 'ESG — Environmental, Social and Governance — é um conjunto de critérios usados para avaliar o desempenho de empresas e organizações em três dimensões: ambiental (impacto sobre o meio ambiente), social (relação com funcionários, fornecedores, comunidades e sociedade) e de governança (práticas de liderança, transparência e ética).',
    p2: 'No contexto do HUB PAN, o PROINTER é uma iniciativa de ESG concreto e rastreável — cada bolsa financiada por uma empresa gera dados de impacto documentados que podem ser incluídos em relatórios de sustentabilidade. A conexão com ODS torna o impacto ainda mais estruturado e verificável internacionalmente.',
  },
  {
    id: 'governanca-ia',
    categoria: 'Inteligência Artificial', termo: 'Governança de Inteligência Artificial',
    p1: 'Governança de inteligência artificial é o conjunto de políticas, princípios, regulações e práticas que orientam o desenvolvimento, uso e impacto de sistemas de IA — com foco em segurança, transparência, equidade, privacidade e responsabilidade. É um dos temas centrais da agenda global de tecnologia e política pública.',
    p2: 'O Fórum Mundial de IA do HUB PAN tem a governança de IA como um dos seus painéis temáticos centrais — especificamente no contexto das Américas e da África, onde o debate sobre IA inclusiva e IA para o bem público ainda tem espaço para contribuições originais.',
  },
  {
    id: 'pan-americanismo',
    categoria: 'Cooperação', termo: 'Pan-Americanismo',
    p1: 'Pan-americanismo é o movimento político e cultural que promove a cooperação, integração e solidariedade entre os países das Américas — do Canadá à Argentina. No contexto da inovação, representa a ideia de que desafios compartilhados entre países americanos — como desigualdade, acesso a tecnologia e desenvolvimento sustentável — podem ser melhor enfrentados por meio de redes e colaborações continentais.',
    p2: 'O HUB PAN opera com uma visão pan-americana e pan-africana: seus fóruns, missões e plataformas conectam atores das Américas e da África em torno de inovação de impacto, educação e cooperação institucional.',
  },
  {
    id: 'impacto-transgeracional',
    categoria: 'Impacto Social', termo: 'Impacto Transgeracional',
    p1: 'Impacto transgeracional é o efeito de uma ação ou iniciativa que vai além do beneficiário direto, alcançando gerações futuras. Uma professora da rede pública que acessa Harvard e a ONU pelo PROINTER não apenas transforma sua própria perspectiva — ela transforma como ela ensina, o que ela transmite e quem ela inspira ao longo de toda a sua carreira.',
    p2: 'O HUB PAN usa esse conceito para comunicar a dimensão real do PROINTER: não é um benefício individual, é um investimento em cadeias de impacto que se propagam por décadas.',
  },
  {
    id: 'ltv',
    categoria: 'Inovação', termo: 'LTV — Lifetime Value',
    p1: 'LTV — Lifetime Value ou Valor Vitalício — é um conceito de negócios que representa o valor total que um cliente gera para uma empresa ao longo de todo o seu relacionamento. Em plataformas de educação e assinatura, LTV é a métrica central: quanto mais tempo o aluno ou assinante permanece, maior o retorno sobre o investimento em aquisição.',
    p2: 'O HUB PAN usa o PROINTER como instrumento de fidelização de LTV educacional: bolsistas são selecionados entre alunos dos programas do ecossistema, criando um incentivo real para permanecer e evoluir dentro da plataforma.',
  },
  {
    id: 'ict',
    categoria: 'Cooperação', termo: 'ICT — Instituição de Ciência e Tecnologia',
    p1: 'ICT é a sigla para Instituição de Ciência, Tecnologia e Inovação — categoria jurídica brasileira que inclui universidades, institutos de pesquisa, centros tecnológicos e organizações sem fins lucrativos com foco em pesquisa e desenvolvimento. ICTs têm acesso a incentivos fiscais específicos e podem celebrar contratos de transferência de tecnologia com empresas privadas.',
    p2: 'A HUB PAN Alliance inclui ICTs como categoria de membros elegíveis — integrando o ecossistema de pesquisa e inovação ao network estratégico do HUB PAN.',
  },
];

export default function Glossario() {
  const ref = useReveal<HTMLElement>();
  const [ativo, setAtivo] = useState('Todos');
  const visiveis = ativo === 'Todos' ? TERMOS : TERMOS.filter((t) => t.categoria === ativo);
  const [bg, bgProps] = useEditColor('gloss.bg', '#ffffff', 'Fundo da seção Glossário');
  const [cardBg, cardBgProps] = useEditColor('gloss.termoCardBg', '#f5f5f5', 'Fundo dos cards de termo', 'Cards de termo');

  return (
    <>
      <PageHero
        eyebrow="REFERÊNCIA CONCEITUAL · INOVAÇÃO · IA · IMPACTO · COOPERAÇÃO"
        title={<ERich k="gloss.hero.titulo" l="Glossário — título do hero">Glossário HUB PAN</ERich>}
        sub={<ERich k="gloss.hero.sub" l="Glossário — subtítulo do hero">Definições claras dos conceitos centrais do ecossistema — para que qualquer pessoa, independente do nível técnico, entenda o que o HUB PAN faz e por que faz.</ERich>}
      />
      <section ref={ref} className="py-24 lg:py-32 gutter" {...bgProps} style={{ background: bg }}>
        <div className="flex flex-wrap gap-3 mb-12" data-animate>
          {CATEGORIAS.map((c) => (
            <button
              key={c}
              onClick={() => setAtivo(c)}
              className="rounded-full px-5 py-2 transition-colors"
              style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 13.5, background: ativo === c ? '#152852' : '#f5f5f5', color: ativo === c ? '#fff' : '#797979' }}
            >
              <ET k={`gloss.categoria.${CATEGORIA_SLUGS[c]}`} v={c} l={`Glossário — categoria de filtro "${c}"`} />
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {visiveis.map((t) => (
            <div key={t.id} className="rounded-[20px] p-7" {...cardBgProps} style={{ background: cardBg }} data-animate>
              <p className="mb-3" style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 10.5, letterSpacing: '1.8px', textTransform: 'uppercase', color: '#2d4ebf' }}>
                <ET k={`gloss.termo.${t.id}.categoria`} v={t.categoria} l={`Glossário — categoria do termo "${t.termo}"`} />
              </p>
              <h3 className="mb-3" style={{ fontFamily: 'Luxenta', fontWeight: 600, fontSize: 22, lineHeight: 1.15, color: '#152852' }}>
                <ERich k={`gloss.termo.${t.id}.titulo`} l={`Glossário — título do termo "${t.termo}"`}>{t.termo}</ERich>
              </h3>
              <p className="mb-3" style={{ fontFamily: 'Inter', fontSize: 14.5, lineHeight: '24px', color: '#797979' }}>
                <ERich k={`gloss.termo.${t.id}.p1`} l={`Glossário — parágrafo 1 do termo "${t.termo}"`}>{t.p1}</ERich>
              </p>
              <p style={{ fontFamily: 'Inter', fontSize: 14.5, lineHeight: '24px', color: '#797979' }}>
                <ERich k={`gloss.termo.${t.id}.p2`} l={`Glossário — parágrafo 2 do termo "${t.termo}"`}>{t.p2}</ERich>
              </p>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-wrap items-center gap-6" data-animate>
          <p style={{ fontFamily: 'Inter', fontSize: 16, color: '#797979' }}>
            <ERich k="gloss.cta.texto" l="Glossário — texto de sugestão de termo">Não encontrou o termo que buscava? Sugira uma entrada para o glossário.</ERich>
          </p>
          <Link to="/contato"><HubButton size="md" variant="navy"><ET k="gloss.cta.btn" v="Sugerir um termo" l="Glossário — botão de sugestão" /></HubButton></Link>
        </div>
      </section>
    </>
  );
}
