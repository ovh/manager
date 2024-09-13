import { PathParams } from 'msw';
import { Handler } from '../../../../../../playwright-helpers';
import backupList from './veeam-backup.json';
import regionList from './region.json';

export type GetVeeamBackupMocksParams = {
  isBackupKo?: boolean;
  isRegionKo?: boolean;
  nbBackup?: number;
  nbRegion?: number;
};

const findBackupById = (params: PathParams) =>
  backupList.find(({ id }) => id === params.id);

export const getVeeamBackupMocks = ({
  isBackupKo,
  nbBackup = Number.POSITIVE_INFINITY,
  isRegionKo,
  nbRegion = Number.POSITIVE_INFINITY,
}: GetVeeamBackupMocksParams): Handler[] => [
  {
    url: '/vmwareCloudDirector/backup/:id',
    response: (_, params: PathParams) => findBackupById(params),
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
  {
    url: '/vmwareCloudDirector/reference/region',
    response: isRegionKo
      ? {
          message: 'Region error',
        }
      : regionList.slice(0, nbRegion),
    status: isRegionKo ? 500 : 200,
    api: 'v2',
  },
];
