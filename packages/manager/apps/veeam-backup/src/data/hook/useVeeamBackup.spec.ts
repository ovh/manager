import { backupList } from '../../../mocks/veeam-backup.mock';
import {
  getRegionNameFromAzName,
  getVeeamBackupDisplayName,
} from './useVeeamBackup';

describe('Veeam-backup API utils', () => {
  describe('getRegionNameFromAzName', () => {
    it('returns the region from azName', () => {
      expect(getRegionNameFromAzName('eu-central-waw-a')).toBe(
        'eu-central-waw',
      );
    });
  });

  describe('getVeeamBackupDisplayName', () => {
    it('returns the displayName if present', () => {
      expect(getVeeamBackupDisplayName(backupList[0])).toBe(
        backupList[0].iam.displayName,
      );
    });

    it('returns the id if displayName is not present', () => {
      const backupWithoutDisplayName = {
        ...backupList[0],
        iam: {
          ...backupList[0].iam,
          displayName: null as string,
        },
      };
      expect(getVeeamBackupDisplayName(backupWithoutDisplayName)).toBe(
        backupWithoutDisplayName.id,
      );
    });
  });
});
