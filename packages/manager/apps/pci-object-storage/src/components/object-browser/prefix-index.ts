import type { PrefixIndex } from "./types";


export function getPrefixesFromKey(key: string): string[] {
  const res: string[] = [];
  for (let i = 0; i < key.length; i++) {
    if (key[i] === "/") {
      res.push(key.slice(0, i + 1));
    }
  }
  return res;
}

export function buildPrefixIndex<T extends { name: string }>(objects: T[]): PrefixIndex<T> {
  const prefixes = new Set<string>();
  const filesUnder = new Map<string, T[]>();

  for (const obj of objects) {
    const key = String(obj.name);
    const chain = getPrefixesFromKey(key);
    const owner = chain.length ? chain[chain.length - 1] : "";
    prefixes.add(owner);
    if (!filesUnder.has(owner)) filesUnder.set(owner, []);
    filesUnder.get(owner)!.push(obj);
  }

  // add root folder
  prefixes.add("");

  const parent = new Map<string, string>();
  for (const p of prefixes) {
    if (p === "") { parent.set("", ""); continue; }
    const chain = getPrefixesFromKey(p);
    let found = "";
    for (let i = chain.length - 2; i >= 0; i--) {
      const cand = chain[i];
      if (prefixes.has(cand)) { found = cand; break; }
    }
    parent.set(p, found);
  }

  const children = new Map<string, Set<string>>();
  for (const p of prefixes) {
    const par = parent.get(p) ?? "";
    if (!children.has(par)) children.set(par, new Set());
    if (p !== par) children.get(par)!.add(p);
  }
  if (!children.has("")) children.set("", new Set());

  for (const [, list] of filesUnder.entries()) {
    list.sort((a, b) => String(a.name).localeCompare(String(b.name), undefined, { numeric: true }));
  }

  return { prefixes, filesUnder, parent, children };
}
