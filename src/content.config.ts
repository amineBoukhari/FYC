import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Études de cas : du Markdown pur, avec des métadonnées strictement typées.
const projets = defineCollection({
  loader: glob({ base: './src/content/projets', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    summary: z.string().max(160),
    year: z.number().int(),
    role: z.string(),
    stack: z.array(z.string()).min(1),
    cover: z.string(),
    coverAlt: z.string(),
    demo: z.url().optional(),
    featured: z.boolean().default(false),
  }),
});

// Articles techniques : .md pour le texte structuré, .mdx quand on a besoin de composants.
const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string().max(70),
    description: z.string().max(160),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    cover: z.string(),
    coverAlt: z.string(),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { projets, blog };
