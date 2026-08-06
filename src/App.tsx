import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { EditorProvider } from './editor/store'
import SmoothScroll from './components/SmoothScroll'
import ScrollToTop from './components/ScrollToTop'
import NavBar from './components/NavBar'
import PageMeta, { NoIndexMeta } from './components/PageMeta'
import S11Newsletter from './sections/S11Newsletter'
import Footer from './components/Footer'
import Home from './pages/Home'

/* Carregados sob demanda (não entram no bundle público) — editor visual e
 * painel admin são código que só quem loga usa, nunca um visitante comum.
 * Separar isso do bundle da Home reduz bastante o JavaScript que todo
 * visitante baixa (achado real da auditoria de velocidade do painel). */
const EditorPage = lazy(() => import('./editor/EditorPage'))
const PreviewPage = lazy(() => import('./editor/PreviewPage'))
const AdminApp = lazy(() => import('./admin/AdminApp'))

/* As outras 9 páginas também viram pacote próprio, cada uma — mesmo
 * achado real confirmado no detalhamento da auditoria (`unused-javascript`
 * ainda mostrando ~600ms de economia possível mesmo depois de tirar
 * admin/editor do pacote): visitar a Home baixava o código de PROINTER,
 * GovIA e todas as outras páginas à toa. Home continua fora do lazy() —
 * é a entrada mais comum do site, não faz sentido atrasar ela com um
 * Suspense por um chunk que ela mesma precisa imediatamente. */
const Institucional = lazy(() => import('./pages/institucional'))
const Prointer = lazy(() => import('./pages/prointer'))
const GovIA = lazy(() => import('./pages/govia'))
const Expos = lazy(() => import('./pages/expos'))
const ForumMundialIA = lazy(() => import('./pages/forum'))
const Insights = lazy(() => import('./pages/insights'))
const Contato = lazy(() => import('./pages/contato'))
const Glossario = lazy(() => import('./pages/utilitarias/Glossario'))
const Imprensa = lazy(() => import('./pages/utilitarias/Imprensa'))
const CasosDeUso = lazy(() => import('./pages/utilitarias/CasosDeUso'))

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
    <Suspense fallback={null}>
    <Routes>
      <Route path="/" element={<>
        <PageMeta
          slug=""
          path="/"
          title="HUB PAN — Infraestrutura Global que Conecta Ecossistemas"
          description="O HUB PAN é a infraestrutura global de convergência que conecta ecossistemas, governos, empresas e universidades das Américas e da África em inovação e IA."
          image="/images/og-home.webp"
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
                title="O Que É o HUB PAN? Infraestrutura de Convergência"
                description="O que é o HUB PAN? Conheça a história e as marcas fundadoras — de Belo Horizonte a Harvard Square, com mais de 100 projetos abrigados desde 2017."
              />
              <Institucional />
            </>} />
            <Route path="/prointer" element={<>
              <PageMeta
                slug="prointer"
                path="/prointer"
                title="PROINTER — Professores da Rede Pública e Afroempreendedores"
                description="Programa que leva professores da rede pública e afroempreendedores para Harvard Square, MIT e as Nações Unidas — passagem, hospedagem e curadoria completas."
                image="/images/og-prointer.webp"
              />
              <Prointer />
            </>} />
            <Route path="/govia" element={<>
              <PageMeta
                slug="govia"
                path="/govia"
                title="eGovIA — Governança de IA para a Administração Pública"
                description="Governança de inteligência artificial para municípios, estados e consórcios públicos: conformidade legal, agentes por secretaria e Observatório de IA."
              />
              <GovIA />
            </>} />
            <Route path="/expos" element={<>
              <PageMeta
                slug="expos"
                path="/expos"
                title="EXPOs — EXPO BH®, EXPO BOSTON® e EXPO NYC® | HUB PAN"
                description="As EXPOs do Fórum Pan-Americano da Inovação: plataformas territoriais em Belo Horizonte, Cambridge e Nova York que conectam os ecossistemas das Américas."
              />
              <Expos />
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
                title="Contato — Fale com o HUB PAN e Conecte-se"
                description="Fale com o HUB PAN: seja qual for seu perfil — governo, empresa, educador ou parceiro — encontre o caminho certo pra se conectar à infraestrutura."
              />
              <Contato />
            </>} />
            <Route path="/glossario" element={<>
              <PageMeta
                slug="glossario"
                path="/glossario"
                title="Glossário HUB PAN — Conceitos de Inovação, IA e Impacto"
                description="Glossário HUB PAN: definições claras dos conceitos centrais de inovação, IA, governança e impacto — pra qualquer pessoa entender o que fazemos e por quê."
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
                title="Casos de Uso do HUB PAN — Resultados Reais"
                description="Casos de uso do HUB PAN: resultados reais de professoras da rede pública, prefeituras e startups que já viveram o que propomos."
              />
              <CasosDeUso />
            </>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    </Suspense>
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
