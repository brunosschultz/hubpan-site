import { Link } from 'react-router-dom';
import { ArrowUpRight, Newspaper, Image as ImageIcon, ShieldAlert } from 'lucide-react';
import PageHero from '../../components/PageHero';
import HubButton from '../../components/HubButton';
import { useReveal } from '../../components/useReveal';

/* ═══════════ Dados — extraídos do wireframe oficial (page-imprensa) ═══════════ */

const RELEASES = [
  {
    data: 'Jun 2026',
    titulo: 'HUB PAN lança portal global e firma parceria com MIPAD ONU',
    desc: 'O ecossistema Brasil Master, Premier Niveau e eGov Tecnologia se unifica sob a marca HUB PAN com lançamento de portal em São Paulo e assinatura de parceria estratégica com o MIPAD — Most Influential People of African Descent, organismo vinculado às Nações Unidas.',
    pdf: true,
  },
  {
    data: 'Jun 2026',
    titulo: 'HUB PAN anuncia Fórum Mundial de Inteligência Artificial para Cambridge em 2027',
    desc: 'O HUB PAN anuncia o WAIF — World Artificial Intelligence Forum — com primeira edição prevista para Harvard Square, Cambridge, Massachusetts, em 2027. O fórum será o primeiro evento brasileiro de IA ancorado no ecossistema de Harvard e MIT.',
    pdf: true,
  },
  {
    data: 'Mai 2026',
    titulo: '1ª Expo Boston consolida presença do Fórum Pan-Americano da Inovação nos EUA',
    desc: 'A primeira edição da Expo Boston foi realizada em maio de 2026, consolidando a presença do HUB PAN no ecossistema de inovação de Massachusetts e preparando o terreno para o Fórum Mundial de IA em 2027.',
    pdf: false,
  },
  {
    data: 'Jun 2026',
    titulo: 'HUB PAN lança GovIA e inicia mapeamento de uso de IA em municípios de Minas Gerais',
    desc: 'O Observatório de IA do HUB PAN inicia pesquisa inédita sobre o uso de inteligência artificial na administração pública em Minas Gerais — primeiro mapeamento sistemático do setor no Brasil, com metodologia própria e comparativo previsto com a região metropolitana de Boston.',
    pdf: false, preliminar: true,
  },
];

const NUMEROS = [
  { v: '15', l: 'Edições realizadas', sub: 'desde 2017' },
  { v: '4', l: 'Edições em', sub: 'Nova York' },
  { v: '+100', l: 'Projetos de inovação', sub: 'abrigados' },
];

const FOTOS = ['ONU · NY', 'Harvard', 'Expo BH', 'Boston'];

