// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

// https://docs.astro.build/en/reference/configuration-reference/
export default defineConfig({
  // 'static' (défaut) : toutes les pages sont générées au build (SSG).
  // Une page peut passer en rendu à la demande (SSR) avec `export const prerender = false`.
  // => c'est le mode « hybride » : statique par défaut, serveur là où c'est utile.
  output: 'static',

  // Adaptateur Cloudflare : fichiers statiques servis par le CDN, pages SSR exécutées dans un Worker.
  // imageService 'compile' : images optimisées au build (sans le service Cloudflare Images).
  adapter: cloudflare({ imageService: 'compile' }),
  // Aucune session utilisée : évite de provisionner un espace de stockage KV au déploiement.
  session: false,
});
