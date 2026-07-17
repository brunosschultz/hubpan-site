import S1Hero from './sections/S1Hero'
import S2Manifesto from './sections/S2Manifesto'
import S3Plataformas from './sections/S3Plataformas'
import S4Autoridade from './sections/S4Autoridade'
import S5Jornada from './sections/S5Jornada'
import S6Numeros from './sections/S6Numeros'
import S7ParaQuem from './sections/S7ParaQuem'
import S8Governanca from './sections/S8Governanca'
import S9Insights from './sections/S9Insights'
import S10Parceiros from './sections/S10Parceiros'
import S11Newsletter from './sections/S11Newsletter'
import Footer from './components/Footer'

export default function App() {
  return (
    <main className="w-full overflow-x-hidden">
      <S1Hero />
      <S2Manifesto />
      <S3Plataformas />
      <S4Autoridade />
      <S5Jornada />
      <S6Numeros />
      <S7ParaQuem />
      <S8Governanca />
      <S9Insights />
      <S10Parceiros />
      <S11Newsletter />
      <Footer />
    </main>
  )
}
