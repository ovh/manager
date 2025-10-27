import type { PrefixIndex } from "./types";

/**
 * Return all intermediate folder prefixes for a given key,
 * without normalizing or removing multiple slashes.
 */
export function getPrefixes(key: string): string[] {
  const parts: string[] = [];
  for (let i = 0; i < key.length; i+=1) {
    if (key[i] === "/") {
      // find next segment
      const j = key.indexOf("/", i + 1);
      if (j !== -1) parts.push(key.slice(0, j + 1));
    }
  }
  return parts;
}

/**
 * Build a simple prefix index from a flat list of objects.
 * Only prefixes that own files (or are parents of owners) are kept.
 * No normalization, no tokenizer.
 */
export function buildPrefixIndex<T extends { name: string }>(
  objects: T[]
): PrefixIndex<T> {
  const prefixes = new Set<string>();
  const filesUnder = new Map<string, T[]>();

  // Assign each object to its owning prefix
  for (const obj of objects) {
    const key = String(obj.name);
    const all = getPrefixes(key);
    const owner = all.length ? all[all.length - 1] : "";
    prefixes.add(owner);
    if (!filesUnder.has(owner)) filesUnder.set(owner, []);
    filesUnder.get(owner)!.push(obj);
  }

  // Ensure root always exists
  prefixes.add("");

  // Compute parent map by finding the nearest shorter prefix that exists
  const parent = new Map<string, string>();
  for (const p of prefixes) {
    if (p === "") {
      parent.set("", "");
      continue;
    }

    const all = getPrefixes(p);
    let found = "";
    for (let i = all.length - 2; i >= 0; i--) {
      const cand = all[i];
      if (prefixes.has(cand)) {
        found = cand;
        break;
      }
    }
    parent.set(p, found);
  }

  // Compute children map (reverse of parent)
  const children = new Map<string, Set<string>>();
  for (const p of prefixes) {
    const par = parent.get(p) ?? "";
    if (!children.has(par)) children.set(par, new Set());
    if (p !== par) children.get(par)!.add(p);
  }
  if (!children.has("")) children.set("", new Set());

  // Sort files for determinism
  for (const [, list] of filesUnder.entries()) {
    list.sort((a, b) => String(a.name).localeCompare(String(b.name)));
  }

  return { prefixes, filesUnder, parent, children };
}