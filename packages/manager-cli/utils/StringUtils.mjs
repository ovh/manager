/**
 * Convert any string to PascalCase.
 */
export const toPascalCase = (name) => {
  if (typeof name !== 'string') {
    console.warn('⚠️ toPascalCase: expected string input');
    return '';
  }

  return name
    .replace(/[^a-zA-Z0-9]/g, ' ')
    .replace(/\b\w/g, (l) => l.toUpperCase())
    .replace(/\s+/g, '');
};

/**
 * Normalize a filename by removing known suffixes and converting to PascalCase.
 */
export const normalizeName = (name) => {
  if (typeof name !== 'string') return '';
  return toPascalCase(name.replace(/\.(page|layout|modal)$/i, '')) || '';
};

/**
 * Deduplicate repeated capitalized words in PascalCase.
 * Example: 'DomainsAddAddPage' → 'DomainsAddPage'
 */
export const dedupeWords = (name) => {
  if (typeof name !== 'string') return '';

  return name
    .split(/(?=[A-Z])/)
    .filter((word, i, arr) => i === 0 || word !== arr[i - 1])
    .join('');
};
