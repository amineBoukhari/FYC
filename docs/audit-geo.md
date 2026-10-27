# Grille d'audit GEO

Audit produit par `npm run build && npm run audit:geo` (script : `scripts/audit-geo.mjs`).

## Critères

| Code          | Critère                                         | Bloquant | Pourquoi                                                              |
| ------------- | ----------------------------------------------- | -------- | --------------------------------------------------------------------- |
| `h1`          | Un seul `h1`                                    | Oui      | Le sujet de la page doit être unique et explicite                      |
| `hierarchie`  | Hiérarchie des titres sans saut                 | Oui      | Les passages sont découpés et situés grâce aux titres                  |
| `intro`       | Réponse directe en tête (12 à 60 mots)          | Oui      | Le premier paragraphe est le passage le plus souvent extrait           |
| `description` | Meta description de 50 à 160 caractères          | Oui      | Résumé de la page, souvent repris tel quel                             |
| `jsonld`      | Données structurées JSON-LD valides             | Oui      | Décrit explicitement les entités (auteur, article, FAQ…)               |
| `date`        | Date en `<time datetime>` sur les articles      | Non      | Signal de fraîcheur lisible par les machines                           |
| `questions`   | Titres formulés comme des questions             | Non      | Correspondance directe avec les questions posées aux assistants        |
| `structure`   | Listes ou tableaux dans le contenu              | Non      | Formats faciles à extraire et à reformuler                             |
| `llms.txt`    | Fichier `llms.txt` à la racine (critère global) | Oui      | Index des ressources clés, destiné aux agents IA                       |

## État avant optimisation — tag `video-11`

Score : **76 / 97** critères respectés — **7 échecs bloquants**.

| Page                            | h1 | hiérarchie | intro | description | jsonld | date | questions | structure |
| ------------------------------- | -- | ---------- | ----- | ----------- | ------ | ---- | --------- | --------- |
| `/`                             | ✅ | ✅         | ❌    | ✅          | ✅     | ✅   | ⚠️        | ✅        |
| `/a-propos/`                    | ✅ | ✅         | ✅    | ✅          | ✅     | ✅   | ⚠️        | ✅        |
| `/blog/`                        | ✅ | ✅         | ❌    | ✅          | ❌     | ✅   | ✅        | ⚠️        |
| `/blog/optimiser-le-lcp/`       | ✅ | ✅         | ✅    | ✅          | ✅     | ✅   | ⚠️        | ✅        |
| `/blog/reflexes-accessibilite/` | ✅ | ✅         | ✅    | ✅          | ✅     | ✅   | ⚠️        | ⚠️        |
| `/blog/ssg-ssr-csr/`            | ✅ | ❌         | ❌    | ✅          | ✅     | ✅   | ✅        | ⚠️        |
| `/faq/`                         | ✅ | ✅         | ✅    | ✅          | ✅     | ✅   | ✅        | ⚠️        |
| `/projets/`                     | ✅ | ✅         | ✅    | ✅          | ❌     | ✅   | ⚠️        | ⚠️        |
| `/projets/*` (4 études de cas)  | ✅ | ✅         | ✅    | ✅          | ✅     | ✅   | ⚠️        | ✅        |
| **`llms.txt`**                  | ❌ absent |  |  |  |  |  |  |  |

✅ respecté · ❌ échec bloquant · ⚠️ à revoir (non bloquant)

## Analyse et priorités pour la vidéo 12

1. **`/blog/ssg-ssr-csr/`** — le cas le plus parlant. L'introduction raconte une anecdote sur 93 mots ; la réponse à la question du titre n'arrive qu'au **dernier** paragraphe. Les sections sont en `h3` directement sous le `h1`. → Réponse directe en tête, `h2` en questions, tableau comparatif, FAQ en fin d'article.
2. **Accueil `/`** — l'introduction (« Alex Morel, développement web front-end & performance à Lyon. ») ne dit ni ce que fait la personne, ni pour qui. → Une phrase d'introduction autonome qui répond à « Qui est Alex Morel, et pour quels projets le contacter ? » sans dépendre du titre.
3. **`/blog/` et `/projets/`** — pas de données structurées et introduction trop courte sur `/blog/`. → `CollectionPage` + `ItemList`, introduction plus informative.
4. **`llms.txt`** absent. → Le générer automatiquement à partir des collections.
5. Non bloquant : les articles peuvent gagner des titres en questions et une FAQ finale.

