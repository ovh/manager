/**
 * Add a required label to a label.
 * @param label - The label to add a required label to.
 * @param requiredLabel - The required label to add to the label.
 * @returns The label with a required label.
 * @example
 * ```ts
 * const label = 'Title';
 * const requiredLabel = 'required';
 * const requiredLabel = toRequiredLabel(label, requiredLabel);
 * console.log(requiredLabel);
 * // Title - required
 */
export const toRequiredLabel = (label: string, requiredLabel: string) => {
  return `${label} - ${requiredLabel}`;
};

/**
 * Wrap a label in parentheses.
 * @param label - The label to wrap in parentheses.
 * @returns The label wrapped in parentheses.
 * @example
 * ```ts
 * const label = 'Paris';
 * const parenthesesLabel = toParenthesesLabel(label);
 * console.log(parenthesesLabel);
 * // (Paris)
 * ```
 */
export const toParenthesesLabel = (label: string) => {
  return `(${label})`;
};

/**
 * Parse a string of networks separated by commas or newlines into an array of trimmed strings.
 * @param value - The string to parse.
 * @returns An array of trimmed network strings.
 * @example
 * ```ts
 * const networks = parseNetworks('1.2.3.4, 5.6.7.8\n10.0.0.0/24');
 * console.log(networks);
 * // ['1.2.3.4', '5.6.7.8', '10.0.0.0/24']
 * ```
 */
export const parseNetworks = (value: string): string[] =>
  value
    ? value
        .split(/[\n,]/)
        .map((ip) => ip.trim())
        .filter(Boolean)
    : [];
