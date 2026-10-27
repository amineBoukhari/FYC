#!/usr/bin/env node
// Audit GEO du site généré : analyse le HTML de dist/client/ et vérifie, page par page,
// les critères qui rendent un contenu facile à extraire et à citer par un moteur génératif.
//
// Usage : npm run build && npm run audit:geo [-- --json rapport.json] [-- --strict]
//   --json <fichier>  écrit aussi le résultat détaillé en JSON
//   --strict          code de sortie 1 si un critère bloquant échoue (pour la CI)
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { parse } from 'node-html-parser';

const DIST = path.resolve(process.env.AUDIT_DIST ?? 'dist/client');
const args = process.argv.slice(2);
const jsonOut = args.includes('--json') ? args[args.indexOf('--json') + 1] : null;
const strict = args.includes('--strict');

// Réponse directe : le premier paragraphe doit tenir en quelques phrases.
const MAX_INTRO_WORDS = 60;
const MIN_INTRO_WORDS = 12;

if (!existsSync(DIST)) {
  console.error(`Dossier ${DIST} introuvable : lancez d'abord « npm run build ».`);
  process.exit(2);
}

const htmlFiles = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) return htmlFiles(full);
    return name === 'index.html' ? [full] : [];
  });

const toRoute = (file) => '/' + path.relative(DIST, path.dirname(file)).split(path.sep).join('/').replace(/^\.?$/, '') + (path.dirname(file) === DIST ? '' : '/');
const words = (text) => text.trim().split(/\s+/).filter(Boolean).length;
const clean = (text) => text.replace(/\s+/g, ' ').trim();

function auditPage(file) {
  const root = parse(readFileSync(file, 'utf8'));
  const main = root.querySelector('main');
  const checks = [];
  const add = (id, label, ok, detail, blocking = true) => checks.push({ id, label, ok, detail, blocking });

  // 1. Un seul h1, qui annonce le sujet de la page.
  const h1s = main?.querySelectorAll('h1') ?? [];
  add('h1', 'Un seul h1', h1s.length === 1, `${h1s.length} h1`);

  // 2. Hiérarchie des titres sans saut de niveau (h1 → h2 → h3).
  const headings = main?.querySelectorAll('h1, h2, h3, h4, h5, h6') ?? [];
  const jumps = [];
  let previous = 0;
  for (const h of headings) {
    const level = Number(h.tagName[1]);
    if (previous && level > previous + 1) jumps.push(`h${previous} → h${level} (« ${clean(h.text).slice(0, 40)} »)`);
    previous = level;
  }
  add('hierarchie', 'Hiérarchie des titres', jumps.length === 0, jumps.length ? jumps.join(' ; ') : `${headings.length} titres, aucun saut`);

  // 3. Réponse directe en tête : le premier paragraphe de contenu est court et autonome.
  const scope = main?.querySelector('.prose') ?? main;
  const firstP = scope?.querySelectorAll('p').find((p) => !p.closest('nav, aside, header .meta, .tags, .date') && words(p.text) > 0);
  const introWords = firstP ? words(firstP.text) : 0;
  add(
    'intro',
    `Réponse directe en tête (${MIN_INTRO_WORDS}–${MAX_INTRO_WORDS} mots)`,
    introWords >= MIN_INTRO_WORDS && introWords <= MAX_INTRO_WORDS,
    firstP ? `${introWords} mots : « ${clean(firstP.text).slice(0, 70)}… »` : 'aucun paragraphe',
  );

  // 4. Description courte (meta) présente : souvent reprise comme résumé.
  const description = root.querySelector('meta[name="description"]')?.getAttribute('content') ?? '';
  add('description', 'Meta description (50–160 car.)', description.length >= 50 && description.length <= 160, `${description.length} caractères`);

  // 5. Données structurées présentes et valides (JSON parsable).
  const types = [];
  let jsonError = false;
  for (const script of root.querySelectorAll('script[type="application/ld+json"]')) {
    try {
      const data = JSON.parse(script.text);
      for (const node of data['@graph'] ?? [data]) types.push(node['@type']);
    } catch {
      jsonError = true;
    }
  }
  add('jsonld', 'Données structurées JSON-LD', types.length > 0 && !jsonError, jsonError ? 'JSON invalide' : types.join(', ') || 'aucune');

  // 6. Fraîcheur : une date lisible par les machines (<time datetime>) sur les contenus éditoriaux.
  const isArticle = types.includes('BlogPosting');
  const hasTime = !!main?.querySelector('time[datetime]');
  add('date', 'Date de publication (<time datetime>)', !isArticle || hasTime, isArticle ? (hasTime ? 'présente' : 'absente') : 'non concerné', false);

  // 7. Contenu en questions / réponses : titres formulés comme des questions.
  const questions = headings.filter((h) => clean(h.text).endsWith('?')).length;
  add('questions', 'Titres sous forme de questions', questions > 0, `${questions} titre(s) en question`, false);

  // 8. Éléments facilement extractibles : listes et tableaux.
  const lists = main?.querySelectorAll('ul:not(.tags), ol, table').filter((el) => !el.closest('nav, aside')).length ?? 0;
  add('structure', 'Listes ou tableaux dans le contenu', lists > 0, `${lists} élément(s)`, false);

  return { route: toRoute(file), title: clean(root.querySelector('title')?.text ?? ''), checks };
}

