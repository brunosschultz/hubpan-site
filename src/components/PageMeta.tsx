import { useEffect } from 'react';

/**
 * Título, descrição e tags sociais (Open Graph/Twitter) de cada página.
 * Atualiza o <head> tanto em navegação normal (SPA) quanto durante a
 * pré-renderização de build (scripts/prerender.mjs captura o <head> já
 * preenchido, então cada rota gera HTML estático com seu próprio SEO).
 *
 * Trocar SITE_URL pelo domínio definitivo do cliente assim que for conectado
 * na Vercel (ver pendência em CLAUDE.md).
 */
export const SITE_URL = 'https://hubpan-site.vercel.app';
const DEFAULT_IMAGE = `${SITE_URL}/images/s1-hero-bg.webp`;

interface PageMetaProps {
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

export default function PageMeta({ title, description, path, image }: PageMetaProps) {
  useEffect(() => {
    document.title = title;
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

    meta('name', 'description', description);
    meta('property', 'og:type', 'website');
    meta('property', 'og:site_name', 'HUB PAN');
    meta('property', 'og:title', title);
    meta('property', 'og:description', description);
    meta('property', 'og:url', url);
    meta('property', 'og:image', img);
    meta('name', 'twitter:card', 'summary_large_image');
    meta('name', 'twitter:title', title);
    meta('name', 'twitter:description', description);
    meta('name', 'twitter:image', img);

    const canonical = upsertTag('link[rel="canonical"]', () => {
      const l = document.createElement('link');
      l.setAttribute('rel', 'canonical');
      return l;
    }) as HTMLLinkElement;
    canonical.setAttribute('href', url);
  }, [title, description, path, image]);

  return null;
}

/** Marca a página como "não indexar" — usado em /editar e /preview. */
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
