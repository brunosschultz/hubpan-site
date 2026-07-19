import { Link } from 'react-router-dom';
import PageHero from '../../components/PageHero';
import HubButton from '../../components/HubButton';
import { useReveal } from '../../components/useReveal';

const TERMOS: { termo: string; def: string }[] = [
  { termo: 'HUB PAN', def: 'Plataforma internacional de inovação que conecta as Américas e a África a ecossistemas globais de inovação, educação, IA e cooperação. A narrativa unificadora de um ecossistema com quase dez anos de entregas.' },
  { termo: 'Fórum Pan-Americano da Inovação', def: 'O fórum original do ecossistema, criado em 2017 em Belo Horizonte — 15 edições realizadas, incluindo quatro em Nova York e uma em Boston.' },
  { termo: 'WAIF · Fórum Mundial de IA', def: 'World Artificial Intelligence Forum — o maior ativo proprietário do HUB PAN. Primeira edição em 2027, em Cambridge, Massachusetts.' },
  { termo: 'PROINTER', def: 'Programa internacional de bolsas do HUB PAN: intercâmbio de alto impacto para professores da rede pública e afroempreendedores, com imersão em Harvard Square, ONU, Nova York e Boston.' },
  { termo: 'GovIA', def: 'Plataforma de assinatura de IA para municípios, estados e consórcios públicos — ferramentas, formação de servidores e Observatório de IA em um único contrato.' },
  { termo: 'HUB PAN Academy', def: 'A frente educacional do ecossistema: formação, cursos, extensão, pós-graduação e comunidades. Herdeira direta da Premier Niveau.' },
  { termo: 'HUB PAN Alliance', def: 'Rede estratégica de empresas, startups, universidades, ICTs e governos conectados ao ecossistema — networking institucional, missões e visibilidade global.' },
  { termo: 'HUB PAN Digital', def: 'A infraestrutura de acesso: portal, aplicativo, AVA, área do aluno e biblioteca do ecossistema.' },
  { termo: 'HUB PAN Insights', def: 'A frente de inteligência: observatórios, pesquisas, white papers e análises estratégicas sobre IA, educação e cooperação.' },
  { termo: 'MIPAD', def: 'Most Influential People of African Descent — organismo vinculado à ONU que reconhece as pessoas negras mais influentes do mundo. Parceiro estratégico fundacional do HUB PAN.' },
  { termo: 'ODS', def: 'Objetivos de Desenvolvimento Sustentável da ONU — o referencial de impacto que orienta programas, seleção de projetos e critérios de avaliação do ecossistema.' },
  { termo: 'Smart Cities', def: 'Agenda de cidades inteligentes que, conectada aos ODS, deu origem à tese do primeiro fórum em Belo Horizonte, em 2017.' },
  { termo: 'Brasil Master® Group', def: 'Marca fundadora do ecossistema — base histórica e credencial do Fórum Pan-Americano da Inovação, registrada no INPI.' },
  { termo: 'Premier Niveau®', def: 'Marca fundadora da frente educacional — extensão universitária, pós-graduação lato sensu e educação executiva de alto padrão.' },
  { termo: 'eGov Tecnologia®', def: 'Marca fundadora da frente govtech — experiência real com municípios e estados que deu origem à GovIA.' },
  { termo: 'EXPO BH® · EXPO NYC®', def: 'As marcas de eventos do ecossistema em Belo Horizonte e Nova York, registradas no INPI — o legado documentado de 15 edições.' },
];

export default function Glossario() {
  const ref = useReveal<HTMLElement>();
  return (
    <>
      <PageHero
        eyebrow="REFERÊNCIA · TERMOS DO ECOSSISTEMA"
        title={<>Todo ecossistema tem<br />seu vocabulário. <span style={{ color: '#d2e718' }}>Este é o nosso.</span></>}
        sub="Marcas, programas e conceitos que aparecem em todo o site — explicados sem rodeio."
      />
      <section ref={ref} className="py-24 lg:py-32 gutter bg-white">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {TERMOS.map((t) => (
            <div key={t.termo} className="rounded-[20px] p-7" style={{ background: '#f5f5f5' }} data-animate>
              <h3 className="mb-3" style={{ fontFamily: 'Luxenta', fontWeight: 600, fontSize: 22, lineHeight: 1.1, color: '#152852' }}>{t.termo}</h3>
              <p style={{ fontFamily: 'Inter', fontSize: 14.5, lineHeight: '24px', color: '#797979' }}>{t.def}</p>
            </div>
          ))}
        </div>
        <div className="mt-14 flex flex-wrap items-center gap-6" data-animate>
          <p style={{ fontFamily: 'Inter', fontSize: 16, color: '#797979' }}>Ficou faltando algum termo?</p>
          <Link to="/contato"><HubButton size="md" variant="navy">Fale com a gente</HubButton></Link>
        </div>
      </section>
    </>
  );
}
