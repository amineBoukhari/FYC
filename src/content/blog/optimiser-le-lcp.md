---
title: Comment j'ai divisé par trois le LCP d'une page d'accueil
description: Image trop lourde, mauvais chargement, rendu bloquant. Retour sur l'optimisation du Largest Contentful Paint d'un site vitrine.
pubDate: 2026-09-24
cover: /images/blog/optimiser-le-lcp.jpg
coverAlt: Aperçu stylisé de code illustrant l'optimisation du LCP
tags: [performance, core-web-vitals, images]
---

Le **Largest Contentful Paint** (LCP) mesure le temps nécessaire pour afficher le plus grand élément visible de la page, souvent l'image principale ou le titre. Google le considère bon en dessous de **2,5 secondes**. Sur ce projet, il était à 4,2 secondes sur mobile.

## Le diagnostic

Lighthouse et l'onglet Performance des DevTools ont pointé trois problèmes :

1. L'image du bandeau pesait 1,2 Mo, en JPEG, sans version adaptée au mobile.
2. Elle était chargée en `loading="lazy"`, ce qui retardait justement l'élément le plus important.
3. Une police web bloquait l'affichage du titre.

## Les corrections

Avec Astro, le composant `<Image />` génère des formats modernes et plusieurs tailles :

```astro
---
import { Image } from 'astro:assets';
import hero from '../assets/hero.jpg';
---

<Image src={hero} alt="Bandeau d'accueil" priority layout="full-width" />
```

L'attribut `priority` désactive le chargement différé et ajoute `fetchpriority="high"` : le navigateur télécharge l'image en premier.

Pour la police, `font-display: swap` affiche immédiatement le texte avec une police système, puis bascule vers la police web dès qu'elle est prête.

## Le résultat

Le LCP est passé de 4,2 s à 1,4 s sur mobile. Aucune refonte n'a été nécessaire : uniquement des choix de chargement plus judicieux.
