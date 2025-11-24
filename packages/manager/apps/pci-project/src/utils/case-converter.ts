/**
 * Converts a camelCase string to snake_case format.
 *
 * @param str - The camelCase string to convert
 * @returns The converted string in snake_case format
 *
 * @example
 * ```typescript
 * camelToSnakeCase('myVariableName'); // Returns 'my_variable_name'
 * camelToSnakeCase('firstName'); // Returns 'first_name'
 * camelToSnakeCase('ID'); // Returns '_i_d'
 * ```
 */
export const camelToSnakeCase = (str: string): string => {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
};
