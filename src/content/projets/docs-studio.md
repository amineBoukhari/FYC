---
title: Docs Studio
summary: Site de documentation statique pour une bibliothèque open source, avec recherche plein texte et versions multiples.
year: 2026
role: Conception et développement
stack: [Astro, MDX, Pagefind, GitHub Actions]
cover: ../../assets/projets/docs-studio.jpg
coverAlt: Aperçu stylisé du code source de Docs Studio
demo: https://docs-studio.example.com
featured: true
---

## Contexte

L'équipe d'une bibliothèque JavaScript open source maintenait sa documentation dans un wiki difficile à parcourir et mal référencé. Objectif : un site rapide, versionné, et éditable par les contributeurs via des Pull Requests.

## Ce que j'ai réalisé

- Migration de 120 pages du wiki vers des fichiers MDX organisés en Content Collections.
- Recherche plein texte côté client avec Pagefind, sans serveur ni service tiers.
- Une version de la documentation par version majeure de la bibliothèque.
- Déploiement automatique à chaque fusion sur la branche principale.

## Résultats

Le site est entièrement statique : aucune page n'envoie de JavaScript, à l'exception du champ de recherche. Les contributeurs modifient la documentation dans le même dépôt que le code.
