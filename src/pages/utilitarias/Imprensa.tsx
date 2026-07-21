import { Link } from 'react-router-dom';
import { ArrowUpRight, Newspaper, Image as ImageIcon, ShieldAlert } from 'lucide-react';
import PageHero from '../../components/PageHero';
import HubButton, { WHATSAPP_URL } from '../../components/HubButton';
import { useReveal } from '../../components/useReveal';
import { EIcon, ERich, ET, useEditColor } from '../../editor/fields';

/* ═══════════ Dados — extraídos do wireframe oficial (page-imprensa) ═══════════ */

const RELEASES = [
  {
    id: 'lancamento-portal',
    data: 'Jun 2026',
    titulo: 'HUB PAN lança portal global e firma parceria com MIPAD ONU',
    desc: 'O ecossistema Brasil Master, Premier Niveau e eGov Tecnologia se unifica sob a marca HUB PAN com lançamento de portal em São Paulo e assinatura de parceria estratégica com o MIPAD — Most Influential People of African Descent, organismo vinculado às Nações Unidas.',
    pdf: true,
  },
  {
    id: 'waif-cambridge',
    data: 'Jun 2026',
    titulo: 'HUB PAN anuncia Fórum Mundial de Inteligência Artificial para Cambridge em 2027',
    desc: 'O HUB PAN anuncia o WAIF — World Artificial Intelligence Forum — com primeira edição prevista para Harvard Square, Cambridge, Massachusetts, em 2027. O fórum será o primeiro evento brasileiro de IA ancorado no ecossistema de Harvard e MIT.',
    pdf: true,
  },
  {
    id: 'expo-boston',
    data: 'Mai 2026',
    titulo: '1ª Expo Boston consolida presença do Fórum Pan-Americano da Inovação nos EUA',
    desc: 'A primeira edição da Expo Boston foi realizada em maio de 2026, consolidando a presença do HUB PAN no ecossistema de inovação de Massachusetts e preparando o terreno para o Fórum Mundial de IA em 2027.',
    pdf: false,
  },
  {
    id: 'govia-mg',
    data: 'Jun 2026',
    titulo: 'HUB PAN lança GovIA e inicia mapeamento de uso de IA em municípios de Minas Gerais',
    desc: 'O Observatório de IA do HUB PAN inicia pesquisa inédita sobre o uso de inteligência artificial na administração pública em Minas Gerais — primeiro mapeamento sistemático do setor no Brasil, com metodologia própria e comparativo previsto com a região metropolitana de Boston.',
    pdf: false, preliminar: true,
  },
];

const NUMEROS = [
  { id: 'edicoes', v: '15', l: 'Edições realizadas', sub: 'desde 2017' },
  { id: 'ny', v: '4', l: 'Edições em', sub: 'Nova York' },
  { id: 'projetos', v: '+100', l: 'Projetos de inovação', sub: 'abrigados' },
];

const FOTOS = [
  { id: 'onu-ny', label: 'ONU · NY' },
  { id: 'harvard', label: 'Harvard' },
  { id: 'expo-bh', label: 'Expo BH' },
  { id: 'boston', label: 'Boston' },
];

