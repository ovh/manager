/**
 * Converts a string to title case, replacing dashes and underscores with spaces.
 *
 * Each word’s first letter is capitalized while the rest of the characters remain unchanged.
 *
 * @example
 * formatToTitleCase('hello-world');    // "Hello World"
 * formatToTitleCase('some_value_here'); // "Some Value Here"
 *
 * @param str - The input string to format.
 * @returns The formatted string in title case.
 */
export function formatToTitleCase(str: string): string {
  return str.replace(/[-_]/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}