## État après optimisation — tag `video-12`

Score : **85 / 97** critères respectés — **0 échec bloquant** (avant : 76 / 97, 7 échecs bloquants).

| Page                            | h1 | hiérarchie | intro | description | jsonld | date | questions | structure |
| ------------------------------- | -- | ---------- | ----- | ----------- | ------ | ---- | --------- | --------- |
| `/`                             | ✅ | ✅         | ✅ ← ❌ | ✅        | ✅     | ✅   | ✅ ← ⚠️   | ✅        |
| `/a-propos/`                    | ✅ | ✅         | ✅    | ✅          | ✅     | ✅   | ⚠️        | ✅        |
| `/blog/`                        | ✅ | ✅         | ✅ ← ❌ | ✅        | ✅ ← ❌ | ✅  | ✅        | ⚠️        |
| `/blog/optimiser-le-lcp/`       | ✅ | ✅         | ✅    | ✅          | ✅     | ✅   | ⚠️        | ✅        |
| `/blog/reflexes-accessibilite/` | ✅ | ✅         | ✅    | ✅          | ✅     | ✅   | ⚠️        | ⚠️        |
| `/blog/ssg-ssr-csr/`            | ✅ | ✅ ← ❌    | ✅ ← ❌ | ✅        | ✅     | ✅   | ✅        | ✅ ← ⚠️   |
| `/faq/`                         | ✅ | ✅         | ✅    | ✅          | ✅     | ✅   | ✅        | ⚠️        |
| `/projets/`                     | ✅ | ✅         | ✅    | ✅          | ✅ ← ❌ | ✅  | ⚠️        | ⚠️        |
| `/projets/*` (4 études de cas)  | ✅ | ✅         | ✅    | ✅          | ✅     | ✅   | ⚠️        | ✅        |
| **`llms.txt`**                  | ✅ ← ❌ 12 liens |  |  |  |  |  |  |  |

### Corrections apportées

| Problème                                              | Correction                                                                                      | Justification GEO |
| ----------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ----------------- |
| Article SSG : anecdote de 93 mots avant la réponse    | Paragraphe **« En bref »** de 45 mots en tête, l'anecdote déplacée en dernière section          | Le premier passage répond seul à la question du titre |
| Article SSG : `h3` directement sous le `h1`           | Sections en `h2`, formulées comme des **questions** (« Qu'est-ce que le rendu serveur ? »)       | Chaque section devient un passage autonome, aligné sur les requêtes |
| Article SSG : comparaison diluée dans la prose        | **Tableau comparatif** SSG / SSR / CSR                                                          | Format directement extractible et reformulable |
| Article SSG : pas de questions annexes                | **FAQ** en fin d'article (champ `faq` du frontmatter), décrite en `FAQPage` dans le JSON-LD      | Réponses courtes aux questions voisines |
| Article SSG : pas de signal de fraîcheur              | `updatedDate` affichée (« mis à jour le … ») et reprise en `dateModified`                       | Les moteurs privilégient les contenus récents et datés |
| Accueil : « Alex Morel, développement web… à Lyon. »  | Introduction autonome `SITE.intro` : qui, quoi, où, avec quoi, disponibilité                    | Citable sans le contexte du titre |
| `/blog/`, `/projets/` sans données structurées        | `CollectionPage` + `ItemList`                                                                    | Décrit la liste des contenus de la section |
| Pas d'index pour les agents IA                        | **`/llms.txt`** généré à partir des collections                                                 | Index Markdown des ressources clés, toujours à jour |

### Pistes restantes (non bloquantes)

- Formuler davantage de titres en questions sur `/a-propos/`, les études de cas et les deux autres articles.
- Ajouter une FAQ aux articles `optimiser-le-lcp` et `reflexes-accessibilite`.
