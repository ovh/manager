/**
 * Utility to parse JSON in a type-safe way.
 */
export function parseJson<T>(raw: string): T {
  return JSON.parse(raw) as T;
}
