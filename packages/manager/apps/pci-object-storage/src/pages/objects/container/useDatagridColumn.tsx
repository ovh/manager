import {
  DataGridTextCell,
  DatagridColumn,
} from '@ovh-ux/manager-react-components';
import { createSearchParams, useNavigate } from 'react-router-dom';
import { OsdsChip, OsdsLink } from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useTranslation } from 'react-i18next';
import { ODS_CHIP_SIZE } from '@ovhcloud/ods-components';
import { useBytes } from '@ovh-ux/manager-pci-common';
import { TStorage } from '@/api/data/storages';
import {
  OBJECT_CONTAINER_MODE_LOCAL_ZONE,
  OBJECT_CONTAINER_MODE_MONO_ZONE,
  OBJECT_CONTAINER_MODE_MULTI_ZONES,
} from '@/constants';
import { Actions } from './Actions';

export const useDatagridColumn = () => {
  const { i18n, t } = useTranslation(['pci-storages-containers', 'pci-common']);
  const navigate = useNavigate();
  const { formatBytes } = useBytes();

  const columns: DatagridColumn<TStorage>[] = [
    {
      id: 'name',
      cell: (props: TStorage) => (
        <DataGridTextCell>
          <OsdsLink
            color={ODS_THEME_COLOR_INTENT.primary}
            onClick={() =>
              navigate({
                pathname: `./${props.name}`,
                search: `?${createSearchParams({
                  region: props.region,
                })}`,
              })
            }
          >
            {props.name}
          </OsdsLink>
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
              <OsdsChip
                color={ODS_THEME_COLOR_INTENT.promotion}
                inline
                size={ODS_CHIP_SIZE.sm}
              >
                {props.mode}
              </OsdsChip>
            </DataGridTextCell>
          );
        }
        if (props.deploymentMode === OBJECT_CONTAINER_MODE_MONO_ZONE) {
          return (
            <DataGridTextCell>
              <OsdsChip
                color={ODS_THEME_COLOR_INTENT.info}
                inline
                size={ODS_CHIP_SIZE.sm}
              >
                {props.mode}
              </OsdsChip>
            </DataGridTextCell>
          );
        }
        if (props.deploymentMode === OBJECT_CONTAINER_MODE_LOCAL_ZONE) {
          return (
            <DataGridTextCell>
              <OsdsChip
                color={ODS_THEME_COLOR_INTENT.promotion}
                inline
                size={ODS_CHIP_SIZE.sm}
              >
                {props.mode}
              </OsdsChip>
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
      id: 'storedObjects',
      cell: (props: TStorage) => (
        <DataGridTextCell>
          {props.deploymentMode === OBJECT_CONTAINER_MODE_LOCAL_ZONE
            ? 'n/a'
            : props.storedObjects}
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
      cell: (props: TStorage) => <Actions storage={props} />,
      label: '',
      isSortable: false,
    },
  ];

  return columns;
};
