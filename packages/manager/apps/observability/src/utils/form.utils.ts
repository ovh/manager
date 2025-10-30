/**
 * Add a required asterisk to a label.
 * @param label - The label to add a required asterisk to.
 * @returns The label with a required asterisk.
 * @example
 * ```ts
 * const label = 'Title';
 * const requiredLabel = toRequiredLabel(label);
 * console.log(requiredLabel);
 * // Title*
 */
export const toRequiredLabel = (label: string) => {
  return `${label}*`;
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
