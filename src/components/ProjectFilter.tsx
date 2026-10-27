// Îlot Preact : filtre les projets par technologie.
// Amélioration progressive : les cartes sont du HTML statique rendu par Astro (avec leurs images
// optimisées). Sans JavaScript, tout reste visible ; l'îlot se contente de masquer les cartes.
import { useEffect, useState } from 'preact/hooks';

interface Props {
  technologies: string[];
  // Sélecteur CSS des cartes ; chaque carte porte data-stack="Astro|MDX|…".
  target: string;
}

export default function ProjectFilter({ technologies, target }: Props) {
  const [active, setActive] = useState<string | null>(null);
  const [visible, setVisible] = useState<number | null>(null);

  useEffect(() => {
    const cards = document.querySelectorAll<HTMLElement>(target);
    let count = 0;
    cards.forEach((card) => {
      const match = !active || (card.dataset.stack ?? '').split('|').includes(active);
      card.hidden = !match;
      if (match) count++;
    });
    setVisible(count);
  }, [active, target]);

  return (
    <div class="filter">
      <p class="label" id="filter-label">
        Filtrer par technologie :
      </p>
      <div class="buttons" role="group" aria-labelledby="filter-label">
        <button type="button" aria-pressed={active === null} onClick={() => setActive(null)}>
          Tous
        </button>
        {technologies.map((tech) => (
          <button type="button" key={tech} aria-pressed={active === tech} onClick={() => setActive(tech)}>
            {tech}
          </button>
        ))}
      </div>
      <p class="count" aria-live="polite">
        {visible !== null && `${visible} projet${visible > 1 ? 's' : ''} affiché${visible > 1 ? 's' : ''}`}
      </p>
    </div>
  );
}
