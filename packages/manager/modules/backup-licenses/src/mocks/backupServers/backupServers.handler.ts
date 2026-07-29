import { Handler } from '@ovh-ux/manager-core-test-utils';

import { mockBackupServers } from '@/mocks/backupServers/backupServers.mock';
import { BackupServerResource } from '@/types/BackupServer.type';

export type TBackupServersMockParams = {
  backupServers?: BackupServerResource[];
  isBackupServersError?: boolean;
  isDeleteBackupServerError?: boolean;
  isEditBackupServerError?: boolean;
};

const BACKUP_SERVERS_URL =
  '/backupServices/tenant/:backupServicesId/vspc/:vspcTenantId/backupLicenses/backupServer';

export const getBackupServersMocks = ({
  backupServers,
  isBackupServersError,
  isDeleteBackupServerError,
  isEditBackupServerError,
}: TBackupServersMockParams): Handler[] => [
  {
    url: BACKUP_SERVERS_URL,
    response: () => (isBackupServersError ? null : (backupServers ?? mockBackupServers)),
    api: 'v2',
    method: 'get',
    status: isBackupServersError ? 500 : 200,
    delay: 0,
  },
  {
    url: `${BACKUP_SERVERS_URL}/:backupServerId`,
    response: () => null,
    api: 'v2',
    method: 'delete',
    status: isDeleteBackupServerError ? 500 : 204,
    delay: 0,
  },
  {
    url: `${BACKUP_SERVERS_URL}/:backupServerId`,
    response: () => null,
    api: 'v2',
    method: 'put',
    status: isEditBackupServerError ? 500 : 200,
    delay: 0,
  },
];
