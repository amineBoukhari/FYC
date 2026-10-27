---
title: SSG, SSR ou CSR, quel mode de rendu choisir ?
description: Génération statique, rendu serveur ou rendu client, retour d'expérience sur le choix du mode de rendu d'un site web.
pubDate: 2026-09-10
cover: /images/blog/ssg-ssr-csr.jpg
coverAlt: Aperçu stylisé de code illustrant les modes de rendu
tags: [astro, rendu, performance]
---

Quand j'ai commencé le développement web, je ne me posais même pas la question. On créait une application React, on la déployait, et tout semblait fonctionner. Puis un jour, un client m'a demandé pourquoi son site n'apparaissait pas correctement dans Google, alors que la page s'affichait parfaitement dans son navigateur. C'est là que j'ai découvert que la façon dont une page est construite — sur le serveur ou dans le navigateur — a des conséquences très concrètes. Depuis, c'est l'une des premières décisions que je prends sur un projet. Voici comment je raisonne.

### Le rendu côté client (CSR)

Dans une application rendue côté client, le serveur envoie une page HTML quasiment vide et un gros fichier JavaScript. C'est le navigateur qui construit l'interface. C'est très pratique pour des applications riches, mais le premier affichage est plus lent, et les robots qui n'exécutent pas (ou mal) le JavaScript voient une page vide.

### Le rendu serveur (SSR)

Avec le rendu serveur, la page HTML est construite à chaque requête, sur le serveur. Le navigateur reçoit directement le contenu. C'est idéal pour des données qui changent souvent ou qui dépendent de l'utilisateur, mais cela demande un serveur et du temps de calcul à chaque visite.

### La génération statique (SSG)

Avec la génération statique, toutes les pages sont construites une seule fois, au moment du build. Le serveur se contente d'envoyer des fichiers HTML déjà prêts. C'est le plus rapide et le moins coûteux, mais une modification du contenu nécessite un nouveau build.

### Et Astro dans tout ça ?

Astro génère tout en statique par défaut, et permet de passer une page en rendu serveur avec une seule ligne : `export const prerender = false`. On peut ensuite ajouter de l'interactivité côté client composant par composant, grâce aux îlots.

### Alors, lequel choisir ?

En résumé, pour un contenu qui change rarement (portfolio, blog, documentation), je choisis le SSG. Pour un contenu personnalisé ou très frais (tableau de bord, stock, formulaire), le SSR. Et je réserve le CSR aux applications privées où le référencement n'a pas d'importance.
