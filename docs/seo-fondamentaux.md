# Vidéo 08 — Les fondamentaux techniques du SEO

Ces briques sont indépendantes de tout framework. Le tableau indique où chacune est traitée dans le fil rouge.

| Brique                    | Rôle pour le moteur de recherche                                                | Dans le projet                   |
| ------------------------- | ------------------------------------------------------------------------------- | -------------------------------- |
| `<title>` unique          | Titre affiché dans les résultats, principal signal de pertinence de la page     | Vidéo 04, généralisé vidéo 09    |
| `<meta name="description">` | Extrait proposé dans les résultats (pas un facteur de classement direct)       | Vidéo 04, généralisé vidéo 09    |
| `lang` sur `<html>`       | Langue du contenu                                                               | Vidéo 04                         |
| HTML sémantique, `h1` → `h2` → `h3` | Comprendre la structure et la hiérarchie des informations              | **Vidéo 08** (titres des cartes) |
| URL propres et stables    | Lisibles, descriptives, une seule version par page                              | **Vidéo 08** (`trailingSlash`)   |
| Redirections 301          | Transmettre l'autorité d'une ancienne URL vers la nouvelle                      | **Vidéo 08** (`/a-propos` → `/a-propos/`) |
| Page 404 utile            | Code HTTP correct + liens pour ne pas perdre le visiteur                         | **Vidéo 08**                     |
| Maillage interne          | Faire découvrir les pages et répartir l'autorité entre elles                    | **Vidéo 08** (fil d'Ariane, « À lire aussi », « Projets similaires ») |
| URL canonique             | Désigner la version de référence d'une page                                     | Vidéo 09                         |
| `sitemap.xml`             | Lister les URL à explorer                                                       | Vidéo 09                         |
| `robots.txt`              | Indiquer ce qui peut être exploré, et où trouver le sitemap                     | Vidéo 09                         |
| Open Graph                | Aperçu lors d'un partage (réseaux sociaux, messageries)                         | Vidéo 09                         |
| Données structurées       | Décrire explicitement les entités (personne, article…)                          | Vidéo 10                         |

## Ce que change le commit `video-08`

1. **Une seule URL par page.** Avant, `/a-propos` et `/a-propos/` renvoyaient toutes deux le même contenu (HTTP 200). Avec `trailingSlash: 'always'`, la version sans slash redirige en **301** vers la version avec slash. Sur Cloudflare, la redirection automatique serait une 307 (temporaire, signal faible pour les moteurs) : l'intégration `redirections301` d'`astro.config.mjs` génère au build un fichier `_redirects` qui impose des 301. Tous les liens internes pointent directement vers la bonne version.
2. **Hiérarchie de titres.** Sur `/projets/` et `/blog/`, les titres des cartes passaient directement de `h1` à `h3` (erreur `heading-order` relevée par Lighthouse). Le composant `Card` accepte désormais un `level` (`2` ou `3`) selon son contexte.
3. **Fil d'Ariane** sur les pages de détail : il donne du contexte au visiteur comme au robot (et sera décrit en JSON-LD à la vidéo 10).
4. **Maillage interne** : « À lire aussi » (articles qui partagent des thèmes), « Projets similaires » (projets qui partagent une technologie), lien de l'auteur vers `/a-propos/`.
5. **Page 404** personnalisée, servie avec le code HTTP 404 et des liens vers les sections principales.

## Vérifier

```bash
npm run build && npm run preview
curl -I http://localhost:4321/a-propos      # 301 → /a-propos/
curl -I http://localhost:4321/nimporte-quoi # 404
```
