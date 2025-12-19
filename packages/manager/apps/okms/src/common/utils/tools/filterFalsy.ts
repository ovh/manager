/**
 * Filters out falsy values (false, null, undefined, 0, '') from an array
 * and returns a properly typed array
 *
 * @param array - Array with potential falsy values
 * @returns Array with all falsy values removed
 *
 * @example
 * const items = [1, false, 2, undefined, 3, null, 0, ''];
 * const filtered = filterFalsy(items); // [1, 2, 3]
 */
export function filterFalsy<T>(array: (T | null | undefined | false)[]): T[] {
  return array.filter((item): item is T => Boolean(item));
}
