import { describe, expect, it } from 'vitest';

import { ODS_BADGE_COLOR } from '@ovhcloud/ods-components';

import { LicenseStatus } from '@/types/BackupServer.type';

import { getLicenseStatusDisplay } from './licenseStatus';

describe('getLicenseStatusDisplay', () => {
  it('renders CREATING as a progress state', () => {
    expect(getLicenseStatusDisplay(LicenseStatus.CREATING)).toEqual({
      kind: 'progress',
      i18nKey: 'status.creating',
    });
  });

  it('renders UPDATING as a progress state', () => {
    expect(getLicenseStatusDisplay(LicenseStatus.UPDATING)).toEqual({
      kind: 'progress',
      i18nKey: 'status.updating',
    });
  });

  it.each([undefined, null, ''])('treats %s exactly like CREATING', (licenseStatus) => {
    expect(getLicenseStatusDisplay(licenseStatus)).toEqual({
      kind: 'progress',
      i18nKey: 'status.creating',
    });
  });

  it('renders INSTALLED as a success badge', () => {
    expect(getLicenseStatusDisplay(LicenseStatus.INSTALLED)).toEqual({
      kind: 'badge',
      color: ODS_BADGE_COLOR.success,
      i18nKey: 'status.installed',
    });
  });

  it.each([
    [LicenseStatus.EXPIRED, 'status.expired'],
    [LicenseStatus.NOT_SUPPORTED, 'status.not_supported'],
  ])('renders %s as a critical badge', (licenseStatus, expectedKey) => {
    expect(getLicenseStatusDisplay(licenseStatus)).toEqual({
      kind: 'badge',
      color: ODS_BADGE_COLOR.critical,
      i18nKey: expectedKey,
    });
  });

  it('renders an unknown status as an information badge showing the raw value', () => {
    expect(getLicenseStatusDisplay('REVOKED')).toEqual({
      kind: 'badge',
      color: ODS_BADGE_COLOR.information,
      rawLabel: 'REVOKED',
    });
  });
});
