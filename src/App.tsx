import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { EditorProvider } from './editor/store'
import EditorPage from './editor/EditorPage'
import SmoothScroll from './components/SmoothScroll'
import ScrollToTop from './components/ScrollToTop'
import NavBar from './components/NavBar'
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

export default function App() {
  return (
    <BrowserRouter>
      <EditorProvider>
      <SmoothScroll>
        <ScrollToTop />
        <NavBar />
        <main className="w-full overflow-x-hidden">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/editar" element={<EditorPage />} />
            <Route path="/o-hub-pan" element={<Institucional />} />
            <Route path="/prointer" element={<Prointer />} />
            <Route path="/govia" element={<GovIA />} />
            <Route path="/forum-mundial-ia" element={<ForumMundialIA />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/contato" element={<Contato />} />
            <Route path="/glossario" element={<Glossario />} />
            <Route path="/imprensa" element={<Imprensa />} />
            <Route path="/casos-de-uso" element={<CasosDeUso />} />
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
