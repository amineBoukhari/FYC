// Configuration Lighthouse CI : mesure les pages clés à chaque push et échoue sous les seuils.
// Le site est servi par `astro preview`, c'est-à-dire dans workerd, le runtime de Cloudflare.
module.exports = {
  ci: {
    collect: {
      // Port dédié : n'entre pas en conflit avec un « npm run dev » déjà lancé sur 4321.
      startServerCommand: 'npm run preview -- --port 4322',
      startServerReadyPattern: 'ready',
      startServerReadyTimeout: 30000,
      url: [
        'http://localhost:4322/',
        'http://localhost:4322/projets/',
        'http://localhost:4322/blog/ssg-ssr-csr/',
        'http://localhost:4322/contact/',
      ],
      // Médiane de 3 passages : Lighthouse varie d'un passage à l'autre.
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.95 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['warn', { maxNumericValue: 200 }],
      },
    },
    upload: {
      // Rapports conservés comme artefacts de la CI : un historique run par run.
      target: 'filesystem',
      outputDir: '.lighthouseci',
    },
  },
};