export default function Imprensa() {
  const ref = useReveal<HTMLElement>();
  const [bg, bgProps] = useEditColor('imprensa.bg', '#ffffff', 'Fundo da seção Imprensa');
  const [cardBg, cardBgProps] = useEditColor('imprensa.cardBg', '#f5f5f5', 'Fundo dos cards cinza', 'Cards cinza da Imprensa');
  const [contatoBg, contatoBgProps] = useEditColor('imprensa.sidebar.contato.bg', '#152852', 'Fundo do card "Contato de Imprensa"');

  return (
    <>
      <PageHero
        id="imprensa-hero"
        bgKey="imprensa.hero"
        eyebrow={<ET k="imprensa.hero.eyebrow" v="SALA DE IMPRENSA · PRESS KIT · RELEASES · DADOS" l="Imprensa — rótulo do hero" />}
        title={<ERich k="imprensa.hero.titulo" l="Imprensa — título do hero">Imprensa & Mídia</ERich>}
        sub={<ERich k="imprensa.hero.sub" l="Imprensa — subtítulo do hero">Material estruturado para jornalistas, editores e pesquisadores. Dados do Observatório de IA, releases institucionais, press kit e contato direto com a assessoria de comunicação do HUB PAN.</ERich>}
        actions={<>
          <HubButton size="lg" variant="lime" iconKey="imprensa.hero.btn.presskit.icone" iconLabel="Imprensa — botão baixar press kit (hero), ícone" styleKey="imprensa.hero.btn.presskit" styleLabel="Imprensa — botão baixar press kit (hero)" as="a" href={WHATSAPP_URL}><ET k="imprensa.hero.btn.presskit" v="Baixar press kit completo" l="Imprensa — botão baixar press kit (hero)" /></HubButton>
          <HubButton size="lg" variant="blue" iconKey="imprensa.hero.btn.contato.icone" iconLabel="Imprensa — botão contato (hero), ícone" to="/contato" styleKey="imprensa.hero.btn.contato" styleLabel="Imprensa — botão contato (hero)"><ET k="imprensa.hero.btn.contato" v="Contato de imprensa" l="Imprensa — botão contato (hero)" /></HubButton>
        </>}
      />

      <section ref={ref} id="imprensa-corpo" className="py-24 lg:py-32 gutter" {...bgProps} style={{ background: bg }}>
        <div className="grid lg:grid-cols-[1.7fr_1fr] gap-14">
          {/* Coluna principal */}
          <div>
            {/* Releases */}
            <p className="eyebrow text-muted mb-6" data-animate><ET k="imprensa.releases.eyebrow" v="RELEASES E COMUNICADOS" l="Imprensa — selo da seção Releases" /></p>
            <h2 className="mb-10" style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 'clamp(28px,3vw,38px)', letterSpacing: '-0.5px', lineHeight: 1.1, color: '#152852' }} data-animate>
              <ERich k="imprensa.releases.titulo" l="Imprensa — título da seção Releases">Últimas notícias do HUB PAN.</ERich>
            </h2>
            <div className="mb-20">
              {RELEASES.map((r) => (
                <div key={r.id} className="py-7 border-b" style={{ borderColor: '#ecedf0' }} data-animate>
                  <p style={{ fontFamily: 'Inter', fontSize: 13, color: '#a7a4a4' }}>
                    <ET k={`imprensa.release.${r.id}.data`} v={r.data} l={`Imprensa — data do release "${r.titulo.slice(0, 30)}…"`} />
                  </p>
                  <h3 className="my-2" style={{ fontFamily: 'Luxenta', fontWeight: 600, fontSize: 20, lineHeight: 1.2, color: '#152852' }}>
                    <ERich k={`imprensa.release.${r.id}.titulo`} l={`Imprensa — título do release "${r.titulo.slice(0, 30)}…"`}>{r.titulo}</ERich>
                  </h3>
                  <p className="mb-4" style={{ fontFamily: 'Inter', fontSize: 14.5, lineHeight: '24px', color: '#797979' }}>
                    <ERich k={`imprensa.release.${r.id}.desc`} l={`Imprensa — descrição do release "${r.titulo.slice(0, 30)}…"`}>{r.desc}</ERich>
                  </p>
                  <div className="flex flex-wrap gap-5">
                    <Link to="/contato" className="inline-flex items-center gap-1" style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 13.5, color: '#2d4ebf' }}>
                      <ET k={`imprensa.release.${r.id}.link`} v="Ler release completo" l={`Imprensa — link "ler completo" do release "${r.titulo.slice(0, 30)}…"`} /> <ArrowUpRight size={14} />
                    </Link>
                    {r.pdf && <Link to="/contato" style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 13.5, color: '#a7a4a4' }}><ET k={`imprensa.release.${r.id}.pdf`} v="Baixar PDF" l={`Imprensa — link "baixar PDF" do release "${r.titulo.slice(0, 30)}…"`} /></Link>}
                    {r.preliminar && <Link to="/insights" style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 13.5, color: '#a7a4a4' }}><ET k={`imprensa.release.${r.id}.preliminar`} v="Dados preliminares" l={`Imprensa — link "dados preliminares" do release "${r.titulo.slice(0, 30)}…"`} /></Link>}
                  </div>
                </div>
              ))}
            </div>

            {/* Dados para a imprensa */}
            <p className="eyebrow text-muted mb-6" data-animate><ET k="imprensa.dados.eyebrow" v="DADOS PARA A IMPRENSA" l="Imprensa — selo da seção Dados" /></p>
            <h2 className="mb-8" style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 'clamp(28px,3vw,38px)', letterSpacing: '-0.5px', lineHeight: 1.1, color: '#152852' }} data-animate>
              <ERich k="imprensa.dados.titulo" l="Imprensa — título da seção Dados">Observatório de IA — dados em exclusividade.</ERich>
            </h2>
            <div className="rounded-[20px] p-8 mb-20" {...cardBgProps} style={{ background: cardBg }} data-animate>
              <p className="mb-2" style={{ fontFamily: 'Inter', fontWeight: 500, fontSize: 11, letterSpacing: '1.8px', textTransform: 'uppercase', color: '#2d4ebf' }}>
                <ET k="imprensa.dados.badge" v="PESQUISA EM ANDAMENTO · MINAS GERAIS" l="Imprensa — selo do card Observatório de IA" />
              </p>
              <h3 className="mb-4" style={{ fontFamily: 'Luxenta', fontWeight: 600, fontSize: 22, lineHeight: 1.15, color: '#152852' }}>
                <ERich k="imprensa.dados.subtitulo" l="Imprensa — título do card Observatório de IA">Mapeamento do uso de IA na administração pública brasileira</ERich>
              </h3>
              <p className="mb-6" style={{ fontFamily: 'Inter', fontSize: 14.5, lineHeight: '24px', color: '#797979' }}>
                <ERich k="imprensa.dados.desc" l="Imprensa — descrição do card Observatório de IA">
                  O HUB PAN disponibiliza dados preliminares do Observatório de IA para jornalistas e pesquisadores. O mapeamento cobre uso de ferramentas de IA, nível de letramento digital dos servidores e barreiras de implementação em municípios de Minas Gerais.
                </ERich>
              </p>
              <div className="flex gap-3 mb-6">
                <span className="rounded-full px-4 py-2" style={{ background: '#fff', fontFamily: 'Inter', fontSize: 12.5, color: '#152852' }}>
                  <ERich k="imprensa.dados.pill.mg" l="Imprensa — selo 'MG · Em campo'"><b style={{ color: '#2d4ebf' }}>MG</b> · Em campo — Jun 2026</ERich>
                </span>
                <span className="rounded-full px-4 py-2" style={{ background: '#fff', fontFamily: 'Inter', fontSize: 12.5, color: '#152852' }}>
                  <ERich k="imprensa.dados.pill.boston" l="Imprensa — selo '2027 · Boston'"><b style={{ color: '#2d4ebf' }}>2027</b> · Boston — comparativo</ERich>
                </span>
              </div>
              <p className="mb-6" style={{ fontFamily: 'Inter', fontSize: 13, color: '#a7a4a4' }}>
                <ERich k="imprensa.dados.embargo" l="Imprensa — nota de embargo do card Observatório de IA">
                  Dados completos disponíveis mediante credenciamento de imprensa. Embargo pode ser aplicado a critério da assessoria.
                </ERich>
              </p>
              <div className="flex flex-wrap gap-4">
                <HubButton size="sm" variant="blue" iconKey="imprensa.dados.btn.acesso.icone" iconLabel="Imprensa — botão solicitar acesso aos dados, ícone" to="/insights" styleKey="imprensa.dados.btn.acesso" styleLabel="Imprensa — botão solicitar acesso aos dados"><ET k="imprensa.dados.btn.acesso" v="Solicitar acesso aos dados" l="Imprensa — botão solicitar acesso aos dados" /></HubButton>
                <HubButton size="sm" variant="outline-dark" iconKey="imprensa.dados.btn.credenciar.icone" iconLabel="Imprensa — botão credenciar-se como imprensa, ícone" to="/contato" styleKey="imprensa.dados.btn.credenciar" styleLabel="Imprensa — botão credenciar-se como imprensa"><ET k="imprensa.dados.btn.credenciar" v="Credenciar-se como imprensa" l="Imprensa — botão credenciar-se como imprensa" /></HubButton>
              </div>
            </div>

            {/* Números do ecossistema */}
            <p className="eyebrow text-muted mb-6" data-animate><ET k="imprensa.numeros.eyebrow" v="NÚMEROS DO ECOSSISTEMA" l="Imprensa — selo da seção Números" /></p>
            <h2 className="mb-8" style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 'clamp(28px,3vw,38px)', letterSpacing: '-0.5px', lineHeight: 1.1, color: '#152852' }} data-animate>
              <ERich k="imprensa.numeros.titulo" l="Imprensa — título da seção Números">Dados institucionais validados.</ERich>
            </h2>
            <div className="grid grid-cols-3 gap-4 mb-6" data-animate>
              {NUMEROS.map((n) => (
                <div key={n.id} className="rounded-[20px] p-6 text-center" {...cardBgProps} style={{ background: cardBg }}>
                  <p style={{ fontFamily: 'Luxenta', fontWeight: 400, fontSize: 42, lineHeight: 1, color: '#152852' }}>
                    <ET k={`imprensa.numero.${n.id}.valor`} v={n.v} l={`Imprensa — valor do número "${n.l}"`} />
                  </p>
                  <p className="mt-2" style={{ fontFamily: 'Inter', fontSize: 12.5, lineHeight: '18px', color: '#797979' }}>
                    <ERich k={`imprensa.numero.${n.id}.rotulo`} l={`Imprensa — rótulo do número "${n.l}"`}>{n.l}<br />{n.sub}</ERich>
                  </p>
                </div>
              ))}
            </div>
            <p style={{ fontFamily: 'Inter', fontSize: 13, color: '#a7a4a4' }}>
              <ERich k="imprensa.numeros.nota" l="Imprensa — nota final da seção Números">
                Todos os dados institucionais são validados internamente antes da publicação. Dados adicionais disponíveis mediante solicitação credenciada.
              </ERich>
            </p>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="rounded-[20px] p-7" {...contatoBgProps} style={{ background: contatoBg }} data-animate>
              <span className="flex items-center justify-center rounded-full mb-4" style={{ width: 44, height: 44, background: 'rgba(255,255,255,0.08)' }}>
                <EIcon k="imprensa.sidebar.contato.icon" l="Imprensa — ícone do card Contato de Imprensa" defaultSize={20}>
                  <Newspaper size={20} strokeWidth={2} color="#d2e718" />
                </EIcon>
              </span>
              <h3 className="mb-2" style={{ fontFamily: 'Luxenta', fontWeight: 600, fontSize: 18, color: '#fff' }}><ET k="imprensa.sidebar.contato.titulo" v="Contato de Imprensa" l="Imprensa — título do card Contato de Imprensa" /></h3>
              <p className="mb-5" style={{ fontFamily: 'Inter', fontSize: 13.5, lineHeight: '22px', color: 'rgba(255,255,255,0.75)' }}>
                <ERich k="imprensa.sidebar.contato.desc" l="Imprensa — descrição do card Contato de Imprensa">Para entrevistas, dados exclusivos, cobertura de eventos ou informações adicionais.</ERich>
              </p>
              <HubButton size="sm" variant="lime" iconKey="imprensa.sidebar.contato.btn.icone" iconLabel="Imprensa — botão do card Contato de Imprensa, ícone" to="/contato" styleKey="imprensa.sidebar.contato.btn" styleLabel="Imprensa — botão do card Contato de Imprensa"><ET k="imprensa.sidebar.contato.btn" v="Falar com assessoria" l="Imprensa — botão do card Contato de Imprensa" /></HubButton>
            </div>

            <div className="rounded-[20px] p-7" {...cardBgProps} style={{ background: cardBg }} data-animate>
              <h3 className="mb-2" style={{ fontFamily: 'Luxenta', fontWeight: 600, fontSize: 18, color: '#152852' }}><ET k="imprensa.sidebar.presskit.titulo" v="Press Kit" l="Imprensa — título do card Press Kit" /></h3>
              <p className="mb-5" style={{ fontFamily: 'Inter', fontSize: 13.5, lineHeight: '22px', color: '#797979' }}>
                <ERich k="imprensa.sidebar.presskit.desc" l="Imprensa — descrição do card Press Kit">Logos, fotos institucionais, descrição da organização, biographies das lideranças e dados do ecossistema.</ERich>
              </p>
              <p className="mb-3" style={{ fontFamily: 'Inter', fontSize: 13, color: '#2d4ebf' }}><ET k="imprensa.sidebar.presskit.nota" v="Logos HUB PAN · vetor" l="Imprensa — nota do card Press Kit" /></p>
              <HubButton size="sm" variant="navy" iconKey="imprensa.sidebar.presskit.btn.icone" iconLabel="Imprensa — botão do card Press Kit, ícone" styleKey="imprensa.sidebar.presskit.btn" styleLabel="Imprensa — botão do card Press Kit" as="a" href={WHATSAPP_URL}><ET k="imprensa.sidebar.presskit.btn" v="Baixar press kit completo" l="Imprensa — botão do card Press Kit" /></HubButton>
            </div>

            <div className="rounded-[20px] p-7" {...cardBgProps} style={{ background: cardBg }} data-animate>
              <div className="flex items-center gap-2 mb-4">
                <EIcon k="imprensa.sidebar.fotos.icon" l="Imprensa — ícone do card Fotos institucionais" defaultSize={18}>
                  <ImageIcon size={18} strokeWidth={2} color="#152852" />
                </EIcon>
                <h3 style={{ fontFamily: 'Luxenta', fontWeight: 600, fontSize: 18, color: '#152852' }}><ET k="imprensa.sidebar.fotos.titulo" v="Fotos institucionais" l="Imprensa — título do card Fotos institucionais" /></h3>
              </div>
              <div className="flex flex-wrap gap-2 mb-5">
                {FOTOS.map((f) => (
                  <span key={f.id} className="rounded-full px-3 py-1.5" style={{ background: '#fff', fontFamily: 'Inter', fontSize: 12, color: '#152852' }}>
                    <ET k={`imprensa.foto.${f.id}`} v={f.label} l={`Imprensa — legenda da foto "${f.label}"`} />
                  </span>
                ))}
              </div>
              <HubButton size="sm" variant="navy" iconKey="imprensa.sidebar.fotos.btn.icone" iconLabel="Imprensa — botão do card Fotos institucionais, ícone" styleKey="imprensa.sidebar.fotos.btn" styleLabel="Imprensa — botão do card Fotos institucionais" as="a" href={WHATSAPP_URL}><ET k="imprensa.sidebar.fotos.btn" v="Baixar álbum completo" l="Imprensa — botão do card Fotos institucionais" /></HubButton>
            </div>

            <div className="rounded-[20px] p-7" style={{ border: '1px dashed #dcdcdc' }} data-animate>
              <div className="flex items-center gap-2 mb-3">
                <EIcon k="imprensa.sidebar.embargo.icon" l="Imprensa — ícone do card Embargo" defaultSize={18}>
                  <ShieldAlert size={18} strokeWidth={2} color="#a7a4a4" />
                </EIcon>
                <h3 style={{ fontFamily: 'Luxenta', fontWeight: 600, fontSize: 16, color: '#152852' }}><ET k="imprensa.sidebar.embargo.titulo" v="Embargo e política editorial" l="Imprensa — título do card Embargo" /></h3>
              </div>
              <p style={{ fontFamily: 'Inter', fontSize: 13, lineHeight: '21px', color: '#797979' }}>
                <ERich k="imprensa.sidebar.embargo.desc" l="Imprensa — descrição do card Embargo">Dados do Observatório de IA podem ser disponibilizados com embargo. Solicitações de dados exclusivos ou entrevistas devem ser feitas com 72h de antecedência.</ERich>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
