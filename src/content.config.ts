import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Études de cas : du Markdown pur, avec des métadonnées strictement typées.
// image() vérifie que le fichier existe et l'importe : il passe dans le pipeline d'optimisation d'astro:assets.
const projets = defineCollection({
  loader: glob({ base: './src/content/projets', pattern: '**/*.md' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string().max(160),
      year: z.number().int(),
      role: z.string(),
      stack: z.array(z.string()).min(1),
      cover: image(),
      coverAlt: z.string(),
      demo: z.url().optional(),
      featured: z.boolean().default(false),
    }),
});

// Articles techniques : .md pour le texte structuré, .mdx quand on a besoin de composants.
const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) =>
    z.object({
      title: z.string().max(70),
      description: z.string().max(160),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      cover: image(),
      coverAlt: z.string(),
      tags: z.array(z.string()).default([]),
    }),
});

// Questions fréquentes : un seul fichier JSON, une entrée par question (loader file()).
const faq = defineCollection({
  loader: file('./src/content/faq.json'),
  schema: z.object({
    question: z.string().endsWith('?'),
    answer: z.string(),
  }),
});

export const collections = { projets, blog, faq };
