import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE } from '../data/site';

// llms.txt (proposition de standard, https://llmstxt.org) : un index Markdown des ressources clés
// du site, destiné aux agents IA. Généré au build à partir des collections : il ne se périme jamais.
export const GET: APIRoute = async ({ site }) => {
  const url = (path: string) => new URL(path, site).href;
  const link = (title: string, path: string, description: string) => `- [${title}](${url(path)}): ${description}`;

  const projets = (await getCollection('projets')).sort((a, b) => b.data.year - a.data.year);
  const posts = (await getCollection('blog')).sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  const body = [
    `# ${SITE.author} — ${SITE.role}`,
    '',
    `> ${SITE.intro}`,
    '',
    'Ce site est un portfolio : études de cas de projets web, articles techniques (rendu, performance, accessibilité, référencement) et page de contact. Toutes les pages sont servies en HTML, sans JavaScript nécessaire à la lecture.',
    '',
    '## Pages principales',
    '',
    link('Accueil', '/', 'Présentation, compétences, projets à la une et derniers articles.'),
    link('À propos', '/a-propos/', 'Parcours, méthode de travail et outils.'),
    link('Questions fréquentes', '/faq/', 'Disponibilité, technologies, délais, référencement, reprise de site existant.'),
    link('Contact', '/contact/', 'Formulaire de contact et coordonnées.'),
    '',
    '## Projets',
    '',
    ...projets.map(({ id, data }) => link(data.title, `/projets/${id}/`, `${data.summary} (${data.stack.join(', ')})`)),
    '',
    '## Articles',
    '',
    ...posts.map(({ id, data }) => link(data.title, `/blog/${id}/`, data.description)),
    '',
    '## Optional',
    '',
    link('Plan du site', '/sitemap-index.xml', 'Liste complète des URL du site.'),
    '',
  ].join('\n');

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
