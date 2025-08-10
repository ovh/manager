import { ValidAnswers } from '../../playbook/types/playbook-schema';
import { GeneratorAnswers } from '../../playbook/types/playbook-types';

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

/**
 * Input type for token builders.
 *
 * Accepts:
 * - Full `GeneratorAnswers` (strict, internal form)
 * - `ValidAnswers` (looser, prompt form)
 * - Partial combinations (intermediate state between prompt & generator)
 */
export type BuildTokensInput = Partial<GeneratorAnswers> | ValidAnswers;
