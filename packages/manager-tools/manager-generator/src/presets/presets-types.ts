import { TokenMap } from '../kernel/types/tokens-types';
import { ValidAnswers } from '../playbook/types/playbook-schema';

/**
 * A unique string identifier for a preset.
 *
 * Presets are predefined sets of defaults and tokens that can be applied
 * to reduce manual input during generation.
 *
 * @example
 * ```ts
 * const presetName: PresetName = 'pciQuickstart';
 * ```
 */
export type PresetName = string;

/**
 * Definition of a generator preset.
 *
 * Presets provide:
 * - A unique `name`.
 * - An optional set of static `tokens` to inject.
 * - Optional `defaults` to prefill certain generator answers.
 *
 * @example
 * ```ts
 * const pciQuickstart: Preset = {
 *   name: 'pciQuickstart',
 *   defaults: {
 *     universe: 'publicCloud',
 *     language: 'en',
 *   },
 *   tokens: {
 *     FEATURE_FLAGS: true,
 *   },
 * };
 * ```
 */
export interface Preset {
  /** Unique name of the preset. */
  name: PresetName;

  /**
   * Optional tokens to merge into the final {@link TokenMap}.
   * These are applied after defaults but before `envTokens`.
   */
  tokens?: TokenMap;

  /**
   * Optional default answers to merge into the prompt results.
   * These are applied after {@link ResolveContext.defaultAnswers} but before user-provided answers.
   */
  defaults?: Partial<ValidAnswers>;
}

/**
 * Context object passed to {@link resolveTokens} to control
 * how defaults, presets, environment tokens, and user answers are merged.
 *
 * The merge order is:
 * 1. Global defaults (lowest precedence)
 * 2. `defaultAnswers` from this context
 * 3. `defaults` from each preset (in the order listed in `presets`)
 * 4. User-provided answers
 *
 * Token injection order is:
 * 1. Base tokens built from merged answers
 * 2. `tokens` from each preset (in `presets` order)
 * 3. `envTokens` (highest precedence)
 */
export interface ResolveContext {
  /**
   * Preset names to load and merge into the final token map.
   * Presets are applied in the given order.
   */
  presets?: PresetName[];

  /**
   * Additional token values to inject after presets.
   * These override both defaults and preset tokens.
   */
  envTokens?: TokenMap;

  /**
   * Default answers to merge before presets and user answers.
   * Useful for programmatically setting non-interactive defaults.
   */
  defaultAnswers?: Partial<ValidAnswers>;
}
