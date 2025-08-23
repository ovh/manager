import { ValidAnswers } from '../../playbook/types/playbook-schema';
import { GeneratorAnswers } from '../../playbook/types/playbook-types';

/** Supported inline modifiers for tokens. */
export type TokenMod = 'json' | 'bool' | 'raw';

/**
 * A flat key-value map of tokens.
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
