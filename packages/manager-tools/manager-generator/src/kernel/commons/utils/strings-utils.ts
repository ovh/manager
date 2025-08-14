/**
 * @file strings-utils.ts
 * @description Small, reusable string and object-guard utilities used across the generator.
 */

/**
 * Non-null object guard (dictionary-like).
 * @param v - Value to test.
 * @returns True if `v` is a non-null object.
 */
export function asDict(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null;
}

/**
 * Trim a string while preserving `undefined`.
 * @param s - Input string or undefined.
 * @returns Trimmed string or the original `undefined`.
 */
export const trim = (s?: string) => (typeof s === 'string' ? s.trim() : s);

/**
 * Lowercase a string while preserving `undefined`.
 * @param s - Input string or undefined.
 * @returns Lowercased string or the original `undefined`.
 */
export const lower = (s?: string) => (typeof s === 'string' ? s.toLowerCase() : s);

/**
 * Read a string property from an unknown object.
 * @param obj - Source value.
 * @param key - Property name.
 * @returns String value if present and of type string; otherwise `undefined`.
 */
export function readString(obj: unknown, key: string): string | undefined {
  if (!asDict(obj)) return undefined;
  const v = obj[key];
  return typeof v === 'string' ? v : undefined;
}

/**
 * Read a string[] property from an unknown object.
 * @param obj - Source value.
 * @param key - Property name.
 * @returns String array if all elements are strings; otherwise `undefined`.
 */
export function readStringArray(obj: unknown, key: string): string[] | undefined {
  if (!asDict(obj)) return undefined;
  const v = obj[key];
  if (!Array.isArray(v)) return undefined;
  const allStrings = v.every((x) => typeof x === 'string');
  return allStrings ? v : undefined;
}

/**
 * Convert a string to kebab-case (safe for package/app names).
 * - Removes quotes
 * - Replaces non-alphanumerics with '-'
 * - Collapses repeated '-'
 * - Trims leading/trailing '-'
 * - Lowercases
 *
 * @param input - Source string.
 * @returns Kebab-cased string (may be empty if input had no word characters).
 */
export function toKebab(input: string): string {
  return String(input || '')
    .replace(/['"]/g, '')
    .replace(/[^A-Za-z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
}
