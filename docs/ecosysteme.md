# Vidéo 13 — Écosystème et intégrations Astro

## L'îlot du portfolio : `ProjectFilter`

`src/components/ProjectFilter.tsx` est un composant **Preact** chargé uniquement sur `/projets/` :

```astro
<ProjectFilter client:idle technologies={technologies} target=".project-item" />
```

- **Amélioration progressive** : les cartes de projets restent du HTML statique généré par Astro, avec leurs images optimisées. L'îlot ne rend que la barre de filtres et masque les cartes non concernées. Sans JavaScript (ou pour un robot), tous les projets sont visibles et indexables.
- **Accessibilité** : boutons natifs avec `aria-pressed`, nombre de résultats annoncé par une zone `aria-live`.

### Poids mesuré (build de production)

| Fichier                          | Taille | Gzip   |
| -------------------------------- | ------ | ------ |
| `preact` (runtime)               | 10,9 Ko | 4,7 Ko |
| `signals` (ajouté par l'intégration) | 7,8 Ko | 3,0 Ko |
| `client` (hydratation Astro)     | 3,0 Ko | 1,5 Ko |
| `hooks`                          | 2,5 Ko | 1,2 Ko |
| `ProjectFilter` (notre code)     | 1,2 Ko | 0,7 Ko |
| **Total, sur `/projets/` uniquement** | **25,4 Ko** | **≈ 11 Ko** |

Les **11 autres pages n'envoient toujours aucun JavaScript**.

Lighthouse mobile sur `/projets/` : performance de 95 à 98 selon les passages, **TBT de 100 à 230 ms** (contre ≈ 0 ms sur les pages sans îlot). C'est le coût, mesurable, du téléchargement et de l'hydratation de l'îlot sur un mobile lent simulé : même 11 Ko de JavaScript ne sont pas gratuits. D'où la règle : un îlot seulement là où l'interaction apporte vraiment quelque chose.

## Choisir sa directive `client:*`

| Directive        | Hydratation                                   | Cas d'usage                                         |
| ---------------- | --------------------------------------------- | --------------------------------------------------- |
| *(aucune)*       | Jamais : HTML statique, 0 octet de JS          | Par défaut — la grande majorité des composants      |
| `client:load`    | Immédiatement au chargement                    | Interaction indispensable dès l'affichage (rare)    |
| `client:idle`    | Quand le navigateur est inactif               | Interaction utile mais non urgente — **notre filtre** |
| `client:visible` | Quand le composant entre dans l'écran         | Composant sous la ligne de flottaison (carrousel, commentaires) |
| `client:media`   | Quand une media query est vraie               | Interaction propre au mobile ou au bureau           |
| `client:only`    | Uniquement côté client, aucun rendu serveur   | Composant dépendant de `window` — à éviter pour le contenu à indexer |

## Panorama des intégrations

| Besoin                      | Intégration                                          | Impact sur la légèreté du site                                      |
| --------------------------- | ---------------------------------------------------- | ------------------------------------------------------------------- |
| Composants interactifs      | `@astrojs/preact`, `react`, `vue`, `svelte`, `solid-js` | Runtime chargé **seulement** sur les pages qui ont un îlot. Preact et Svelte sont parmi les plus légers ; React pèse nettement plus lourd. |
| Contenu enrichi             | `@astrojs/mdx`                                       | Aucun JS ajouté si les composants MDX sont statiques                |
| Référencement               | `@astrojs/sitemap`                                   | Aucun : fichier généré au build                                     |
| Styles utilitaires          | Tailwind CSS 4 (plugin Vite `@tailwindcss/vite`)     | CSS seulement ; les classes non utilisées sont éliminées au build   |
| CMS headless                | Storyblok, Contentful, Sanity, Strapi… via un *loader* de Content Collections | Aucun si les pages restent en SSG : le contenu est récupéré au build |
| Recherche                   | Pagefind                                             | Index statique + petit script chargé à la demande                   |
| Scripts tiers (analytics…)  | Partytown                                            | Déporte les scripts tiers dans un Web Worker                        |
| Déploiement                 | `@astrojs/cloudflare` (ce projet), `node`, `netlify`, `vercel` | Requis seulement pour les pages SSR                       |

> Toute intégration s'ajoute avec `npx astro add <nom>` : installation + configuration automatiques.

**Règle d'or** : chaque intégration doit justifier son poids. Avant d'ajouter un framework UI pour un bouton, se demander si un `<details>`, un `<dialog>` ou un formulaire HTML ne suffit pas.
