const BORDER_COLOR_CLASS = 'border-[var(--ods-color-neutral-100)]';

/**
 * Les bordures sont portées par les cellules et non par un `divide-*` du conteneur :
 * une grille qui passe de 1 à 2 colonnes ne peut pas exprimer ses séparateurs internes
 * avec les utilitaires `divide`, qui ne connaissent pas le nombre de colonnes effectif.
 */
export const getTwoColumnCellBorders = (index: number, total: number): string => {
  const classes = [BORDER_COLOR_CLASS];

  if (index < total - 1) classes.push('border-b');
  if (index >= total - 2) classes.push('sm:border-b-0');
  if (index % 2 === 0 && index < total - 1) classes.push('sm:border-r');

  return classes.join(' ');
};
