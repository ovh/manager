export interface PrefixIndex<T extends { name: string }> {
  /** Map of folder prefix → set of direct child prefixes */
  children: Map<string, Set<string>>;
  /** Map of folder prefix → array of files directly under it */
  filesUnder: Map<string, T[]>;
  /** Map of prefix → its parent prefix (for ".." navigation) */
  parent: Map<string, string>;
}

export function getPrefixesFromKey(key: string): string[] {
  return [...key]
    .map((char, i) => (char === '/' ? key.slice(0, i + 1) : null))
    .filter((v): v is string => v !== null);
}

export function buildPrefixIndex<T extends { name: string }>(
  objects: T[],
): PrefixIndex<T> {
  const prefixes = new Set<string>();
  const filesUnder = new Map<string, T[]>();

  // Collect owner prefixes
  objects.forEach((obj) => {
    const key = String(obj.name);
    const chain = getPrefixesFromKey(key);
    const owner = chain.length ? chain.at(-1)! : '';

    prefixes.add(owner);
    filesUnder.set(owner, [...(filesUnder.get(owner) ?? []), obj]);
  });

  prefixes.add('');

  // Build parent map
  const parent = new Map<string, string>(
    Array.from(prefixes).map((p) => {
      if (p === '') return ['', ''];
      const candidates = getPrefixesFromKey(p)
        .slice(0, -1)
        .reverse();
      const foundParent = candidates.find((c) => prefixes.has(c)) ?? '';
      return [p, foundParent];
    }),
  );

  // Build children map
  const children = new Map<string, Set<string>>();
  parent.forEach((par, child) => {
    if (!children.has(par)) children.set(par, new Set());
    if (child !== par) children.get(par)!.add(child);
  });
  if (!children.has('')) children.set('', new Set());

  // Sort files per folder
  filesUnder.forEach((list, folder) => {
    filesUnder.set(
      folder,
      [...list].sort((a, b) =>
        String(a.name).localeCompare(String(b.name), undefined, {
          numeric: true,
        }),
      ),
    );
  });

  return { filesUnder, parent, children };
}
