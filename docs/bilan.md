# Vidéo 15 — Bilan et retour d'expérience

## Ce que le fil rouge a démontré

| Levier d'Astro                          | Effet mesuré dans le projet                                                      |
| --------------------------------------- | -------------------------------------------------------------------------------- |
| Rendu statique par défaut               | HTML complet dès la première réponse : lisible par tous les robots, y compris ceux qui n'exécutent pas le JavaScript |
| Zéro JavaScript par défaut, îlots       | 12 pages sur 13 sans aucun JavaScript ; ≈ 11 Ko gzip sur la seule page interactive |
| `astro:assets`                          | Accueil : 4 025 Kio → 51 Kio, LCP mobile 22,3 s → 1,0 s (`docs/performance.md`) |
| Content Collections                     | Contenu typé ; métadonnées, JSON-LD, sitemap et `llms.txt` générés depuis une seule source |
| Mode hybride + adaptateur               | Formulaire SSR sur Cloudflare sans renoncer au statique pour le reste           |

| Démarche GEO                            | Résultat                                                                         |
| --------------------------------------- | -------------------------------------------------------------------------------- |
| Mesurer avant d'optimiser (`audit:geo`) | 76 / 97 critères, 7 échecs bloquants (`video-11`)                                 |
| Restructurer deux pages + `llms.txt`    | 85 / 97 critères, 0 échec bloquant (`video-12`)                                    |
| Automatiser                             | L'audit bloque la CI si un critère bloquant régresse (`video-14`)                  |

## Les idées à retenir

1. **SEO et GEO partagent leurs fondations** : HTML sémantique, performance, données structurées, URL propres. Le GEO ajoute une exigence d'**extractibilité** : des passages courts, autonomes et factuels.
2. **L'architecture est un choix de référencement.** Un site rendu côté client part avec un handicap que l'optimisation de contenu ne compense pas.
3. **Un score n'est pas une stratégie.** Lighthouse donnait 100 en SEO avant le moindre sitemap ou JSON-LD (vidéo 07).
4. **Ce qui n'est pas mesuré régresse.** D'où l'audit GEO et Lighthouse CI dans la chaîne de déploiement.
5. **Rester lucide sur les standards émergents** : `llms.txt` est une proposition, les résultats enrichis FAQ sont limités par Google depuis 2023. On les adopte pour ce qu'ils coûtent (peu), sans leur prêter d'effet garanti.

## Réutiliser le projet

- Remplacer les informations de `src/data/site.ts` et le contenu de `src/content/`.
- Configurer `SITE_URL` et les secrets Cloudflare (`docs/deploiement.md`).
- Dérouler la [check-list SEO / GEO](checklist-seo-geo.md) avant chaque mise en production.

## Retour d'expérience du groupe

> Section à rédiger par le groupe : elle doit refléter votre expérience réelle de production du cours.

- **Ce qui a bien fonctionné** : …
- **Les difficultés rencontrées** (techniques, pédagogiques, organisation) : …
- **Ce que nous ferions autrement** : …
- **Répartition du travail** : …
