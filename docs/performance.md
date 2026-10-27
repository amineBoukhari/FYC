# Vidéo 07 — Mesures Lighthouse avant / après

Mesures réalisées avec Lighthouse 13 (profil **mobile** simulé : CPU ralenti ×4, réseau 4G lente), sur le build de production servi en local dans le runtime Cloudflare (`npm run build && npm run preview`).

| Page                      | État                         | Perf. | LCP    | CLS   | Poids total |
| ------------------------- | ---------------------------- | ----- | ------ | ----- | ----------- |
| `/`                       | Avant (`video-06`)           | 74    | 22,3 s | 0     | 4 025 Kio   |
| `/`                       | Après (`video-07`)           | 99    | 1,0 s  | 0     | 51 Kio      |
| `/projets`                | Avant                        | 74    | 20,8 s | 0     | 3 768 Kio   |
| `/projets`                | Après                        | 99    | 0,9 s  | 0     | 46 Kio      |
| `/blog/optimiser-le-lcp`  | Avant                        | 78    | 5,1 s  | 0,112 | 841 Kio     |
| `/blog/optimiser-le-lcp`  | Après                        | 99    | 0,9 s  | 0     | 16 Kio      |

## Ce qui a changé

| Problème (avant)                                                 | Correction (après)                                                    | Métrique |
| ---------------------------------------------------------------- | --------------------------------------------------------------------- | -------- |
| JPEG de 0,9 à 1,2 Mo servis tels quels depuis `public/`          | Images déplacées dans `src/assets/`, converties en WebP par `<Image />` | LCP, poids |
| Une seule taille d'image pour tous les écrans                    | `widths` + `sizes` : le navigateur choisit la taille utile (`srcset`) | LCP, poids |
| `<img>` sans `width` / `height` : la page « saute » au chargement | `<Image />` ajoute automatiquement les dimensions intrinsèques        | CLS      |
| Image principale chargée au même rang que le reste               | `priority` → `loading="eager"` + `fetchpriority="high"`               | LCP      |
| Couvertures référencées par une simple chaîne dans le frontmatter | Helper `image()` du schéma : chemin vérifié au build, image optimisée | —        |

## À retenir

- **Seuils « bons » des Core Web Vitals** (75ᵉ percentile des visites réelles) : LCP ≤ 2,5 s, INP ≤ 200 ms, CLS ≤ 0,1.
- L'**INP** (réactivité aux interactions) ne se mesure pas en laboratoire ; Lighthouse affiche à la place le **TBT** (temps de blocage du thread principal). Ici il est quasi nul : le site n'envoie aucun JavaScript.
- Le score **SEO Lighthouse est déjà à 100 avant toute optimisation SEO** : il ne vérifie que des bases (balise `title`, `meta description`, `lang`, liens explorables…). Il ne contrôle ni le sitemap, ni les données structurées, ni la qualité du contenu. Ce sera l'objet des vidéos 08 à 10.
- L'audit d'accessibilité relève une erreur `heading-order` sur `/projets` (des `h3` directement sous le `h1`) : corrigée à la vidéo 08.

## Reproduire la mesure

```bash
npm run build && npm run preview
# dans un autre terminal
npx lighthouse http://localhost:4321/ --form-factor=mobile --view
```
