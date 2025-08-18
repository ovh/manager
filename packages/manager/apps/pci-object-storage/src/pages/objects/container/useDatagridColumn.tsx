import {
  DataGridTextCell,
  DatagridColumn,
} from '@ovh-ux/manager-react-components';
import { createSearchParams, useHref, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useBytes } from '@ovh-ux/manager-pci-common';
import { OdsBadge, OdsLink } from '@ovhcloud/ods-components/react';
import { TStorage } from '@/api/data/storages';
import {
  OBJECT_CONTAINER_MODE_LOCAL_ZONE,
  OBJECT_CONTAINER_MODE_MONO_ZONE,
  OBJECT_CONTAINER_MODE_MULTI_ZONES,
} from '@/constants';
import { Actions } from './Actions';
import { useUsers } from '@/api/hooks/useUser';
import { useStorageFeatures } from '@/hooks/useStorageFeatures';

export const useDatagridColumn = () => {
  const { i18n, t } = useTranslation([
    'containers',
    'pci-common',
    'containers/add',
  ]);

  const { formatBytes } = useBytes();
  const { projectId } = useParams();

  const { validUsersWithCredentials } = useUsers(projectId);

  const {
    is3azAvailable,
    isLocalZoneAvailable,
    isPending,
  } = useStorageFeatures();

  const columns: DatagridColumn<TStorage>[] = [
    {
      id: 'name',
      cell: (props: TStorage) => (
        <DataGridTextCell>
          <OdsLink
            color="primary"
            href={useHref({
              pathname: `./dashboard/${props.id || props.name}`,
              search: `?${createSearchParams({
                region: props.region,
              })}`,
            })}
            label={props.name}
          />
        </DataGridTextCell>
      ),
      label: t('pci_projects_project_storages_containers_name_label'),
    },
    {
      id: 'region',
      cell: (props: TStorage) => (
        <DataGridTextCell>{props.region}</DataGridTextCell>
      ),
      label: t('pci_projects_project_storages_containers_region_label'),
    },
    {
      id: 'mode',
      cell: (props: TStorage) => {
        if (props.deploymentMode === OBJECT_CONTAINER_MODE_MULTI_ZONES) {
          return (
            <DataGridTextCell>
              <OdsBadge
                className="chip-3AZ"
                size="sm"
                label={t(
                  'containers/add:pci_projects_project_storages_containers_add_deployment_mode_region-3-az_label',
                )}
              />
            </DataGridTextCell>
          );
        }
        if (props.deploymentMode === OBJECT_CONTAINER_MODE_MONO_ZONE) {
          return (
            <DataGridTextCell>
              <OdsBadge
                className="chip-1AZ"
                size="sm"
                label={
                  !isPending && isLocalZoneAvailable && is3azAvailable
                    ? t(
                        'containers/add:pci_projects_project_storages_containers_add_deployment_mode_region_label',
                      )
                    : props.mode
                }
              />
            </DataGridTextCell>
          );
        }
        if (props.deploymentMode === OBJECT_CONTAINER_MODE_LOCAL_ZONE) {
          return (
            <DataGridTextCell>
              <OdsBadge
                color="information"
                size="sm"
                label={t(
                  'containers/add:pci_projects_project_storages_containers_add_deployment_mode_localzone_label',
                )}
              />
            </DataGridTextCell>
          );
        }
        return undefined;
      },
      label: t(
        'pci_projects_project_storages_containers_deployment_mode_label',
      ),
    },
    {
      id: 'offer',
      cell: (props: TStorage) => (
        <DataGridTextCell>{props.offer}</DataGridTextCell>
      ),
      label: t('pci_projects_project_storages_containers_offer_label'),
    },
    {
      id: 'containerCount',
      cell: (props: TStorage) => (
        <DataGridTextCell>
          {props.deploymentMode === OBJECT_CONTAINER_MODE_LOCAL_ZONE
            ? 'n/a'
            : props.containerCount}
        </DataGridTextCell>
      ),
      label: t('pci_projects_project_storages_containers_storedObjects_label'),
    },
    {
      id: 'usedSpace',
      cell: (props: TStorage) => {
        if (props.usedSpace > 0) {
          return (
            <DataGridTextCell>
              {formatBytes(props.usedSpace, 2, 1024)}
            </DataGridTextCell>
          );
        }
        if (props.deploymentMode === OBJECT_CONTAINER_MODE_LOCAL_ZONE) {
          return <DataGridTextCell>n/a</DataGridTextCell>;
        }
        return <DataGridTextCell>-</DataGridTextCell>;
      },
      label: t('pci_projects_project_storages_containers_storedBytes_label'),
    },
    {
      id: 'containerType',
      cell: (props: TStorage) => {
        if (
          i18n.exists(
            `containers:pci_projects_project_storages_containers_containerType_${props.containerType}`,
          )
        ) {
          return (
            <DataGridTextCell>
              {t(
                `pci_projects_project_storages_containers_containerType_${props.containerType}`,
              )}
            </DataGridTextCell>
          );
        }
        return undefined;
      },
      label: t('pci_projects_project_storages_containers_containerType_label'),
    },
    {
      id: 'actions',
      cell: (props: TStorage) => (
        <Actions
          storage={props}
          isEmptyUsers={validUsersWithCredentials?.length === 0}
        />
      ),
      label: '',
      isSortable: false,
    },
  ];

  return columns;
};
