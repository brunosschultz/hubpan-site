import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { EditorProvider } from './editor/store'
import EditorPage from './editor/EditorPage'
import PreviewPage from './editor/PreviewPage'
import AdminApp from './admin/AdminApp'
import SmoothScroll from './components/SmoothScroll'
import ScrollToTop from './components/ScrollToTop'
import NavBar from './components/NavBar'
import PageMeta, { NoIndexMeta } from './components/PageMeta'
import S11Newsletter from './sections/S11Newsletter'
import Footer from './components/Footer'
import Home from './pages/Home'
import Institucional from './pages/institucional'
import Prointer from './pages/prointer'
import GovIA from './pages/govia'
import ForumMundialIA from './pages/forum'
import Insights from './pages/insights'
import Contato from './pages/contato'
import Glossario from './pages/utilitarias/Glossario'
import Imprensa from './pages/utilitarias/Imprensa'
import CasosDeUso from './pages/utilitarias/CasosDeUso'

/* Título/descrição por página — lidos também pela pré-renderização de build
 * (scripts/prerender.mjs) e pelo sitemap.xml gerado junto. Ao criar uma
 * página nova, adicionar a rota aqui E na lista ROUTES do script. */
export default function App() {
  return (
    <BrowserRouter>
      <EditorProvider>
        <AppShell />
      </EditorProvider>
    </BrowserRouter>
  )
}

/**
 * O Painel Admin (/admin) tem sua própria casca visual (sidebar, sem
 * NavBar/Newsletter/Footer do site público, sem GSAP ScrollSmoother) — o
 * resto do site (incluindo /editar e /preview, que mostram páginas reais)
 * usa o chrome normal. Precisa estar dentro do <BrowserRouter> pra usar
 * useLocation().
 */
function AppShell() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  const routes = (
    <Routes>
      <Route path="/" element={<>
        <PageMeta
          slug=""
          path="/"
          title="HUB PAN — Ecossistema de Inovação nas Américas e África"
          description="O HUB PAN une governos, empresas e educadores das Américas e África num ecossistema de inovação, IA, impacto social e cooperação internacional."
        />
        <Home />
      </>} />
      <Route path="/editar/*" element={<><NoIndexMeta /><EditorPage /></>} />
      <Route path="/preview/*" element={<><NoIndexMeta /><PreviewPage /></>} />
      <Route path="/admin/*" element={<><NoIndexMeta /><AdminApp /></>} />
      <Route path="/o-hub-pan" element={<>
              <PageMeta
                slug="o-hub-pan"
                path="/o-hub-pan"
                title="O HUB PAN — Ecossistema de Inovação desde 2017"
                description="Conheça a história e as marcas fundadoras do HUB PAN — de Belo Horizonte a Harvard Square, com mais de 100 projetos de inovação abrigados."
              />
              <Institucional />
            </>} />
            <Route path="/prointer" element={<>
              <PageMeta
                slug="prointer"
                path="/prointer"
                title="PROINTER — Intercâmbio de Impacto em Harvard e Nova York"
                description="Programa que leva professores da rede pública e afroempreendedores para Harvard Square, MIT e as Nações Unidas — passagem, hospedagem e curadoria completas."
              />
              <Prointer />
            </>} />
            <Route path="/govia" element={<>
              <PageMeta
                slug="govia"
                path="/govia"
                title="GovIA — Plataforma de IA para o Setor Público"
                description="Assinatura institucional de IA para municípios, estados e consórcios públicos — sem cartão de crédito. Ferramentas, formação e Observatório de IA."
              />
              <GovIA />
            </>} />
            <Route path="/forum-mundial-ia" element={<>
              <PageMeta
                slug="forum-mundial-ia"
                path="/forum-mundial-ia"
                title="Fórum Mundial de IA (WAIF) — Cambridge 2027"
                description="O maior ativo estratégico do HUB PAN reúne players globais de IA, policy makers, pesquisadores e investidores em Cambridge, Massachusetts, em 2027."
              />
              <ForumMundialIA />
            </>} />
            <Route path="/insights" element={<>
              <PageMeta
                slug="insights"
                path="/insights"
                title="HUB PAN Insights — Observatório de IA e Inovação"
                description="Observatórios temáticos, pesquisas, artigos e relatórios sobre inovação, inteligência artificial, governança, educação e cooperação internacional."
              />
              <Insights />
            </>} />
            <Route path="/contato" element={<>
              <PageMeta
                slug="contato"
                path="/contato"
                title="Contato — Fale com o Ecossistema HUB PAN"
                description="Seja qual for seu perfil — governo, empresa, educador ou parceiro — encontre o caminho certo pra entrar no ecossistema HUB PAN."
              />
              <Contato />
            </>} />
            <Route path="/glossario" element={<>
              <PageMeta
                slug="glossario"
                path="/glossario"
                title="Glossário HUB PAN — Conceitos de Inovação, IA e Impacto"
                description="Definições claras dos conceitos centrais do ecossistema HUB PAN — para qualquer pessoa entender o que fazemos e por quê."
              />
              <Glossario />
            </>} />
            <Route path="/imprensa" element={<>
              <PageMeta
                slug="imprensa"
                path="/imprensa"
                title="Imprensa & Mídia — Press Kit Oficial do HUB PAN"
                description="Material estruturado para jornalistas e pesquisadores: dados do Observatório de IA, releases institucionais, press kit e contato com a assessoria."
              />
              <Imprensa />
            </>} />
            <Route path="/casos-de-uso" element={<>
              <PageMeta
                slug="casos-de-uso"
                path="/casos-de-uso"
                title="Casos de Uso — Resultados Reais do Ecossistema HUB PAN"
                description="Dados, histórias e resultados documentados de quem já viveu o que o HUB PAN propõe — de professoras da rede pública a prefeituras e startups."
              />
              <CasosDeUso />
            </>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );

  if (isAdmin) {
    // Sem <main> aqui: AdminLayout já é o próprio landmark <main> da página
    // (ter dois <main> aninhados é HTML inválido e complica o cálculo de
    // scroll do navegador).
    return <div className="w-full overflow-x-hidden">{routes}</div>;
  }

  return (
    <SmoothScroll>
      <ScrollToTop />
      <NavBar />
      <main className="w-full overflow-x-hidden">
        {routes}
        <S11Newsletter />
        <Footer />
      </main>
    </SmoothScroll>
  );
}
