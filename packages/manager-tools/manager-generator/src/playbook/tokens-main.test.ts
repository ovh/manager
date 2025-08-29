import { describe, expect, it, vi } from 'vitest';

import type { BuildTokensInput } from '../kernel/types/tokens-types';
import { buildBaseTokens, hasMainApiPath, resolveTokens } from './tokens-main';
import type { ValidAnswers } from './types/playbook-schema';

// Mock loadPreset for resolveTokens
vi.mock('../presets/presets', () => ({
  loadPreset: vi.fn((name: string) => {
    if (name === 'publicCloud') {
      return Promise.resolve({
        tokens: { presetKey: 'presetValue', appNameKebab: 'preset-app' },
      });
    }
    return Promise.resolve({});
  }),
}));

describe('hasMainApiPath', () => {
  it('returns true for object with non-empty mainApiPath string', () => {
    expect(hasMainApiPath({ mainApiPath: '/cloud' })).toBe(true);
  });

  it('returns false for object with empty mainApiPath string', () => {
    expect(hasMainApiPath({ mainApiPath: '   ' })).toBe(false);
  });

  it('returns false for object without mainApiPath', () => {
    expect(hasMainApiPath({ foo: 'bar' })).toBe(false);
  });

  it('returns false for non-object values', () => {
    expect(hasMainApiPath(null)).toBe(false);
    expect(hasMainApiPath('string')).toBe(false);
    expect(hasMainApiPath(123)).toBe(false);
  });
});

describe('buildBaseTokens', () => {
  it('builds tokens with defaults', () => {
    const tokens = buildBaseTokens({ appName: 'CloudApp' } as BuildTokensInput);

    expect(tokens.appNameKebab).toBe('cloud-app');
    expect(tokens.packageName).toBe('@ovh-ux/manager-cloud-app-app');
    expect(tokens.mainApiPath).toBe('/services');
    expect(tokens.description).toContain('CloudApp — OVHcloud Manager Application');
  });

  it('applies PCI slug shortening', () => {
    const tokens = buildBaseTokens({
      appName: 'pci-billing',
      isPci: true,
      appSlug: 'pci-project-billing',
    } as BuildTokensInput);

    expect(tokens.isPci).toBe('true');
    expect(tokens.appSlug).not.toContain('pci-');
  });

  it('normalizes API path when provided', () => {
    const tokens = buildBaseTokens({
      appName: 'X',
      listingEndpoint: ' /cloud ',
    } as BuildTokensInput);

    expect(tokens.mainApiPath).toBe('/cloud');
  });
});

describe('resolveTokens', () => {
  it('merges preset, base, and env tokens with correct precedence', async () => {
    const answers: ValidAnswers = {
      listingEndpointPath: '',
      mainApiPath: '',
      dashboardEndpointPath: '',
      universe: '',
      usePreset: false,
      appName: 'cloud',
    };
    const ctx = {
      presets: ['publicCloud'],
      envTokens: { customKey: 'ENV', appNameKebab: 'env-app' },
    };

    const tokens = await resolveTokens(answers, ctx);

    expect(tokens.presetKey).toBe('presetValue');
    expect(tokens.appNameKebab).toBe('env-app'); // env override wins
    expect(tokens.customKey).toBe('ENV');
  });

  it('works without presets or envTokens', async () => {
    const answers: ValidAnswers = {
      listingEndpointPath: '',
      mainApiPath: '',
      dashboardEndpointPath: '',
      universe: '',
      usePreset: false,
      appName: 'solo',
    };
    const tokens = await resolveTokens(answers);
    expect(tokens.appNameKebab).toBe('solo');
  });
});
