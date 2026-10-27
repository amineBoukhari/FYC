# Portfolio fil rouge — « Astro & l'optimisation SEO / GEO »

Projet fil rouge du cours FYC (ESGI, Mastère). On construit, vidéo après vidéo, le **portfolio d'un développeur** (Alex Morel, personnage fictif) : présentation, projets, articles techniques et contact.

**Chaque commit correspond à une vidéo du cours** et porte un tag `video-XX`. Pour retrouver l'état du projet à la fin d'une vidéo :

```bash
git checkout video-04
```

> Pour en faire votre propre portfolio, modifiez `src/data/site.ts` (nom, e-mail, réseaux).

## Démarrer en local

Pré-requis : Node.js 22.12 ou plus récent.

```bash
npm install
npm run dev        # http://localhost:4321
```

| Commande          | Rôle                                               |
| ----------------- | -------------------------------------------------- |
| `npm run dev`     | Serveur de développement avec rechargement à chaud |
| `npm run build`   | Génère le site de production dans `dist/`          |
| `npm run preview` | Sert le build dans le runtime Cloudflare local (workerd) |

> L'URL publique du site (utilisée pour les URL canoniques, Open Graph et le sitemap) se règle au build : `SITE_URL=https://mon-domaine.fr npm run build`.

## Arborescence

```text
├── docs/                # Mesures et notes de cours (performance, audits…)
├── public/              # Fichiers servis tels quels, sans traitement (favicon)
├── src/
│   ├── assets/          # Images sources, optimisées au build par astro:assets
│   ├── components/      # Composants .astro réutilisables
│   ├── content/         # Contenu éditorial : projets/ (.md) et blog/ (.md, .mdx)
│   ├── content.config.ts # Schémas des Content Collections
│   ├── data/            # Données du site (infos personnelles)
│   ├── layouts/         # Gabarits de page (BaseLayout)
│   ├── pages/           # Routage par fichiers : 1 fichier = 1 URL
│   └── styles/          # CSS global
├── astro.config.mjs     # Configuration d'Astro
└── package.json
```

## Progression

| Tag        | Vidéo                                | Ce que le commit ajoute                                                       |
| ---------- | ------------------------------------ | ----------------------------------------------------------------------------- |
| `video-04` | Prise en main : premier projet Astro | Projet initial, layout, composants, 4 pages (accueil, projets, à propos, contact) |
| `video-05` | Modes de rendu : SSG, SSR et hybride | Adaptateur Cloudflare, formulaire de contact traité côté serveur (SSR)        |
| `video-06` | Structurer le contenu (Content Collections) | Collections `projets` et `blog` typées avec Zod, pages liste + détail, MDX |
| `video-07` | Performance et Core Web Vitals       | Images via `astro:assets` (WebP, `srcset`, `priority`), mesures Lighthouse avant/après |
| `video-08` | Les fondamentaux techniques du SEO   | URL canoniques (`trailingSlash`, 301), page 404, hiérarchie des titres, fil d'Ariane, maillage interne |
| `video-09` | Implémenter le SEO on-page dans Astro | Composant `SEO` (title, canonical, Open Graph), `site`, sitemap, robots.txt     |

### Vidéo 04 — Prise en main

- **Routage par fichiers** : `src/pages/a-propos.astro` devient `/a-propos` (puis `/a-propos/` à partir de la vidéo 08).
- **Composants** : un fichier `.astro` = un *frontmatter* (code exécuté au build, entre `---`) + un template HTML + un `<style>` automatiquement limité au composant.
- **Composition** : `Card` est réutilisé sur l'accueil et la page projets ; `BaseLayout` factorise `<html>`, `<head>`, l'en-tête et le pied de page, chaque page y injecte son contenu via `<slot />`.
- **Balises meta de base** : chaque page passe un `title` et une `description` au layout.
- **Zéro JavaScript par défaut** : lancez `npm run build` puis inspectez `dist/` : aucun fichier `.js` n'est envoyé au navigateur.

> Volontairement, l'image du *hero* est un JPEG brut de 1,2 Mo servi depuis `public/`, sans dimensions. On le corrigera à la vidéo 07 (Core Web Vitals).

### Vidéo 05 — Modes de rendu : SSG, SSR et hybride

| Page                             | Mode                          | Pourquoi                                                          |
| -------------------------------- | ----------------------------- | ----------------------------------------------------------------- |
| `/`, `/projets`, `/a-propos`     | **SSG** (prérendu au build)   | Contenu stable : HTML prêt à l'emploi, ultra-rapide, idéal pour les robots |
| `/contact`                       | **SSR** (`prerender = false`) | Il faut lire et valider le formulaire envoyé en `POST`            |

