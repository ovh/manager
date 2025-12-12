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
