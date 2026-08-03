import React, { useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import { DataGridTextCell, DatagridColumn } from '@ovh-ux/manager-react-components';

import BackupServerActionsCell from '@/components/linked-servers/BackupServerActionsCell/BackupServerActionsCell.component';
import LicenseStatusCell from '@/components/linked-servers/LicenseStatusCell/LicenseStatusCell.component';
import LicenseTypeCell from '@/components/linked-servers/LicenseTypeCell/LicenseTypeCell.component';
import OsTypeCell from '@/components/linked-servers/OsTypeCell/OsTypeCell.component';
import ServerIpsCell from '@/components/linked-servers/ServerIpsCell/ServerIpsCell.component';
import { BACKUP_LICENSES_NAMESPACES, EMPTY_VALUE_PLACEHOLDER } from '@/module.constants';
import { BackupServerResource } from '@/types/BackupServer.type';
import { hasFailedTask, isServerInFlight } from '@/utils/inFlightServer/inFlightServer';

/**
 * Colonnes du tableau « Linked servers », dans l'ordre imposé par le ticket.
 * Toutes non triables : sans `sorting`/`onSortChange` passés au `Datagrid`, un en-tête
 * cliquable ne trierait rien.
 */
export const useLinkedServersColumns = (): DatagridColumn<BackupServerResource>[] => {
  const { t } = useTranslation(BACKUP_LICENSES_NAMESPACES.LINKED_SERVERS);

  return useMemo(
    () => [
      {
        id: 'displayName',
        label: t('column.name'),
        isSortable: false,
        cell: (server: BackupServerResource) => (
          <DataGridTextCell>{server.currentState.displayName}</DataGridTextCell>
        ),
      },
      {
        id: 'externalIps',
        label: t('column.public_ip'),
        isSortable: false,
        cell: (server: BackupServerResource) => (
          <ServerIpsCell ips={server.currentState.externalIps} />
        ),
      },
      {
        id: 'privateIps',
        label: t('column.private_ip'),
        isSortable: false,
        cell: (server: BackupServerResource) => (
          <ServerIpsCell ips={server.currentState.privateIps} />
        ),
      },
      {
        id: 'licenseType',
        label: t('column.license'),
        isSortable: false,
        cell: (server: BackupServerResource) => (
          <LicenseTypeCell
            licenseType={server.currentState.licenseType}
            licenseTypeRequested={server.currentState.licenseTypeRequested}
            isInFlight={isServerInFlight(server)}
          />
        ),
      },
      {
        id: 'licenseStatus',
        label: t('column.license_status'),
        isSortable: false,
        cell: (server: BackupServerResource) => (
          <LicenseStatusCell
            licenseStatus={server.currentState.licenseStatus}
            isInFlight={isServerInFlight(server)}
            hasFailedTask={hasFailedTask(server)}
          />
        ),
      },
      {
        id: 'backupServerVersion',
        label: t('column.vbr_version'),
        isSortable: false,
        cell: (server: BackupServerResource) => (
          <DataGridTextCell>
            {server.currentState.backupServerVersion || EMPTY_VALUE_PLACEHOLDER}
          </DataGridTextCell>
        ),
      },
      {
        id: 'osType',
        label: t('column.os'),
        isSortable: false,
        cell: (server: BackupServerResource) => <OsTypeCell osType={server.currentState.osType} />,
      },
      {
        id: 'actions',
        label: '',
        isSortable: false,
        cell: (server: BackupServerResource) => (
          <BackupServerActionsCell
            backupServerId={server.id}
            isDisabled={isServerInFlight(server)}
          />
        ),
      },
    ],
    [t],
  );
};
