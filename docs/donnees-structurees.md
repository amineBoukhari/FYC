# Vidéo 10 — Données structurées (JSON-LD)

Les données structurées décrivent **explicitement** les entités d'une page (une personne, un article, un fil d'Ariane…) dans le vocabulaire [Schema.org](https://schema.org). Le format recommandé par Google est le **JSON-LD** : un bloc `<script type="application/ld+json">` dans le `<head>`, indépendant du HTML visible.

## Ce que publie le portfolio

| Page                | Types Schema.org                 | Généré par (`src/utils/schema.ts`)        |
| ------------------- | -------------------------------- | ----------------------------------------- |
| `/`                 | `WebSite` + `Person`             | `websiteSchema()`, `personSchema()`       |
| `/a-propos/`        | `ProfilePage` (→ `Person`)       | `profilePageSchema()`                     |
| `/blog/[id]/`       | `BlogPosting` + `BreadcrumbList` | `blogPostingSchema()`, `breadcrumbSchema()` |
| `/projets/[id]/`    | `CreativeWork` + `BreadcrumbList` | `projectSchema()`, `breadcrumbSchema()`   |
| `/faq/`             | `FAQPage`                        | `faqSchema()`                             |

## Choix de conception

- **Un graphe d'entités reliées.** La personne et le site ont un `@id` stable (`https://…/#person`, `https://…/#website`). Les articles y font référence (`author`, `publisher`, `isPartOf`) au lieu de répéter les informations.
- **Les données viennent des Content Collections** : titre, description, dates, image. Le JSON-LD ne peut pas diverger du contenu affiché.
- **Composant `JsonLd.astro`** : sérialise l'objet et échappe `<` pour qu'un contenu contenant `</script>` ne casse pas la page. Il est injecté dans le `<head>` via le slot nommé `head` du layout.
- **Pas de `Product`** : un portfolio ne vend pas de produit. Un projet est une œuvre (`CreativeWork`) ; utiliser `Product` serait un balisage trompeur.

## Ce qu'il faut savoir sur les résultats enrichis

- Un balisage valide **ne garantit pas** un affichage enrichi dans Google : c'est le moteur qui décide.
- **FAQPage** : depuis 2023, Google n'affiche plus les résultats enrichis FAQ que pour des sites gouvernementaux ou de santé faisant autorité. Le balisage reste utile pour décrire la page (et pour d'autres moteurs), mais il ne faut pas promettre d'effet visuel dans Google.
- **Article / BlogPosting** et **BreadcrumbList** restent pris en charge par Google (fil d'Ariane dans l'URL affichée, informations d'article).

## Valider

1. `npm run build`, puis ouvrez le HTML d'une page dans `dist/client/` et copiez son bloc JSON-LD.
2. Collez-le dans le [test des résultats enrichis de Google](https://search.google.com/test/rich-results) (onglet « Code ») ou dans le [validateur Schema.org](https://validator.schema.org/).
3. Une fois le site en ligne, testez directement l'URL publique.
