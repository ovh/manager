/**
 * @file tokens-helper.ts
 * @description Low-level helpers for token resolution and replacement.
 */
import { TokenMod } from '../types/tokens-types';
import { type TokenMap } from '../types/tokens-types';

/** Plain-object type guard (not null, not array). */
export function isPlainObject(val: unknown): val is Record<string, unknown> {
  return typeof val === 'object' && val !== null && !Array.isArray(val);
}

/**
 * Deeply merges two plain objects.
 * Arrays are overwritten (not concatenated).
 */
export function deepMerge<T extends Record<string, unknown>, U extends Record<string, unknown>>(
  base: T,
  patch: U,
): T & U {
  const out: Record<string, unknown> = { ...base };
  for (const [k, v] of Object.entries(patch)) {
    const current = out[k];
    if (isPlainObject(v) && isPlainObject(current)) {
      out[k] = deepMerge(current, v);
    } else if (v !== undefined) {
      out[k] = v;
    }
  }
  return out as T & U;
}

/** Trim helper that preserves `undefined`. */
export const trim = (s?: string) => (typeof s === 'string' ? s.trim() : s);

/** Lowercase helper that preserves `undefined`. */
export const lower = (s?: string) => (typeof s === 'string' ? s.toLowerCase() : s);

/** Safe hasOwnProperty. */
export function safeHas(obj: Record<string, unknown>, key: string): boolean {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

/** `{{token}}` (with optional `|mod`) */
export const TOKEN_RE: RegExp = /{{\s*([A-Za-z0-9_-|]+)\s*}}/g;

/** Quoted `'{{token}}'` or `"{{token}}"` (with optional `|mod`) */
export const TOKEN_IN_QUOTES_RE: RegExp = /(['"])\s*{{\s*([A-Za-z0-9_-|]+)\s*}}\s*\1/g;

/**
 * Parse raw token like `name|mod` into `{ name, mod }`.
 */
export function parseTokenAndMod(raw: string): { name: string; mod?: TokenMod } {
  const [name, mod] = raw.split('|', 2).map((s) => s.trim());
  return { name: name || '', mod: (mod as TokenMod | undefined) || undefined };
}

/**
 * Tolerant lookup: exact → UPPER_SNAKE → lowerCamel(first-letter).
 */
export function lookup(tokens: TokenMap, name: string): unknown {
  if (!name) return undefined;
  if (safeHas(tokens, name)) return tokens[name];
  const upper = name.toUpperCase();
  if (safeHas(tokens, upper)) return tokens[upper];
  const lowerName = name.charAt(0).toLowerCase() + name.slice(1);
  if (safeHas(tokens, lowerName)) return tokens[lowerName];
  return undefined;
}

/**
 * Stringify a value safely for insertion into text.
 * - For strings: optionally escape the given quote char.
 * - For numbers/booleans: simple String().
 * - For objects/arrays: JSON.stringify().
 * - null/undefined → empty string.
 */
export function safeToString(value: unknown, quote?: '"' | "'"): string {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') {
    if (!quote) return value;
    return value.replace(new RegExp(`\\${quote}`, 'g'), `\\${quote}`);
  }
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  return JSON.stringify(value);
}

/**
 * Apply a token inline modifier.
 * - `json`: JSON.stringify(val)
 * - `bool`: Boolean(val) → "true"/"false"
 * - `raw` : return primitives as-is; non-primitives as JSON
 */
export function applyMod(val: unknown, mod?: TokenMod): string {
  if (!mod) return safeToString(val);
  if (mod === 'json') return JSON.stringify(val);
  if (mod === 'bool') return String(Boolean(val));
  if (typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean') {
    return String(val);
  }
  return JSON.stringify(val);
}

/**
 * Replace all `{{TOKEN}}` (and quoted tokens) with values.
 *
 * - Quoted tokens: `'{{x}}'` or `"{{x}}"`:
 *    • booleans/numbers → unquoted literals
 *    • strings → re-quoted with proper escaping
 *    • objects/arrays → JSON literal (unquoted)
 *    • `|json` → raw JSON (strings included)
 *    • `|raw` → unquoted insertion (be careful)
 *
 * - Unquoted tokens:
 *    • default → safe stringify
 *    • `|json` → JSON
 *    • `|bool` → "true"/"false"
 *    • `|raw`  → primitives as-is, else JSON
 */
export function replaceTokens(content: string, tokens: TokenMap): string {
  // 1) quoted tokens
  content = content.replace(
    TOKEN_IN_QUOTES_RE,
    (match: string, quote: string, raw: string): string => {
      const { name, mod } = parseTokenAndMod(raw);
      const value = lookup(tokens, name);
      if (value === undefined) {
        // keep the original quoted token when missing
        return match;
      }

      if (mod === 'json') return JSON.stringify(value);

      // numbers/booleans → unquoted
      if (typeof value === 'number' || typeof value === 'boolean') {
        return String(value);
      }

      if (mod === 'raw') {
        return applyMod(value, 'raw');
      }

      // strings → re-quote & escape; objects → JSON literal
      if (typeof value === 'string') {
        const q = quote as '"' | "'";
        return `${q}${safeToString(value, q)}${q}`;
      }
      return JSON.stringify(value);
    },
  );

  // 2) unquoted tokens
  return content.replace(TOKEN_RE, (match: string, raw: string): string => {
    const { name, mod } = parseTokenAndMod(raw);
    const value = lookup(tokens, name);
    if (value === undefined) return match;
    return applyMod(value, mod);
  });
}

/**
 * Throw if any `{{token}}` remains after replacement (for non–dry runs).
 */
export function assertNoUnresolvedTokens(filePath: string, content: string): void {
  const leftovers = content.match(TOKEN_RE);
  if (leftovers && leftovers.length) {
    const unique = Array.from(new Set(leftovers));
    throw new Error(`Unresolved tokens in ${filePath}: ${unique.join(', ')}`);
  }
}