export default function Imprensa() {
  const ref = useReveal<HTMLElement>();
  return (
    <>
      <PageHero
        eyebrow="SALA DE IMPRENSA · PRESS KIT · RELEASES · DADOS"
        title="Imprensa & Mídia"
        sub="Material estruturado para jornalistas, editores e pesquisadores. Dados do Observatório de IA, releases institucionais, press kit e contato direto com a assessoria de comunicação do HUB PAN."
        actions={<>
          <HubButton size="lg" variant="lime">Baixar press kit completo</HubButton>
          <Link to="/contato"><HubButton size="lg" variant="blue">Contato de imprensa</HubButton></Link>
        </>}
      />

      <section ref={ref} className="py-24 lg:py-32 gutter bg-white">
        <div className="grid lg:grid-cols-[1.7fr_1fr] gap-14">
          {/* Coluna principal */}
          <div>
            {/* Releases */}
            <p className="eyebrow text-muted mb-6" data-animate>RELEASES E COMUNICADOS</p>
            <h2 className="mb-10" style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 'clamp(28px,3vw,38px)', letterSpacing: '-0.5px', lineHeight: 1.1, color: '#152852' }} data-animate>
              Últimas notícias do HUB PAN.
            </h2>
            <div className="mb-20">
              {RELEASES.map((r) => (
                <div key={r.titulo} className="py-7 border-b" style={{ borderColor: '#ecedf0' }} data-animate>
                  <p style={{ fontFamily: 'Inter', fontSize: 13, color: '#a7a4a4' }}>{r.data}</p>
                  <h3 className="my-2" style={{ fontFamily: 'Luxenta', fontWeight: 600, fontSize: 20, lineHeight: 1.2, color: '#152852' }}>{r.titulo}</h3>
                  <p className="mb-4" style={{ fontFamily: 'Inter', fontSize: 14.5, lineHeight: '24px', color: '#797979' }}>{r.desc}</p>
                  <div className="flex flex-wrap gap-5">
                    <Link to="/contato" className="inline-flex items-center gap-1" style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 13.5, color: '#2d4ebf' }}>
                      Ler release completo <ArrowUpRight size={14} />
                    </Link>
                    {r.pdf && <Link to="/contato" style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 13.5, color: '#a7a4a4' }}>Baixar PDF</Link>}
                    {r.preliminar && <Link to="/insights" style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 13.5, color: '#a7a4a4' }}>Dados preliminares</Link>}
                  </div>
                </div>
              ))}
            </div>

            {/* Dados para a imprensa */}
            <p className="eyebrow text-muted mb-6" data-animate>DADOS PARA A IMPRENSA</p>
            <h2 className="mb-8" style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 'clamp(28px,3vw,38px)', letterSpacing: '-0.5px', lineHeight: 1.1, color: '#152852' }} data-animate>
              Observatório de IA — dados em exclusividade.
            </h2>
            <div className="rounded-[20px] p-8 mb-20" style={{ background: '#f5f5f5' }} data-animate>
              <p className="mb-2" style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 11, letterSpacing: '1.8px', textTransform: 'uppercase', color: '#2d4ebf' }}>PESQUISA EM ANDAMENTO · MINAS GERAIS</p>
              <h3 className="mb-4" style={{ fontFamily: 'Luxenta', fontWeight: 600, fontSize: 22, lineHeight: 1.15, color: '#152852' }}>Mapeamento do uso de IA na administração pública brasileira</h3>
              <p className="mb-6" style={{ fontFamily: 'Inter', fontSize: 14.5, lineHeight: '24px', color: '#797979' }}>
                O HUB PAN disponibiliza dados preliminares do Observatório de IA para jornalistas e pesquisadores. O mapeamento cobre uso de ferramentas de IA, nível de letramento digital dos servidores e barreiras de implementação em municípios de Minas Gerais.
              </p>
              <div className="flex gap-3 mb-6">
                <span className="rounded-full px-4 py-2" style={{ background: '#fff', fontFamily: 'Inter', fontSize: 12.5, color: '#152852' }}><b style={{ color: '#2d4ebf' }}>MG</b> · Em campo — Jun 2026</span>
                <span className="rounded-full px-4 py-2" style={{ background: '#fff', fontFamily: 'Inter', fontSize: 12.5, color: '#152852' }}><b style={{ color: '#2d4ebf' }}>2027</b> · Boston — comparativo</span>
              </div>
              <p className="mb-6" style={{ fontFamily: 'Inter', fontSize: 13, color: '#a7a4a4' }}>
                Dados completos disponíveis mediante credenciamento de imprensa. Embargo pode ser aplicado a critério da assessoria.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/insights"><HubButton size="sm" variant="blue">Solicitar acesso aos dados</HubButton></Link>
                <Link to="/contato"><HubButton size="sm" variant="outline-dark">Credenciar-se como imprensa</HubButton></Link>
              </div>
            </div>

            {/* Números do ecossistema */}
            <p className="eyebrow text-muted mb-6" data-animate>NÚMEROS DO ECOSSISTEMA</p>
            <h2 className="mb-8" style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 'clamp(28px,3vw,38px)', letterSpacing: '-0.5px', lineHeight: 1.1, color: '#152852' }} data-animate>
              Dados institucionais validados.
            </h2>
            <div className="grid grid-cols-3 gap-4 mb-6" data-animate>
              {NUMEROS.map((n) => (
                <div key={n.l} className="rounded-[20px] p-6 text-center" style={{ background: '#f5f5f5' }}>
                  <p style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 42, lineHeight: 1, color: '#152852' }}>{n.v}</p>
                  <p className="mt-2" style={{ fontFamily: 'Inter', fontSize: 12.5, lineHeight: '18px', color: '#797979' }}>{n.l}<br />{n.sub}</p>
                </div>
              ))}
            </div>
            <p style={{ fontFamily: 'Inter', fontSize: 13, color: '#a7a4a4' }}>
              Todos os dados institucionais são validados internamente antes da publicação. Dados adicionais disponíveis mediante solicitação credenciada.
            </p>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="rounded-[20px] p-7" style={{ background: '#152852' }} data-animate>
              <span className="flex items-center justify-center rounded-full mb-4" style={{ width: 44, height: 44, background: 'rgba(255,255,255,0.08)' }}>
                <Newspaper size={20} strokeWidth={2} color="#d2e718" />
              </span>
              <h3 className="mb-2" style={{ fontFamily: 'Luxenta', fontWeight: 600, fontSize: 18, color: '#fff' }}>Contato de Imprensa</h3>
              <p className="mb-5" style={{ fontFamily: 'Inter', fontSize: 13.5, lineHeight: '22px', color: 'rgba(255,255,255,0.75)' }}>
                Para entrevistas, dados exclusivos, cobertura de eventos ou informações adicionais.
              </p>
              <Link to="/contato"><HubButton size="sm" variant="lime">Falar com assessoria</HubButton></Link>
            </div>

            <div className="rounded-[20px] p-7" style={{ background: '#f5f5f5' }} data-animate>
              <h3 className="mb-2" style={{ fontFamily: 'Luxenta', fontWeight: 600, fontSize: 18, color: '#152852' }}>Press Kit</h3>
              <p className="mb-5" style={{ fontFamily: 'Inter', fontSize: 13.5, lineHeight: '22px', color: '#797979' }}>
                Logos, fotos institucionais, descrição da organização, biographies das lideranças e dados do ecossistema.
              </p>
              <p className="mb-3" style={{ fontFamily: 'Inter', fontSize: 13, color: '#2d4ebf' }}>Logos HUB PAN · vetor</p>
              <HubButton size="sm" variant="navy">Baixar press kit completo</HubButton>
            </div>

            <div className="rounded-[20px] p-7" style={{ background: '#f5f5f5' }} data-animate>
              <div className="flex items-center gap-2 mb-4">
                <ImageIcon size={18} strokeWidth={2} color="#152852" />
                <h3 style={{ fontFamily: 'Luxenta', fontWeight: 600, fontSize: 18, color: '#152852' }}>Fotos institucionais</h3>
              </div>
              <div className="flex flex-wrap gap-2 mb-5">
                {FOTOS.map((f) => (
                  <span key={f} className="rounded-full px-3 py-1.5" style={{ background: '#fff', fontFamily: 'Inter', fontSize: 12, color: '#152852' }}>{f}</span>
                ))}
              </div>
              <HubButton size="sm" variant="navy">Baixar álbum completo</HubButton>
            </div>

            <div className="rounded-[20px] p-7" style={{ border: '1px dashed #dcdcdc' }} data-animate>
              <div className="flex items-center gap-2 mb-3">
                <ShieldAlert size={18} strokeWidth={2} color="#a7a4a4" />
                <h3 style={{ fontFamily: 'Luxenta', fontWeight: 600, fontSize: 16, color: '#152852' }}>Embargo e política editorial</h3>
              </div>
              <p style={{ fontFamily: 'Inter', fontSize: 13, lineHeight: '21px', color: '#797979' }}>
                Dados do Observatório de IA podem ser disponibilizados com embargo. Solicitações de dados exclusivos ou entrevistas devem ser feitas com 72h de antecedência.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
