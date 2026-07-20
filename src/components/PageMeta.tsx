import { useEffect } from 'react';
import { useEditorStore } from '../editor/store';
import { seoKey } from '../admin/seo';

/**
 * Título, descrição e tags sociais (Open Graph/Twitter) de cada página.
 * Atualiza o <head> tanto em navegação normal (SPA) quanto durante a
 * pré-renderização de build (scripts/prerender.mjs captura o <head> já
 * preenchido, então cada rota gera HTML estático com seu próprio SEO).
 *
 * `title`/`description` das props são os valores PADRÃO do código — se o
 * Painel Admin (/admin/paginas/<slug>) tiver um override salvo em
 * `content_overrides` (chaves `seo.<slug>.*`), ele vence. `slug` precisa
 * bater com o mesmo usado em `src/editor/pageRoutes.ts`.
 *
 * Trocar SITE_URL pelo domínio definitivo do cliente assim que for conectado
 * na Vercel (ver pendência em CLAUDE.md).
 */
export const SITE_URL = 'https://hubpan-site.vercel.app';
const DEFAULT_IMAGE = `${SITE_URL}/images/s1-hero-bg.webp`;

interface PageMetaProps {
  slug: string;
  title: string;
  description: string;
  path: string;
  image?: string;
}

function upsertTag(selector: string, build: () => HTMLElement) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = build();
    document.head.appendChild(el);
  }
  return el;
}

export default function PageMeta({ slug, title, description, path, image }: PageMetaProps) {
  const { get } = useEditorStore();

  /* Calculados no corpo do componente (não dentro do efeito!) — assim entram
   * nas deps do efeito abaixo e o <head> é atualizado quando o fetch
   * assíncrono do Supabase resolve, não só na primeira montagem. Sem isso o
   * SSG (que não navega, só carrega uma vez) capturaria sempre o valor
   * padrão do código mesmo com um override salvo. */
  const effectiveTitle = get(seoKey(slug, 'title'), title) || title;
  const effectiveDescription = get(seoKey(slug, 'description'), description) || description;
  const noindexOverride = get(seoKey(slug, 'noindex'), 'false') === 'true';

  useEffect(() => {
    document.title = effectiveTitle;
    const url = `${SITE_URL}${path}`;
    const img = image ?? DEFAULT_IMAGE;

    const meta = (attr: 'name' | 'property', key: string, content: string) => {
      const el = upsertTag(`meta[${attr}="${key}"]`, () => {
        const m = document.createElement('meta');
        m.setAttribute(attr, key);
        return m;
      }) as HTMLMetaElement;
      el.setAttribute('content', content);
    };

    meta('name', 'description', effectiveDescription);
    meta('property', 'og:type', 'website');
    meta('property', 'og:site_name', 'HUB PAN');
    meta('property', 'og:title', effectiveTitle);
    meta('property', 'og:description', effectiveDescription);
    meta('property', 'og:url', url);
    meta('property', 'og:image', img);
    meta('name', 'twitter:card', 'summary_large_image');
    meta('name', 'twitter:title', effectiveTitle);
    meta('name', 'twitter:description', effectiveDescription);
    meta('name', 'twitter:image', img);
    meta('name', 'robots', noindexOverride ? 'noindex, nofollow' : 'index, follow');

    const canonical = upsertTag('link[rel="canonical"]', () => {
      const l = document.createElement('link');
      l.setAttribute('rel', 'canonical');
      return l;
    }) as HTMLLinkElement;
    canonical.setAttribute('href', url);
  }, [effectiveTitle, effectiveDescription, noindexOverride, path, image]);

  return null;
}

/** Marca a página como "não indexar" — usado em /editar, /preview e /admin. */
export function NoIndexMeta() {
  useEffect(() => {
    const el = upsertTag('meta[name="robots"]', () => {
      const m = document.createElement('meta');
      m.setAttribute('name', 'robots');
      return m;
    }) as HTMLMetaElement;
    el.setAttribute('content', 'noindex, nofollow');
    return () => { el.setAttribute('content', 'index, follow'); };
  }, []);
  return null;
}
