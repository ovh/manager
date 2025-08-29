/**
 * @file presets.ts
 * @description Built-in generator presets with safe string-only tokens.
 */
import { ValidAnswers } from '../playbook/types/playbook-schema';
import { Preset, PresetName } from './presets-types';

/**
 * Minimal default preset values (lowest precedence).
 *
 * These defaults are merged first, before preset-specific defaults or user-provided answers.
 */
const DEFAULTS_PRESETS_CONFIG = {
  appName: 'my-app',
  universe: 'publicCloud',
  subUniverse: 'none',
  regions: ['EU'],
  universes: ['Manager'],
  flavor: 'medium',
  usePreset: false,
  userEmail: 'default@example.com',
  language: 'en',
  framework: 'React',
  mainApiPath: '',
  listingEndpointPath: '',
  dashboardEndpointPath: '',
  description: 'OVHcloud Manager application',
  serviceKey: 'serviceId',
} satisfies Partial<ValidAnswers>;

/**
 * Load a predefined generator preset by name.
 *
 * Merge order (low → high):
 *  1. DEFAULTS_PRESETS_CONFIG
 *  2. preset.defaults
 *  3. user answers
 *
 * Tokens MUST be strings (TokenMap is string-only).
 */
export function loadPreset(name: PresetName): Promise<Preset | undefined> {
  const registry: Record<string, Preset> = {
    pciQuickstart: {
      name: 'pciQuickstart',
      defaults: {
        ...DEFAULTS_PRESETS_CONFIG,
        description: 'PCI Quickstart application for OVHcloud Manager',
        serviceKey: 'serviceId',
      } satisfies Partial<ValidAnswers>,
      // TokenMap is string-only — keep every value a string.
      tokens: {
        FEATURE_FLAGS: 'true', // was boolean true
        serviceKey: 'serviceId',
        heroImage: 'default-hero.png',
        // isPci: 'true', // or 'false'
      },
    },
  };

  return Promise.resolve(registry[name]);
}
