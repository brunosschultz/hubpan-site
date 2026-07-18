import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import SmoothScroll from './components/SmoothScroll'
import ScrollToTop from './components/ScrollToTop'
import NavBar from './components/NavBar'
import S11Newsletter from './sections/S11Newsletter'
import Footer from './components/Footer'
import Home from './pages/Home'
import Institucional from './pages/institucional'

export default function App() {
  return (
    <BrowserRouter>
      <SmoothScroll>
        <ScrollToTop />
        <NavBar />
        <main className="w-full overflow-x-hidden">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/o-hub-pan" element={<Institucional />} />
            {/* Rotas ainda não construídas voltam pra home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <S11Newsletter />
          <Footer />
        </main>
      </SmoothScroll>
    </BrowserRouter>
  )
}
