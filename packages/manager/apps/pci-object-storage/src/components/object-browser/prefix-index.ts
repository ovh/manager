import { PrefixIndex } from './types';

export function getPrefixesFromKey(key: string): string[] {
  return key
    .split('')
    .map((ch, idx) => (ch === '/' ? key.slice(0, idx + 1) : null))
    .filter((x): x is string => x !== null);
}

export function buildPrefixIndex<T extends { name: string }>(
  objects: T[],
): PrefixIndex<T> {
  const prefixes = new Set<string>();
  const filesUnder = new Map<string, T[]>();

  objects.forEach((obj) => {
    const key = String(obj.name);
    const chain = getPrefixesFromKey(key);
    const owner = chain.length ? chain[chain.length - 1] : '';

    prefixes.add(owner);
    const list = filesUnder.get(owner) ?? [];
    list.push(obj);
    filesUnder.set(owner, list);
  });

  // ensure root
  prefixes.add('');

  const parent = new Map<string, string>();
  prefixes.forEach((p) => {
    if (p === '') {
      parent.set('', '');
      return;
    }

    const chain = getPrefixesFromKey(p);
    const found =
      [...chain]
        .slice(0, -1) // exclude current path
        .reverse() // check closest first
        .find((cand) => prefixes.has(cand)) ?? '';

    parent.set(p, found);
  });

  const children = new Map<string, Set<string>>();
  prefixes.forEach((p) => {
    const par = parent.get(p) ?? '';
    const set = children.get(par) ?? new Set();
    if (p !== par) set.add(p);
    children.set(par, set);
  });

  // ensure root exists even if empty
  if (!children.has('')) children.set('', new Set());

  // sort files in each folder
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

  return { prefixes, filesUnder, parent, children };
}
