import { Link } from 'react-router-dom';
import PageHero from '../../components/PageHero';
import HubButton from '../../components/HubButton';
import CTABanner from '../../components/CTABanner';
import { useReveal } from '../../components/useReveal';
import { useTilt } from '../../components/useTilt';

const CASOS = [
  {
    img: 's3-accordion-govia', tag: 'GOVERNOS · GOVIA', titulo: 'A prefeitura que saiu do zero em IA',
    desc: 'Um município de médio porte adere à GovIA, faz o diagnóstico de maturidade e coloca assistentes de IA nas secretarias de saúde e educação — com servidores formados pela própria plataforma.',
    resultado: 'Primeiras entregas em semanas, não em anos.', to: '/govia',
  },
  {
    img: 's7-persona-2', tag: 'EDUCAÇÃO · PROINTER', titulo: 'A professora que atravessou a ponte',
    desc: 'Selecionada por edital público, uma professora da rede estadual faz imersão em Harvard Square e na ONU — e volta com um projeto de replicação para toda a sua diretoria de ensino.',
    resultado: 'Uma bolsa, centenas de alunos alcançados.', to: '/prointer',
  },
  {
    img: 's3-accordion-forum', tag: 'EMPREENDEDORISMO · MIPAD', titulo: 'O afroempreendedor que chegou ao mercado global',
    desc: 'Via PROINTER e rede MIPAD, um fundador brasileiro conecta seu negócio a mentores internacionais e apresenta sua tese nos ambientes institucionais de Nova York.',
    resultado: 'Rede global, credencial institucional.', to: '/prointer',
  },
  {
    img: 'forum-hero-mit', tag: 'EMPRESAS · WAIF', titulo: 'A marca que entrou na fundação do fórum',
    desc: 'Uma empresa de tecnologia assume cota fundadora do Fórum Mundial de IA e ativa sua marca em toda a rota 2026-2027 — da Expo Boston ao 4º andar da ONU.',
    resultado: 'Autoridade construída antes da concorrência chegar.', to: '/forum-mundial-ia',
  },
  {
    img: 'inst-cambridge-harvard', tag: 'ACADEMIA · ALLIANCE', titulo: 'A universidade que virou parceira global',
    desc: 'Uma universidade brasileira entra na HUB PAN Alliance, leva pesquisadores às missões internacionais e co-produz análises com o Insights.',
    resultado: 'Presença internacional sem abrir campus fora.', to: '/o-hub-pan',
  },
  {
    img: 'inst-hero-onu', tag: 'GOVERNOS · DELEGAÇÕES', titulo: 'A delegação que conheceu a ONU por dentro',
    desc: 'Gestores públicos integram uma delegação oficial do ecossistema em Nova York — agenda real dentro das Nações Unidas, com a credencial de dez anos de relações do HUB PAN.',
    resultado: 'Relações institucionais que nenhum voo comprado entrega.', to: '/contato',
  },
];

function CasoCard({ c }: { c: (typeof CASOS)[number] }) {
  const tilt = useTilt<HTMLDivElement>(4, 6);
  return (
    <Link to={c.to} className="block h-full">
      <div ref={tilt} className="flex flex-col rounded-[20px] overflow-hidden bg-white h-full group cursor-pointer" style={{ border: '1px solid #ecedf0' }} data-animate>
        <div className="relative overflow-hidden shrink-0 h-[210px]">
          <img src={`/images/${c.img}.webp`} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        </div>
        <div className="flex flex-col flex-1 p-7">
          <p className="mb-3" style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 10.5, letterSpacing: '1.8px', textTransform: 'uppercase', color: '#2d4ebf' }}>{c.tag}</p>
          <h3 className="mb-3" style={{ fontFamily: 'Luxenta', fontWeight: 600, fontSize: 22, lineHeight: 1.1, color: '#152852' }}>{c.titulo}</h3>
          <p className="mb-5" style={{ fontFamily: 'Inter', fontSize: 14, lineHeight: '23px', color: '#797979' }}>{c.desc}</p>
          <p className="mt-auto pt-4 border-t" style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 13.5, color: '#152852', borderColor: '#ecedf0' }}>
            <span style={{ color: '#2d4ebf' }}>→</span> {c.resultado}
          </p>
        </div>
      </div>
    </Link>
  );
}

export default function CasosDeUso() {
  const ref = useReveal<HTMLElement>();
  return (
    <>
      <PageHero
        eyebrow="NA PRÁTICA · CENÁRIOS DE USO"
        title={<>O ecossistema explicado<br />do jeito mais honesto: <span style={{ color: '#d2e718' }}>em uso.</span></>}
        sub="Cenários que mostram como governos, educadores, empresas e universidades se conectam ao HUB PAN — e o que cada porta destrava."
        actions={<Link to="/contato"><HubButton size="lg" variant="lime">Encontrar minha porta</HubButton></Link>}
      />
      <section ref={ref} className="py-24 lg:py-32 gutter" style={{ background: '#f5f5f5' }}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CASOS.map((c) => <CasoCard key={c.titulo} c={c} />)}
        </div>
      </section>
      <CTABanner
        title={<>Seu cenário não está aqui? <span style={{ color: '#d2e718' }}>Melhor ainda.</span></>}
        sub="Os melhores casos do ecossistema começaram com uma conversa fora do roteiro."
        actions={<Link to="/contato"><HubButton size="lg" variant="lime">Contar meu contexto</HubButton></Link>}
      />
    </>
  );
}