- `output: 'static'` reste le défaut : **tout est statique sauf opt-out explicite**. C'est le mode « hybride ».
- L'adaptateur `@astrojs/cloudflare` produit `dist/client/` (fichiers statiques, servis directement par le CDN de Cloudflare) et `dist/server/` (un Worker qui exécute les pages SSR). `imageService: 'compile'` conserve l'optimisation des images au build.
- Testez : `npm run build && npm run preview` (le build tourne en local dans workerd, le runtime de Cloudflare), puis envoyez le formulaire vide → erreurs affichées (HTTP 400), sans une ligne de JavaScript côté client.
- Sécurité : Astro refuse par défaut les `POST` de formulaire venant d'un autre site (`security.checkOrigin`, réponse 403) — une protection CSRF intégrée.
- Côté SEO/GEO : même en SSR, le robot reçoit un HTML complet, contrairement à une SPA qui construit le contenu en JavaScript côté client.

### Vidéo 06 — Structurer le contenu avec les Content Collections

- `src/content.config.ts` déclare deux collections, chargées avec le loader `glob()` et validées par un schéma Zod (import depuis `astro/zod`). Un champ manquant ou mal typé **fait échouer le build** : impossible de publier un article sans `description`.
- `getCollection('blog')` liste les entrées ; `render(entry)` renvoie le composant `<Content />` ; `getStaticPaths()` génère une page par entrée (`/projets/[id]`, `/blog/[id]`).
- **`.md` ou `.mdx` ?**
  - `.md` (projets, la plupart des articles) : du texte structuré pur, lisible par n'importe quel outil. C'est le format le plus « citable » par les moteurs génératifs.
  - `.mdx` (`reflexes-accessibilite.mdx`) : Markdown + composants (`<Callout />`). À réserver aux contenus qui ont réellement besoin d'un composant.
- La liste statique `src/data/projects.ts` disparaît : l'accueil affiche désormais les projets `featured: true` et les 3 derniers articles.

> L'article `ssg-ssr-csr.md` est **volontairement mal structuré** (longue introduction, réponse en toute fin, titres `h3` directement sous le `h1`). Il servira de cas d'étude pour l'audit GEO (vidéos 11 et 12).

### Vidéo 07 — Performance et Core Web Vitals

| Accueil (mobile) | Avant | Après |
| ---------------- | ----- | ----- |
| Score performance | 74   | 99    |
| LCP               | 22,3 s | 1,0 s |
| Poids de la page  | 4 025 Kio | 51 Kio |

- Les images quittent `public/` (servi **sans traitement**) pour `src/assets/` : importées, elles passent par le pipeline `astro:assets`.
- `<Image />` génère du WebP en plusieurs tailles (`widths` + `sizes` → `srcset`) et ajoute `width` / `height` (plus de décalage de mise en page : CLS = 0).
- `priority` sur l'image candidate au LCP (hero, couverture d'article) : `loading="eager"` + `fetchpriority="high"`. Les autres images restent en `loading="lazy"`.
- Dans les collections, le helper `image()` du schéma remplace la simple chaîne de caractères : un chemin d'image erroné fait échouer le build.
- Détail des mesures et méthode : [`docs/performance.md`](docs/performance.md).

### Vidéo 08 — Les fondamentaux techniques du SEO

- **Une URL par page** : `trailingSlash: 'always'` → `/a-propos` redirige en 301 vers `/a-propos/` (avant : deux URL, même contenu). Cloudflare redirigerait en 307 (temporaire) : la mini-intégration `redirections301` génère un fichier `_redirects` qui impose des 301.
- **Hiérarchie des titres** : `Card` reçoit un `level` pour ne jamais sauter de niveau (`h1` → `h2` → `h3`).
- **Maillage interne** : composant `Breadcrumbs`, blocs « À lire aussi » et « Projets similaires », lien auteur → `/a-propos/`.
- **Page 404** personnalisée (`src/pages/404.astro`), servie avec le bon code HTTP.
- Panorama des briques SEO et de la vidéo où chacune est traitée : [`docs/seo-fondamentaux.md`](docs/seo-fondamentaux.md).

### Vidéo 09 — Implémenter le SEO on-page dans Astro

- **`site`** dans `astro.config.mjs` (surchargeable via `SITE_URL`) : sans lui, impossible de produire des URL absolues.
- **Composant `SEO.astro`**, appelé par `BaseLayout` : `title`, `meta description`, **URL canonique** (sans paramètres de requête), Open Graph (`og:title`, `og:image` 1200×630 recadrée depuis la couverture via `getImage()`…), carte Twitter, `noindex` optionnel (utilisé par la 404).
- **Sitemap** : `@astrojs/sitemap` génère `sitemap-index.xml` au build. La page SSR `/contact/` n'est pas connue au build : elle est ajoutée via `customPages`.
- **`robots.txt`** : un endpoint statique (`src/pages/robots.txt.ts`) qui référence le sitemap à partir de `site`.
- Vérifier : `npm run build` puis ouvrez `dist/client/sitemap-0.xml` et `dist/client/robots.txt` ; testez l'aperçu de partage d'une page avec un outil de prévisualisation Open Graph une fois le site en ligne.
