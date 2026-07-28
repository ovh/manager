/**
 * `border-solid` et `border-0` sont explicites : l'app hôte désactive le preflight Tailwind,
 * qui est seul à poser `border-style: solid` et à ramener les largeurs à 0. Sans eux, un
 * `border-b` ne dessine rien et les trois autres côtés retombent sur la largeur `medium`.
 */
const BORDER_RESET_CLASS = 'border-0 border-solid';
const BORDER_COLOR_CLASS = 'border-[var(--ods-color-neutral-100)]';

/**
 * Les bordures sont portées par les cellules et non par un `divide-*` du conteneur :
 * une grille qui passe de 1 à 2 colonnes ne peut pas exprimer ses séparateurs internes
 * avec les utilitaires `divide`, qui ne connaissent pas le nombre de colonnes effectif.
 */
export const getTwoColumnCellBorders = (index: number, total: number): string => {
  const classes = [BORDER_RESET_CLASS, BORDER_COLOR_CLASS];

  if (index < total - 1) classes.push('border-b');
  if (index >= total - 2) classes.push('sm:border-b-0');
  if (index % 2 === 0 && index < total - 1) classes.push('sm:border-r');

  return classes.join(' ');
};
