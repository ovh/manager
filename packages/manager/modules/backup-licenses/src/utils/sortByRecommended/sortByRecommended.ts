/** Trie une liste de cartes/niveaux de licence en plaçant la recommandation en tête
 * (modale d'édition, BKP-1218) — tri stable, l'ordre relatif du reste est conservé. */
export function sortByRecommended<T extends { recommended: boolean }>(items: T[]): T[] {
  return [...items].sort((a, b) => Number(b.recommended) - Number(a.recommended));
}
