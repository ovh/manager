import { describe, expect, it } from 'vitest';

import { BackupServer } from '@/types/BackupServer.type';

import { getLicenseEditRules } from './licenseEditRules';

const buildServer = (overrides: Partial<BackupServer> = {}): BackupServer => ({
  id: 'server-1',
  displayName: 'VBR-CUST-SERV-01',
  ...overrides,
});

describe('getLicenseEditRules', () => {
  it.each([['11.0'], ['12.1'], [undefined]])(
    'locks family and tier when the version is below 13 (%s)',
    (backupServerVersion) => {
      expect(getLicenseEditRules(buildServer({ backupServerVersion, osType: 'WINDOWS' }))).toEqual({
        canEditFamily: false,
        canEditTier: false,
        lockReason: 'version',
      });
    },
  );

  it('locks family and tier when the version is below 13, whatever the OS', () => {
    expect(
      getLicenseEditRules(buildServer({ backupServerVersion: '12.1', osType: 'LINUX' })),
    ).toEqual({
      canEditFamily: false,
      canEditTier: false,
      lockReason: 'version',
    });
  });

  it('opens family and tier for a v13+ Windows server', () => {
    expect(
      getLicenseEditRules(buildServer({ backupServerVersion: '13.0', osType: 'WINDOWS' })),
    ).toEqual({
      canEditFamily: true,
      canEditTier: true,
      lockReason: null,
    });
  });

  it('locks the family but opens the tier for a v13+ Linux server', () => {
    expect(
      getLicenseEditRules(buildServer({ backupServerVersion: '13.0', osType: 'LINUX' })),
    ).toEqual({
      canEditFamily: false,
      canEditTier: true,
      lockReason: 'os',
    });
  });

  it('treats an unconfirmed-Windows OS as the restricted (non-Windows) case', () => {
    expect(
      getLicenseEditRules(buildServer({ backupServerVersion: '13.0', osType: 'LINUX_APPLIANCE' })),
    ).toEqual({
      canEditFamily: false,
      canEditTier: true,
      lockReason: 'os',
    });
    expect(
      getLicenseEditRules(buildServer({ backupServerVersion: '13.0', osType: undefined })),
    ).toEqual({
      canEditFamily: false,
      canEditTier: true,
      lockReason: 'os',
    });
  });

  it('treats a missing server as fully locked', () => {
    expect(getLicenseEditRules(undefined)).toEqual({
      canEditFamily: false,
      canEditTier: false,
      lockReason: 'version',
    });
  });
});
