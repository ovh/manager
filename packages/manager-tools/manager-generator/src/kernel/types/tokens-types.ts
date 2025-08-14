/** Supported inline modifiers for tokens. */
export type TokenMod = 'json' | 'bool' | 'raw';

/**
 * A flat key-value map of tokens.
 *
 * Keys are uppercase identifiers (e.g. `APP_NAME`, `REGION`, `FEATURE_FLAGS`),
 * and values are primitives (`string`, `number`, or `boolean`).
 *
 * @example
 * ```ts
 * const tokens: TokenMap = {
 *   APP_NAME: 'pci-example',
 *   REGION: 'GRA',
 *   FEATURE_FLAGS: true,
 * };
 * ```
 */
export type TokenMap = Readonly<Record<string, string>>;
