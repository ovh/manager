import { PathParams } from 'msw';
import { Handler } from '../../types';
import { backupList } from './veeam-backup.mock';

export type GetVeeamBackupMocksParams = {
  isBackupKo?: boolean;
  nbBackup?: number;
};

const findBackupById = (params: PathParams) =>
  backupList.find(({ id }) => id === params.id);

export const getVeeamBackupMocks = ({
  isBackupKo,
  nbBackup = Number.POSITIVE_INFINITY,
}: GetVeeamBackupMocksParams): Handler[] => [
  {
    url: '/vmwareCloudDirector/backup/:id',
    response: (_: unknown, params: PathParams) =>
      isBackupKo
        ? {
            message: 'Backup error',
          }
        : findBackupById(params),
    status: isBackupKo ? 500 : 200,
    api: 'v2',
  },
  {
    url: '/vmwareCloudDirector/backup',
    response: isBackupKo
      ? {
          message: 'Backup error',
        }
      : backupList.slice(0, nbBackup),
    status: isBackupKo ? 500 : 200,
    api: 'v2',
  },
];
