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