const pages = htmlFiles(DIST)
  .filter((file) => !file.includes(`${path.sep}404${path.sep}`))
  .map(auditPage)
  .sort((a, b) => a.route.localeCompare(b.route));

// Critère global : fichier llms.txt à la racine du site.
const llmsPath = path.join(DIST, 'llms.txt');
const llms = existsSync(llmsPath) ? readFileSync(llmsPath, 'utf8') : null;
const site = {
  llms: {
    ok: !!llms && /^# .+/m.test(llms) && /^> .+/m.test(llms) && /^- \[.+\]\(.+\)/m.test(llms),
    detail: llms ? `${llms.split('\n').filter((l) => l.startsWith('- [')).length} lien(s)` : 'absent',
  },
};

// Rapport lisible : une ligne par page, une colonne par critère.
const ids = pages[0].checks.map((c) => c.id);
const labels = Object.fromEntries(pages[0].checks.map((c) => [c.id, c.label]));
console.log(`\nAudit GEO — ${pages.length} pages analysées dans ${path.relative(process.cwd(), DIST)}\n`);
console.log(['Page', ...ids].join(' | '));
for (const page of pages) {
  console.log([page.route, ...page.checks.map((c) => (c.ok ? 'OK' : c.blocking ? 'ÉCHEC' : 'à revoir'))].join(' | '));
}
console.log(`\nllms.txt à la racine : ${site.llms.ok ? 'OK' : 'ÉCHEC'} (${site.llms.detail})`);

console.log('\nDétail des points à corriger :');
for (const page of pages) {
  for (const c of page.checks.filter((c) => !c.ok)) {
    console.log(`  ${page.route} — ${labels[c.id]} : ${c.detail}`);
  }
}

const blockingFailures = pages.flatMap((p) => p.checks.filter((c) => !c.ok && c.blocking)).length + (site.llms.ok ? 0 : 1);
const total = pages.reduce((n, p) => n + p.checks.length, 0) + 1;
const passed = pages.reduce((n, p) => n + p.checks.filter((c) => c.ok).length, 0) + (site.llms.ok ? 1 : 0);
console.log(`\nScore : ${passed}/${total} critères respectés — ${blockingFailures} échec(s) bloquant(s).`);

if (jsonOut) {
  writeFileSync(jsonOut, JSON.stringify({ date: new Date().toISOString(), site, pages, passed, total }, null, 2));
  console.log(`Rapport JSON écrit dans ${jsonOut}`);
}

if (strict && blockingFailures > 0) process.exit(1);
