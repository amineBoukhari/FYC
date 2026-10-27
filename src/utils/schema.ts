// Générateurs de données structurées Schema.org (format JSON-LD).
// Les entités partagées (la personne, le site) ont un @id stable : les autres schémas y font référence.
import type { CollectionEntry } from 'astro:content';
import { SITE } from '../data/site';

type Schema = Record<string, unknown>;

const abs = (path: string, site: URL) => new URL(path, site).href;
const personId = (site: URL) => abs('/#person', site);
const websiteId = (site: URL) => abs('/#website', site);

export function personSchema(site: URL): Schema {
  return {
    '@type': 'Person',
    '@id': personId(site),
    name: SITE.author,
    jobTitle: SITE.role,
    url: abs('/', site),
    email: `mailto:${SITE.email}`,
    address: { '@type': 'PostalAddress', addressLocality: SITE.city, addressCountry: 'FR' },
    knowsAbout: ['Astro', 'TypeScript', 'Performance web', 'Accessibilité numérique', 'SEO technique'],
    sameAs: Object.values(SITE.socials),
  };
}

export function websiteSchema(site: URL): Schema {
  return {
    '@type': 'WebSite',
    '@id': websiteId(site),
    url: abs('/', site),
    name: SITE.author,
    description: SITE.description,
    inLanguage: 'fr-FR',
    publisher: { '@id': personId(site) },
  };
}

export function profilePageSchema(site: URL): Schema {
  return {
    '@type': 'ProfilePage',
    url: abs('/a-propos/', site),
    isPartOf: { '@id': websiteId(site) },
    mainEntity: personSchema(site),
  };
}

export function breadcrumbSchema(items: { label: string; href: string }[], site: URL): Schema {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: abs(item.href, site),
    })),
  };
}

export function blogPostingSchema(post: CollectionEntry<'blog'>, imageUrl: string, site: URL): Schema {
  const url = abs(`/blog/${post.id}/`, site);
  return {
    '@type': 'BlogPosting',
    '@id': `${url}#article`,
    headline: post.data.title,
    description: post.data.description,
    image: imageUrl,
    datePublished: post.data.pubDate.toISOString(),
    dateModified: (post.data.updatedDate ?? post.data.pubDate).toISOString(),
    author: { '@type': 'Person', '@id': personId(site), name: SITE.author, url: abs('/a-propos/', site) },
    publisher: { '@id': personId(site) },
    mainEntityOfPage: url,
    isPartOf: { '@id': websiteId(site) },
    inLanguage: 'fr-FR',
    keywords: post.data.tags.join(', '),
  };
}

export function projectSchema(projet: CollectionEntry<'projets'>, imageUrl: string, site: URL): Schema {
  return {
    '@type': 'CreativeWork',
    name: projet.data.title,
    description: projet.data.summary,
    url: abs(`/projets/${projet.id}/`, site),
    image: imageUrl,
    dateCreated: String(projet.data.year),
    creator: { '@id': personId(site) },
    keywords: projet.data.stack.join(', '),
    ...(projet.data.demo && { sameAs: projet.data.demo }),
    inLanguage: 'fr-FR',
  };
}

export function faqSchema(items: { question: string; answer: string }[]): Schema {
  return {
    '@type': 'FAQPage',
    mainEntity: items.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  };
}

// Regroupe plusieurs entités dans un seul bloc JSON-LD.
export const graph = (...nodes: Schema[]): Schema => ({ '@context': 'https://schema.org', '@graph': nodes });
