// ═══════════════════════════════════════════════════════════════════
// Pré-renderização de build (SSG) — roda DEPOIS do `vite build`.
//
// Por quê: o site é uma SPA (React puro client-side) — o servidor entrega
// uma página vazia e o navegador monta tudo via JavaScript. Buscadores de IA
// (GPTBot, ClaudeBot etc.) não executam esse JavaScript e veem página em
// branco; o Google executa, mas com atraso e prioridade menor.
//
// O que este script faz: abre um Chrome invisível (Puppeteer), visita cada
// rota pública do site já construído, espera o React montar e os dados do
// Supabase carregarem, e salva o HTML final (já com todo o texto dentro)
// como um arquivo estático por rota. A Vercel serve esse arquivo pronto pra
// quem acessa direto, e o JavaScript "acorda" por cima assim que carrega —
// pra humanos, nenhuma diferença visual; pra robôs, tudo fica legível na hora.
//
// Segurança: propositalmente NUNCA falha o build inteiro. Se o Chrome não
// conseguir abrir por qualquer motivo no ambiente da Vercel, o script avisa
// e sai — o site publica normal, só sem esse reforço de SEO naquele deploy.
// ═══════════════════════════════════════════════════════════════════

import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DIST = join(ROOT, 'dist');

// Rotas públicas — mesma lista usada no sitemap.xml. Ao criar uma página
// nova em App.tsx, adicionar aqui também (não incluir /editar nem /preview).
const ROUTES = [
  '/', '/o-hub-pan', '/prointer', '/govia', '/expos', '/forum-mundial-ia',
  '/insights', '/contato', '/glossario', '/imprensa', '/casos-de-uso',
];

const SITE_URL = 'https://hubpan-site.vercel.app';

function writeSitemap() {
  const today = new Date().toISOString().slice(0, 10);
  const urls = ROUTES.map((r) => `  <url>
    <loc>${SITE_URL}${r}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${r === '/' ? '1.0' : '0.7'}</priority>
  </url>`).join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  writeFileSync(join(DIST, 'sitemap.xml'), xml, 'utf-8');
  console.log('[prerender] sitemap.xml gerado.');
}

/** Local (Mac/Windows/Linux dev): puppeteer "completo" já baixa um Chrome que
 * funciona direto. Build da Vercel: esse Chrome completo falha — falta
 * biblioteca de sistema que a imagem de build não tem. @sparticuz/chromium é
 * um Chromium enxuto, compilado especificamente pra rodar em ambientes assim
 * (Vercel/AWS Lambda) — usa puppeteer-core (sem baixar Chrome próprio) mais
 * esse binário. Detecta o ambiente pela env var VERCEL, que a própria Vercel
 * define automaticamente durante o build. */
async function launchBrowser() {
  if (process.env.VERCEL) {
    const [{ default: chromium }, { default: puppeteerCore }] = await Promise.all([
      import('@sparticuz/chromium'),
      import('puppeteer-core'),
    ]);
    return puppeteerCore.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: true,
    });
  }
  const { default: puppeteer } = await import('puppeteer');
  return puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });
}

async function prerenderRoutes() {
  if (!existsSync(join(DIST, 'index.html'))) {
    console.warn('[prerender] dist/index.html não encontrado — rode vite build antes. Pulando.');
    return;
  }

  let previewServer;
  try {
    const vite = await import('vite');
    previewServer = await vite.preview({ preview: { port: 4173, strictPort: false }, root: ROOT });
    const port = previewServer.config.preview.port;
    const base = `http://localhost:${port}`;

    const browser = await launchBrowser();

    try {
      for (const route of ROUTES) {
        const page = await browser.newPage();
        try {
          await page.setViewport({ width: 1440, height: 900 });
          await page.goto(`${base}${route}`, { waitUntil: 'networkidle0', timeout: 30000 });
          // dá tempo do fetch do Supabase e da montagem inicial do GSAP terminarem
          await new Promise((r) => setTimeout(r, 700));
          // torna visível qualquer coisa que dependa de scroll/animação de entrada —
          // o robô não rola a página, então nada deve depender disso pra ser lido
          await page.evaluate(() => {
            // .char = spans que o GSAP SplitText cria dentro de [data-split-reveal]
            // (título/frase com efeito "revert after animation") — cada caractere
            // também precisa ser forçado a visível, não só o container do título.
            document.querySelectorAll('[data-animate], [data-hero-text], [data-split-reveal], .char').forEach((el) => {
              el.style.opacity = '1';
              el.style.transform = 'none';
            });
          });
          const html = await page.content();

          const outDir = route === '/' ? DIST : join(DIST, route.slice(1));
          if (route !== '/') mkdirSync(outDir, { recursive: true });
          writeFileSync(join(outDir, 'index.html'), html, 'utf-8');
          console.log(`[prerender] ${route} → ok`);
        } catch (err) {
          console.warn(`[prerender] ${route} → falhou, mantendo versão client-side:`, err.message);
        } finally {
          await page.close();
        }
      }
    } finally {
      await browser.close();
    }
  } catch (err) {
    console.warn('[prerender] não foi possível pré-renderizar neste ambiente — site publica normal:', err.message);
  } finally {
    if (previewServer) await previewServer.httpServer.close();
  }
}

try {
  writeSitemap();
  await prerenderRoutes();
} catch (err) {
  console.warn('[prerender] erro inesperado, ignorando:', err);
}

// nunca sai com código de erro — falha aqui não pode derrubar o deploy inteiro
process.exit(0);
