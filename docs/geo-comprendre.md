# Vidéo 11 — Comprendre le GEO : comment les IA génératives sourcent l'information

## Du moteur de recherche au moteur de réponse

| Moteur de recherche classique (SEO)          | Moteur de réponse génératif (GEO)                              |
| -------------------------------------------- | -------------------------------------------------------------- |
| Renvoie une **liste de pages** classées       | Rédige **une réponse** et cite quelques sources                |
| L'unité est la **page**                      | L'unité est le **passage** (un paragraphe, une liste, une ligne de tableau) |
| Objectif : être cliqué                       | Objectif : être **repris et cité**                             |
| Signal principal : pertinence + autorité     | Pertinence + autorité + **facilité d'extraction** du passage   |

Exemples : ChatGPT (recherche), Perplexity, Google AI Overviews / AI Mode, Microsoft Copilot.

## Le fonctionnement, à haut niveau

La plupart des moteurs génératifs connectés au web suivent un schéma de **génération augmentée par la récupération** (RAG) :

1. **Exploration et indexation** : des robots parcourent le web (index propre ou index d'un moteur classique).
2. **Récupération** : pour une question, le système sélectionne des pages candidates, puis les découpe en passages.
3. **Sélection** : il retient les passages qui répondent le plus directement à la question.
4. **Génération** : le modèle de langage rédige une synthèse à partir de ces passages.
5. **Citation** : les sources utilisées sont liées dans la réponse.

Conséquence directe : **un passage qui répond clairement et seul à une question a plus de chances d'être retenu** qu'une réponse diluée dans un long récit.

## Ce qui rend un contenu « citable »

- **Accessible sans JavaScript** : de nombreux robots d'IA ne l'exécutent pas. Un site Astro rendu en HTML statique est lisible d'emblée — c'est le lien direct entre l'architecture d'Astro et le GEO.
- **Une réponse directe en tête** : la réponse d'abord, le contexte ensuite (structure en « pyramide inversée »).
- **Une structure explicite** : un seul `h1`, des `h2` / `h3` sans saut de niveau, des titres formulés comme les questions des utilisateurs.
- **Des passages autonomes** : chaque section se comprend sans avoir lu les précédentes.
- **Des faits vérifiables** : chiffres, dates, sources. Dans l'étude fondatrice du GEO (Aggarwal et al., 2023), ajouter des citations, des statistiques et des sources a nettement amélioré la visibilité des contenus dans les réponses générées du banc d'essai.
- **Des signaux de confiance** : auteur identifié, date de publication et de mise à jour, données structurées cohérentes avec le texte.
- **Un plan du site lisible par les machines** : `sitemap.xml`, et de plus en plus un fichier `llms.txt` (vidéo 12).

## Contrôler l'accès des robots d'IA

Les robots d'IA s'identifient par leur *user-agent* et respectent `robots.txt` : par exemple `GPTBot` et `OAI-SearchBot` (OpenAI), `ClaudeBot` (Anthropic), `PerplexityBot`, ou le jeton `Google-Extended` (utilisation des contenus par les modèles Gemini de Google, sans effet sur l'indexation dans la recherche Google). Le portfolio les autorise tous : son objectif est justement d'être cité.

## Mesurer avant d'optimiser

Le script `npm run audit:geo` analyse le HTML généré et vérifie ces critères page par page. Résultat sur l'état actuel du site : [`docs/audit-geo.md`](audit-geo.md).

## Référence

- P. Aggarwal *et al.*, « GEO: Generative Engine Optimization », 2023 — arXiv:2311.09735.
