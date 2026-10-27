# Portfolio fil rouge — « Astro & l'optimisation SEO / GEO »

Projet fil rouge du cours FYC (ESGI, Mastère). On construit, vidéo après vidéo, le **portfolio d'un développeur** (Alex Morel, personnage fictif) : présentation, projets, articles techniques et contact.

**Chaque commit correspond à une vidéo du cours** et porte un tag `video-XX`. Pour retrouver l'état du projet à la fin d'une vidéo :

```bash
git checkout video-04
```

> Pour en faire votre propre portfolio, modifiez `src/data/site.ts` (nom, e-mail, réseaux).

## Démarrer en local

Pré-requis : Node.js 22.12 ou plus récent.

```bash
npm install
npm run dev        # http://localhost:4321
```

| Commande          | Rôle                                               |
| ----------------- | -------------------------------------------------- |
| `npm run dev`     | Serveur de développement avec rechargement à chaud |
| `npm run build`   | Génère le site de production dans `dist/`          |
| `npm run preview` | Sert localement le build de production             |

## Arborescence

```text
├── public/              # Fichiers servis tels quels (favicon, images brutes)
├── src/
│   ├── components/      # Composants .astro réutilisables
│   ├── data/            # Données du site (infos personnelles, projets)
│   ├── layouts/         # Gabarits de page (BaseLayout)
│   ├── pages/           # Routage par fichiers : 1 fichier = 1 URL
│   └── styles/          # CSS global
├── astro.config.mjs     # Configuration d'Astro
└── package.json
```

## Progression

| Tag        | Vidéo                                | Ce que le commit ajoute                                                       |
| ---------- | ------------------------------------ | ----------------------------------------------------------------------------- |
| `video-04` | Prise en main : premier projet Astro | Projet initial, layout, composants, 4 pages (accueil, projets, à propos, contact) |

### Vidéo 04 — Prise en main

- **Routage par fichiers** : `src/pages/a-propos.astro` devient `/a-propos`.
- **Composants** : un fichier `.astro` = un *frontmatter* (code exécuté au build, entre `---`) + un template HTML + un `<style>` automatiquement limité au composant.
- **Composition** : `Card` est réutilisé sur l'accueil et la page projets ; `BaseLayout` factorise `<html>`, `<head>`, l'en-tête et le pied de page, chaque page y injecte son contenu via `<slot />`.
- **Balises meta de base** : chaque page passe un `title` et une `description` au layout.
- **Zéro JavaScript par défaut** : lancez `npm run build` puis inspectez `dist/` : aucun fichier `.js` n'est envoyé au navigateur.

> Volontairement, l'image du *hero* est un JPEG brut de 1,2 Mo servi depuis `public/`, sans dimensions. On le corrigera à la vidéo 07 (Core Web Vitals).
