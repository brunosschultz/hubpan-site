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
          title="HUB PAN — Ecossistema Global de Inovação nas Américas"
          description="O HUB PAN é o ecossistema global de inovação que une governos, empresas e educadores das Américas e África em IA, impacto social e cooperação."
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
                title="O Que É o HUB PAN? Ecossistema de Inovação"
                description="O que é o HUB PAN? Conheça a história e as marcas fundadoras do ecossistema — de Belo Horizonte a Harvard Square, com mais de 100 projetos abrigados."
              />
              <Institucional />
            </>} />
            <Route path="/prointer" element={<>
              <PageMeta
                slug="prointer"
                path="/prointer"
                title="PROINTER — Intercâmbio para Professores da Rede Pública"
                description="Programa que leva professores da rede pública e afroempreendedores para Harvard Square, MIT e as Nações Unidas — passagem, hospedagem e curadoria completas."
              />
              <Prointer />
            </>} />
            <Route path="/govia" element={<>
              <PageMeta
                slug="govia"
                path="/govia"
                title="GovIA — Plataforma de IA sem Cartão de Crédito"
                description="Assinatura institucional de IA para municípios, estados e consórcios públicos — sem cartão de crédito. Ferramentas, formação e Observatório de IA."
              />
              <GovIA />
            </>} />
            <Route path="/forum-mundial-ia" element={<>
              <PageMeta
                slug="forum-mundial-ia"
                path="/forum-mundial-ia"
                title="Fórum Mundial de Inteligência Artificial — Cambridge 2027"
                description="O Fórum Mundial de Inteligência Artificial reúne players globais de IA, policy makers, pesquisadores e investidores em Cambridge, Massachusetts, em 2027."
              />
              <ForumMundialIA />
            </>} />
            <Route path="/insights" element={<>
              <PageMeta
                slug="insights"
                path="/insights"
                title="HUB PAN Insights — Observatório de IA e Inovação"
                description="Observatório de IA e conteúdo do HUB PAN: pesquisas, artigos e relatórios sobre inovação, inteligência artificial, governança e cooperação internacional."
              />
              <Insights />
            </>} />
            <Route path="/contato" element={<>
              <PageMeta
                slug="contato"
                path="/contato"
                title="Contato — Fale com o HUB PAN e o Ecossistema"
                description="Fale com o HUB PAN: seja qual for seu perfil — governo, empresa, educador ou parceiro — encontre o caminho certo pra entrar no ecossistema."
              />
              <Contato />
            </>} />
            <Route path="/glossario" element={<>
              <PageMeta
                slug="glossario"
                path="/glossario"
                title="Glossário HUB PAN — Conceitos de Inovação, IA e Impacto"
                description="Glossário HUB PAN: definições claras dos conceitos centrais do ecossistema — pra qualquer pessoa entender o que fazemos e por quê."
              />
              <Glossario />
            </>} />
            <Route path="/imprensa" element={<>
              <PageMeta
                slug="imprensa"
                path="/imprensa"
                title="Imprensa & Mídia — Press Kit Oficial do HUB PAN"
                description="Press kit oficial do HUB PAN pra jornalistas e pesquisadores: dados do Observatório de IA, releases institucionais e contato com a assessoria."
              />
              <Imprensa />
            </>} />
            <Route path="/casos-de-uso" element={<>
              <PageMeta
                slug="casos-de-uso"
                path="/casos-de-uso"
                title="Casos de Uso — Resultados Reais do Ecossistema HUB PAN"
                description="Resultados reais de quem já viveu o que o HUB PAN propõe — dados e histórias documentadas, de professoras da rede pública a prefeituras e startups."
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
