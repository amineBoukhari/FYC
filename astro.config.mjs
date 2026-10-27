// @ts-check
import { writeFile } from 'node:fs/promises';
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import mdx from '@astrojs/mdx';

// Cloudflare ajoute le slash final avec une redirection 307 (temporaire).
// Cette mini-intégration génère un fichier _redirects pour imposer des 301 (permanentes) à la place.
/** @type {import('astro').AstroIntegration} */
const redirections301 = {
  name: 'redirections-301',
  hooks: {
    'astro:build:done': async ({ dir, pages, logger }) => {
      const rules = pages
        .map(({ pathname }) => pathname)
        .filter((path) => path.endsWith('/') && path !== '404/')
        .map((path) => `/${path.slice(0, -1)} /${path} 301`);
      await writeFile(new URL('_redirects', dir), rules.join('\n') + '\n');
      logger.info(`${rules.length} redirections 301 écrites dans _redirects`);
    },
  },
};

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  // 'static' (défaut) : toutes les pages sont générées au build (SSG).
  // Une page peut passer en rendu à la demande (SSR) avec `export const prerender = false`.
  // => c'est le mode « hybride » : statique par défaut, serveur là où c'est utile.
  output: 'static',

  // Une seule URL par page : /a-propos/ (avec slash final, comme le dossier généré au build).
  // Sans cela, /a-propos et /a-propos/ répondent toutes deux 200 : contenu dupliqué.
  trailingSlash: 'always',

  // Adaptateur Cloudflare : fichiers statiques servis par le CDN, pages SSR exécutées dans un Worker.
  // imageService 'compile' : images optimisées au build (sans le service Cloudflare Images).
  adapter: cloudflare({ imageService: 'compile' }),
  // Aucune session utilisée : évite de provisionner un espace de stockage KV au déploiement.
  session: false,

  integrations: [
    // Cloudflare : redirections 301 vers l'URL avec slash final (voir plus haut).
    redirections301,
    // MDX : Markdown + composants, pour les articles qui en ont besoin.
    mdx(),
  ],
});
