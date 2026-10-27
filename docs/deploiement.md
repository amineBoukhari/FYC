# Vidéo 14 — Déployer et industrialiser le projet sur Cloudflare

## Où tourne le site ?

| Partie du site                                   | Servie par                                   |
| ------------------------------------------------ | -------------------------------------------- |
| Pages prérendues, images, `sitemap`, `llms.txt`  | Le CDN de Cloudflare (`dist/client/`)        |
| Pages SSR (`/contact/`)                          | Un **Worker** Cloudflare (`dist/server/`)    |
| Redirections 301 (`_redirects`), en-têtes (`_headers`) | Appliquées par Cloudflare avant le Worker |

Configuration : `wrangler.jsonc` (nom du Worker, date de compatibilité, point d'entrée fourni par `@astrojs/cloudflare`).

## Déployer à la main (première fois)

```bash
npx wrangler login          # ouvre le navigateur pour autoriser Wrangler sur votre compte Cloudflare
SITE_URL=https://portfolio-fil-rouge.<votre-sous-domaine>.workers.dev npm run build
npm run deploy              # = wrangler deploy
```

`npx wrangler deploy --dry-run` prépare l'envoi sans rien publier (aucun compte nécessaire) : pratique pour vérifier la configuration.

## Déploiement continu avec GitHub Actions

Le workflow `.github/workflows/ci.yml` enchaîne trois jobs :

```text
push / pull request
  └─ build ........ npm ci → astro check → astro build → audit GEO strict
       └─ lighthouse ... astro build → Lighthouse CI (seuils) → rapports en artefact
            └─ deploy ...... (main uniquement) astro build → wrangler deploy
```

Le déploiement n'a lieu **que si le typage, le build, l'audit GEO et les seuils Lighthouse sont au vert**.

### Configuration du dépôt GitHub

| Où (Settings → Secrets and variables → Actions) | Nom                     | Valeur                                                                 |
| ----------------------------------------------- | ----------------------- | ---------------------------------------------------------------------- |
| Secret                                          | `CLOUDFLARE_API_TOKEN`  | Jeton créé dans Cloudflare (*My Profile → API Tokens*, modèle « Edit Cloudflare Workers ») |
| Secret                                          | `CLOUDFLARE_ACCOUNT_ID` | Identifiant du compte (tableau de bord Cloudflare → *Workers & Pages*) |
| Variable                                        | `SITE_URL`              | URL publique, par exemple `https://portfolio-fil-rouge.<sous-domaine>.workers.dev` ou votre domaine |

> `SITE_URL` doit correspondre à l'URL réelle : elle est utilisée dans les canonical, Open Graph, le sitemap, `robots.txt` et `llms.txt`.

## Les seuils de qualité (Lighthouse CI)

Fichier `lighthouserc.cjs` — 3 passages par page (médiane), build servi par `astro preview` dans le runtime Cloudflare :

| Critère                    | Seuil       | Effet si dépassé |
| -------------------------- | ----------- | ---------------- |
| Performance                | ≥ 0,90      | Échec            |
| Accessibilité              | ≥ 0,95      | Échec            |
| Bonnes pratiques           | ≥ 0,90      | Échec            |
| SEO                        | ≥ 0,95      | Échec            |
| LCP                        | ≤ 2 500 ms  | Échec            |
| CLS                        | ≤ 0,1       | Échec            |
| TBT                        | ≤ 200 ms    | Avertissement    |

Le TBT n'est qu'un avertissement : sur `/projets/`, l'hydratation de l'îlot (vidéo 13) le fait varier d'un passage à l'autre.

## Suivre la performance dans le temps

- **Laboratoire** : chaque exécution de la CI conserve ses rapports Lighthouse en artefact (`lighthouse-<commit>`). Pour un historique avec graphiques, Lighthouse CI peut envoyer ses résultats vers un serveur LHCI (`upload.target: 'lhci'`).
- **Terrain** : activer **Cloudflare Web Analytics** sur le site (tableau de bord → *Analytics & Logs → Web Analytics*) mesure les Core Web Vitals des vrais visiteurs (LCP, INP, CLS), sans cookie.
- **Audit GEO** : le rapport `audit-geo.json` de chaque exécution garde la trace du score GEO, commit par commit.
