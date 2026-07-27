import { Handler } from '@ovh-ux/manager-core-test-utils';

import { mockBackupServers } from '@/mocks/backupServers/backupServers.mock';
import { BackupServerResource } from '@/types/BackupServer.type';

export type TBackupServersMockParams = {
  backupServers?: BackupServerResource[];
  isBackupServersError?: boolean;
};

export const getBackupServersMocks = ({
  backupServers,
  isBackupServersError,
}: TBackupServersMockParams): Handler[] => [
  {
    url: '/backupServices/tenant/:backupServicesId/vspc/:vspcTenantId/backupLicenses/backupServer',
    response: () => (isBackupServersError ? null : (backupServers ?? mockBackupServers)),
    api: 'v2',
    method: 'get',
    status: isBackupServersError ? 500 : 200,
    delay: 0,
  },
];
