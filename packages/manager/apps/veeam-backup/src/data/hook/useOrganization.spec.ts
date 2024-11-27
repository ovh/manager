import { backupList } from '../../../mocks/veeam-backup.mock';
import {
  getAvailabilityZone,
  getBackupIdFromOrganization,
  getOrganizationDisplayName,
  getOrganizationIdFromBackup,
  getOrganizationUuid,
} from './useOrganizations';
import { organizationList } from '../../../mocks/vcd-organization.mock';

describe('Managed VCD API utils', () => {
  it('getAvailabilityZone returns the azName from the region', () => {
    expect(getAvailabilityZone(organizationList[0])).toBe('eu-central-waw-a');
  });

  it('getBackupIdFromOrganizationId returns the backup id', () => {
    expect(getBackupIdFromOrganization(organizationList[0])).toBe(
      backupList[0].id,
    );
  });

  it('getOrganizationIdFromBackup returns the organization id from the backup', () => {
    expect(getOrganizationIdFromBackup(backupList[0])).toBe(
      organizationList[0].id,
    );
  });

  it('getOrganizationUuid returns the organization uuid', () => {
    expect(getOrganizationUuid(organizationList[0])).toBe(
      '6cfa2c69-c62c-4853-80ee-c9682e6727f0',
    );
  });

  describe('getOrganizationDisplayName', () => {
    it('returns the displayName if present', () => {
      expect(getOrganizationDisplayName(organizationList[0])).toBe(
        organizationList[0].currentState.fullName,
      );
    });

    it('returns the id if displayName is not present', () => {
      const organizationWithoutDisplayName = {
        ...organizationList[0],
        currentState: {
          ...organizationList[0].currentState,
          fullName: null as string,
        },
      };
      expect(getOrganizationDisplayName(organizationWithoutDisplayName)).toBe(
        organizationList[0].currentState.name,
      );
    });
  });
});
