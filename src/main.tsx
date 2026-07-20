import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

/* Rotas públicas chegam pré-renderizadas (scripts/prerender.mjs, HTML já
 * com todo o texto pronto) — reaproveitar esse HTML via `hydrateRoot` em
 * vez de reconstruir do zero com `createRoot` é o que faz o visitante ver
 * o conteúdo na hora, sem esperar o JavaScript inteiro rodar (achado real
 * da auditoria de velocidade: o "atraso de renderização" do LCP não vinha
 * de imagem/animação/tamanho de pacote, vinha disso). Em dev (`npm run dev`)
 * e em qualquer rota que não passou pela pré-renderização (ex: se o script
 * falhar em algum deploy), `#root` está vazio — nesse caso `createRoot`
 * continua sendo o caminho certo, hydrateRoot com nó vazio gera aviso à toa. */
const rootEl = document.getElementById('root')!
const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

if (rootEl.hasChildNodes()) {
  hydrateRoot(rootEl, app)
} else {
  createRoot(rootEl).render(app)
}
