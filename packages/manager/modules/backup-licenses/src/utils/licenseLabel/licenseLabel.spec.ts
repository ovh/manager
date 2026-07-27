import { describe, expect, it } from 'vitest';

import { EMPTY_VALUE_PLACEHOLDER } from '@/module.constants';
import { LicenseApiValue } from '@/types/Order.type';

import { getLicenseTypeDisplay } from './licenseLabel';

describe('getLicenseTypeDisplay', () => {
  it.each([
    [LicenseApiValue.VDP_FOUNDATION, 'license.foundation'],
    [LicenseApiValue.VDP_ADVANCED, 'license.advanced'],
    [LicenseApiValue.VDP_PREMIUM, 'license.premium'],
    [LicenseApiValue.ENTERPRISE_PLUS, 'license.enterprise_plus'],
  ])('maps %s to its i18n key', (licenseType, expectedKey) => {
    expect(getLicenseTypeDisplay(licenseType).i18nKey).toBe(expectedKey);
  });

  it('falls back to the raw API value for an unknown license type', () => {
    const display = getLicenseTypeDisplay('VEEAM_DATA_PLATFORM_ULTIMATE');

    expect(display.i18nKey).toBeUndefined();
    expect(display.rawLabel).toBe('VEEAM_DATA_PLATFORM_ULTIMATE');
  });

  it.each([undefined, null, '', '   '])('falls back to the placeholder for %s', (licenseType) => {
    const display = getLicenseTypeDisplay(licenseType);

    expect(display.i18nKey).toBeUndefined();
    expect(display.rawLabel).toBe(EMPTY_VALUE_PLACEHOLDER);
  });
});
