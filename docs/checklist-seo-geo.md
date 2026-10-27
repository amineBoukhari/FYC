# Check-list SEO / GEO pour un site Astro

À dérouler avant chaque mise en production. La colonne « Où » renvoie à l'implémentation dans ce projet (tag Git de la vidéo).

## 1. Architecture et rendu

- [ ] Les pages de contenu sont **prérendues** (SSG) ; le SSR est réservé aux pages qui en ont besoin (`prerender = false`) — `video-05`
- [ ] Le contenu principal est présent dans le HTML **sans exécuter de JavaScript** (vérifier avec « Afficher le code source ») — `video-05`
- [ ] Le JavaScript client est limité à des **îlots**, hydratés le plus tard possible (`client:idle`, `client:visible`) — `video-13`
- [ ] Le contenu éditorial est typé dans des **Content Collections** : un champ manquant fait échouer le build — `video-06`

## 2. Performance (Core Web Vitals)

- [ ] Images dans `src/assets/` et affichées avec `<Image />` / `<Picture />` (formats modernes, `srcset`) — `video-07`
- [ ] `width` / `height` présents sur toutes les images (CLS ≤ 0,1) — `video-07`
- [ ] Image candidate au LCP en `priority`, aucune image au-dessus de la ligne de flottaison en `loading="lazy"` — `video-07`
- [ ] LCP ≤ 2,5 s et TBT ≤ 200 ms en mobile simulé ; seuils vérifiés en CI — `video-14`
- [ ] Core Web Vitals des vrais visiteurs suivis (Cloudflare Web Analytics, rapport CrUX) — `video-14`

## 3. SEO technique

- [ ] `lang` sur `<html>`, un `<title>` unique et une `meta description` (50–160 caractères) par page — `video-04`, `video-09`
- [ ] Une seule URL par page : `trailingSlash` cohérent, redirections **301** pour les variantes — `video-08`
- [ ] URL canonique absolue sur chaque page indexable ; aucune canonical sur les pages `noindex` — `video-09`
- [ ] `site` configuré avec l'URL de production réelle (`SITE_URL`) — `video-09`
- [ ] `sitemap-index.xml` généré, pages SSR ajoutées, 404 exclue — `video-09`
- [ ] `robots.txt` qui référence le sitemap — `video-09`
- [ ] Balises Open Graph (titre, description, image 1200×630) — `video-09`
- [ ] Hiérarchie de titres sans saut (`h1` → `h2` → `h3`), un seul `h1` — `video-08`
- [ ] Maillage interne : fil d'Ariane, contenus liés, aucune page orpheline — `video-08`
- [ ] Page 404 utile, servie avec le code HTTP 404 et en `noindex` — `video-08`

## 4. Données structurées

- [ ] JSON-LD valide sur chaque type de page (`WebSite`, `Person`, `BlogPosting`, `BreadcrumbList`, `CollectionPage`…) — `video-10`, `video-12`
- [ ] Entités reliées par `@id` (l'auteur d'un article **est** la personne du site) — `video-10`
- [ ] Données issues des collections : le JSON-LD ne contredit jamais le contenu affiché — `video-10`
- [ ] Validation dans le test des résultats enrichis de Google et le validateur Schema.org — `video-10`
- [ ] Aucun type trompeur (pas de `Product` sans produit, pas de FAQ invisible sur la page) — `video-10`

## 5. GEO : être compris et cité par les moteurs génératifs

- [ ] **Réponse directe** en tête de page : 1 à 3 phrases autonomes, citables sans le contexte — `video-12`
- [ ] Titres formulés comme les **questions** des utilisateurs — `video-12`
- [ ] Sections autonomes : chaque `h2` se comprend sans avoir lu le reste — `video-12`
- [ ] Comparaisons en **tableaux**, étapes en **listes** — `video-12`
- [ ] FAQ visible sur la page et décrite en `FAQPage` — `video-10`, `video-12`
- [ ] Auteur identifié, date de publication **et** de mise à jour visibles (`<time datetime>`) — `video-06`, `video-12`
- [ ] Faits vérifiables : chiffres, sources, dates — `video-11`
- [ ] `llms.txt` à la racine, généré depuis les collections (titre, résumé, liens commentés) — `video-12`
- [ ] Robots d'IA autorisés (ou bloqués) **volontairement** dans `robots.txt` — `video-11`
- [ ] Audit GEO sans échec bloquant (`npm run audit:geo -- --strict`) — `video-11`, `video-14`

## 6. Industrialisation

- [ ] `npm run check` sans erreur — `video-14`
- [ ] CI : typage → build → audit GEO → Lighthouse CI → déploiement, dans cet ordre — `video-14`
- [ ] Déploiement uniquement depuis la branche principale, après une CI verte — `video-14`
- [ ] Rapports (Lighthouse, audit GEO) conservés à chaque exécution — `video-14`
