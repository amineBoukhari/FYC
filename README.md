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

## Arborescence

```text
├── public/              # Fichiers servis tels quels (favicon, images brutes)
├── src/
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

### Vidéo 04 — Prise en main

- **Routage par fichiers** : `src/pages/a-propos.astro` devient `/a-propos`.
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
