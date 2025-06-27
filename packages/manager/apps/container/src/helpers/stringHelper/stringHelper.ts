/**
 * Truncates string if it's longer than the given maximum string length.
 * The last characters of the truncated string are replaced with "...".
 * @param str string to be truncated
 * @param options object containing the maximum string length
 * @returns truncated string
 */
export const truncate = (str: string, options: { length: number }) => {
  if (str.length <= options.length) {
    return str;
  }
  return `${str.substring(0, options.length)}...`;
};

/**
 * Converts the first character of str to upper case and the remaining to lower case.
 * @param str string to be capitalized
 * @returns capitalized string
 */
export const capitalize = (str: string) => {
  if (!str) {
    return '';
  }
  return `${str.charAt(0).toUpperCase()}${str.slice(1).toLowerCase()}`;
};

/**
 * Split the string when finding a uppercases and insert underscores before and uppercase the resulting string.
 * @param str string to be formatted to screaming snake case (eg: SCREAMING_SNAKE_CASE)
 * @returns string in screaming snake case format
 */
export const toScreamingSnakeCase = (str: string) => {
  if (!str) {
    return '';
  }
  return str
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .toUpperCase();
};
