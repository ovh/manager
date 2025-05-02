const importPathToComponent = new Map();
const usedComponentNames = new Set();

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

/**
 * Remove redundant name candidates
 * @param candidates
 * @returns {*}
 */
const removeRedundantNameCandidates = (candidates) => {
  const lower = candidates.map((c) => c.toLowerCase());
  return candidates.filter((candidate, i) => {
    const rest = lower.filter((_, j) => j !== i);
    return !rest.some((r) => r.includes(candidate.toLowerCase()) && r !== candidate.toLowerCase());
  });
};

/**
 * Generate a unique and descriptive component name for a lazy route import.
 */
export const buildUniqueComponentName = (importPath, metadata = {}) => {
  if (typeof importPath !== 'string' || !importPath.trim()) {
    console.warn('⚠️ buildUniqueComponentName: invalid importPath');
    return '';
  }

  if (importPathToComponent.has(importPath)) {
    return importPathToComponent.get(importPath);
  }

  const candidates = [];

  // 1. From breadcrumb label like 'common:add_organization'
  if (metadata.breadcrumb && metadata.breadcrumb.startsWith('common:')) {
    candidates.push(metadata.breadcrumb.split(':')[1]);
  }

  // 2. From tracking.pageName like 'delete_veeam-backup'
  if (metadata.pageName) {
    candidates.push(metadata.pageName.replace(/[-_]+/g, ' '));
  }

  // 3. From route ID
  if (metadata.id) {
    candidates.push(metadata.id.replace(/[-_]+/g, ' '));
  }

  // 4. Fallback to path parts
  if (candidates.length === 0) {
    const pathParts = importPath
      .replace(/^@\/|\.\/|\.tsx?$|\.jsx?$/g, '')
      .split('/')
      .filter(Boolean);

    if (pathParts[0] === 'pages') pathParts.shift();

    const fileName = normalizeName(pathParts.at(-1) || '');
    const folders = pathParts.slice(0, -1).map(normalizeName);
    const filteredFolders = folders.filter((f) => f && f !== fileName);
    candidates.push(...filteredFolders.slice(-2), fileName);
  }

  // Final name composition
  const cleanedCandidates = removeRedundantNameCandidates([...(candidates || [])]);
  let name = dedupeWords(toPascalCase(cleanedCandidates.join(' '))) + 'Page';

  // Deduplicate
  let finalName = name;
  let counter = 1;
  while (usedComponentNames.has(finalName)) {
    finalName = `${name}_${counter++}`;
  }

  usedComponentNames.add(finalName);
  importPathToComponent.set(importPath, finalName);

  return finalName;
};
