---
title: "SSG, SSR ou CSR : quel mode de rendu choisir ?"
description: Génération statique, rendu serveur ou rendu client, comment choisir le mode de rendu d'un site web selon son contenu et ses enjeux de référencement.
pubDate: 2026-09-10
updatedDate: 2026-10-27
cover: ../../assets/blog/ssg-ssr-csr.jpg
coverAlt: Aperçu stylisé de code illustrant les modes de rendu
tags: [astro, rendu, performance]
faq:
  - question: Le SSG convient-il à un site dont le contenu change souvent ?
    answer: Oui, tant que les changements restent ponctuels. Chaque modification déclenche un nouveau build, généralement automatisé et rapide. Au-delà de plusieurs mises à jour par heure, ou pour un contenu propre à chaque visiteur, le SSR devient plus adapté.
  - question: Peut-on mélanger SSG et SSR dans un même site ?
    answer: "Oui. Astro génère tout en statique par défaut et passe une page en rendu serveur avec une seule ligne : export const prerender = false. Ce portfolio le fait pour sa page de contact."
  - question: Le CSR est-il mauvais pour le référencement ?
    answer: Pas forcément pour Google, qui exécute le JavaScript, mais avec un délai et sans garantie. En revanche, de nombreux robots d'IA n'exécutent pas le JavaScript, et une page rendue uniquement côté client risque de leur paraître vide.
---

**En bref :** choisissez la génération statique (SSG) pour un contenu qui change rarement, comme un portfolio, un blog ou une documentation ; le rendu serveur (SSR) pour un contenu personnalisé ou très frais ; et réservez le rendu client (CSR) aux applications privées où le référencement ne compte pas.

## Quelle est la différence entre SSG, SSR et CSR ?

| Mode | Où la page est construite | Quand | Idéal pour | Référencement (SEO / GEO) |
| ---- | ------------------------- | ----- | ---------- | ------------------------- |
| **SSG** — génération statique | Sur la machine de build | Une seule fois, au build | Portfolio, blog, documentation, site vitrine | HTML complet et immédiat : excellent |
| **SSR** — rendu serveur | Sur le serveur | À chaque requête | Contenu personnalisé, stock, formulaires | HTML complet, dépend du temps de réponse du serveur |
| **CSR** — rendu client | Dans le navigateur | Après téléchargement du JavaScript | Applications privées, tableaux de bord | HTML initial quasi vide : risqué pour l'indexation et les robots d'IA |

## Qu'est-ce que la génération statique (SSG) ?

Avec la génération statique, toutes les pages sont construites une seule fois, au moment du build. Le serveur se contente d'envoyer des fichiers HTML déjà prêts. C'est le mode le plus rapide et le moins coûteux ; en contrepartie, une modification du contenu nécessite un nouveau build.

## Qu'est-ce que le rendu serveur (SSR) ?

Avec le rendu serveur, la page HTML est construite à chaque requête. Le navigateur reçoit directement le contenu. C'est idéal pour des données qui changent souvent ou qui dépendent de l'utilisateur, mais cela demande un serveur et du temps de calcul à chaque visite.

## Qu'est-ce que le rendu côté client (CSR) ?

Dans une application rendue côté client, le serveur envoie une page HTML quasiment vide et un fichier JavaScript. C'est le navigateur qui construit l'interface. C'est pratique pour des applications riches, mais le premier affichage est plus lent, et les robots qui n'exécutent pas le JavaScript voient une page vide.

## Comment Astro combine-t-il ces modes ?

Astro génère tout en statique par défaut. Une page passe en rendu serveur avec une seule ligne dans son frontmatter :

```astro
---
export const prerender = false;
---
```

L'interactivité côté client s'ajoute ensuite composant par composant, grâce aux îlots (*islands*) : le reste de la page reste du HTML statique.

## Pourquoi ce choix compte-t-il pour le référencement ?

Un client m'a un jour demandé pourquoi son application React apparaissait mal dans Google alors qu'elle s'affichait parfaitement dans son navigateur. La raison : le contenu n'existait qu'après l'exécution du JavaScript. Les moteurs de recherche, et plus encore les moteurs de réponse génératifs, privilégient un HTML lisible dès la première réponse du serveur. C'est exactement ce que produisent le SSG et le SSR.
