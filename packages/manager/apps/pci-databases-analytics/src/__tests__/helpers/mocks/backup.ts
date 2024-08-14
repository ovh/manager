import { RestoreBackupProps } from '@/api/databases/backups';
import { database } from '@/models/database';

export const mockedBackup: database.Backup = {
  createdAt: '2024/04/08',
  description: 'backupDescription',
  id: 'testBackup123',
  region: 'Region',
  regions: [{ name: 'Region' }, { name: 'Region1' }],
  size: {
    unit: 'GB',
    value: 240,
  },
  status: database.StatusEnum.READY,
  type: database.BackupTypeEnum.automatic,
};

export const mockedBackupBis: database.Backup = {
  createdAt: '2024/05/08',
  description: 'backupDescription',
  id: 'testBackup123484',
  region: 'Region',
  regions: [{ name: 'Region' }, { name: 'Region1' }],
  size: {
    unit: 'GB',
    value: 240,
  },
  status: database.StatusEnum.READY,
  type: database.BackupTypeEnum.automatic,
};
