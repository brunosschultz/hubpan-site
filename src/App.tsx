import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { EditorProvider } from './editor/store'
import EditorPage from './editor/EditorPage'
import PreviewPage from './editor/PreviewPage'
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
      <SmoothScroll>
        <ScrollToTop />
        <NavBar />
        <main className="w-full overflow-x-hidden">
          <Routes>
            <Route path="/" element={<>
              <PageMeta
                path="/"
                title="HUB PAN — Plataforma Internacional de Inovação"
                description="Unimos as Américas e África ao ecossistema global de inovação, educação, IA, impacto e cooperação. Conheça o HUB PAN."
              />
              <Home />
            </>} />
            <Route path="/editar" element={<><NoIndexMeta /><EditorPage /></>} />
            <Route path="/preview" element={<><NoIndexMeta /><PreviewPage /></>} />
            <Route path="/o-hub-pan" element={<>
              <PageMeta
                path="/o-hub-pan"
                title="O HUB PAN — Conheça o Ecossistema"
                description="Seja como governo, empresa, educador, investidor ou comunidade — descubra o caminho certo pra você dentro do ecossistema HUB PAN."
              />
              <Institucional />
            </>} />
            <Route path="/prointer" element={<>
              <PageMeta
                path="/prointer"
                title="PROINTER — Intercâmbio de Impacto em Harvard e Nova York"
                description="Programa gratuito que leva professores da rede pública e afroempreendedores para Harvard Square, MIT e as Nações Unidas — passagem, hospedagem e curadoria completas."
              />
              <Prointer />
            </>} />
            <Route path="/govia" element={<>
              <PageMeta
                path="/govia"
                title="GovIA — Plataforma de IA para o Setor Público"
                description="Assinatura institucional de inteligência artificial para municípios, estados e consórcios públicos — sem cartão de crédito. Ferramentas, formação e Observatório de IA."
              />
              <GovIA />
            </>} />
            <Route path="/forum-mundial-ia" element={<>
              <PageMeta
                path="/forum-mundial-ia"
                title="Fórum Mundial de Inteligência Artificial (WAIF) — Cambridge 2027"
                description="O maior ativo estratégico do HUB PAN reúne players globais de IA, policy makers, pesquisadores e investidores em Cambridge, Massachusetts."
              />
              <ForumMundialIA />
            </>} />
            <Route path="/insights" element={<>
              <PageMeta
                path="/insights"
                title="HUB PAN Insights — Observatórios, Pesquisas e White Papers"
                description="Observatórios temáticos, pesquisas, artigos e relatórios sobre inovação, IA, governança, educação e cooperação internacional."
              />
              <Insights />
            </>} />
            <Route path="/contato" element={<>
              <PageMeta
                path="/contato"
                title="Contato — Fale com o HUB PAN"
                description="Seja qual for seu perfil — governo, empresa, educador ou parceiro — encontre o caminho certo pra entrar no ecossistema HUB PAN."
              />
              <Contato />
            </>} />
            <Route path="/glossario" element={<>
              <PageMeta
                path="/glossario"
                title="Glossário HUB PAN — Conceitos de Inovação, IA e Impacto"
                description="Definições claras dos conceitos centrais do ecossistema HUB PAN — para qualquer pessoa entender o que fazemos e por quê."
              />
              <Glossario />
            </>} />
            <Route path="/imprensa" element={<>
              <PageMeta
                path="/imprensa"
                title="Imprensa & Mídia — Press Kit HUB PAN"
                description="Material estruturado para jornalistas e pesquisadores: dados do Observatório de IA, releases institucionais, press kit e contato com a assessoria."
              />
              <Imprensa />
            </>} />
            <Route path="/casos-de-uso" element={<>
              <PageMeta
                path="/casos-de-uso"
                title="Casos de Uso — Resultados Reais do HUB PAN"
                description="Dados, histórias e resultados documentados de quem já viveu o que o HUB PAN propõe."
              />
              <CasosDeUso />
            </>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <S11Newsletter />
          <Footer />
        </main>
      </SmoothScroll>
      </EditorProvider>
    </BrowserRouter>
  )
}
