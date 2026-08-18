import { describe, expect, it } from 'vitest';

import { EMPTY_VALUE_PLACEHOLDER } from '@/module.constants';

import { getOsTypeDisplay } from './osTypeLabel';

describe('getOsTypeDisplay', () => {
  it.each([
    ['WINDOWS', 'os.windows'],
    ['LINUX', 'os.linux'],
    ['OTHER', 'os.other'],
  ])('maps %s to its i18n key', (osType, expectedKey) => {
    expect(getOsTypeDisplay(osType).i18nKey).toBe(expectedKey);
  });

  it('falls back to the raw API value for an unknown OS', () => {
    const display = getOsTypeDisplay('SOLARIS');

    expect(display.i18nKey).toBeUndefined();
    expect(display.rawLabel).toBe('SOLARIS');
  });

  it.each([undefined, null, ''])('falls back to the placeholder for %s', (osType) => {
    const display = getOsTypeDisplay(osType);

    expect(display.i18nKey).toBeUndefined();
    expect(display.rawLabel).toBe(EMPTY_VALUE_PLACEHOLDER);
  });
});
