import { DatagridColumn, DataGridTextCell } from '@ovhcloud/manager-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { OsdsChip, OsdsIcon, OsdsLink } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { useHref } from 'react-router-dom';
import {
  ODS_CHIP_SIZE,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
} from '@ovhcloud/ods-components';
import { TClusterNodePool } from '@/api/data/node-pools';
import ActionsComponent from './actions.component';

export const useDatagridColumns = () => {
  const { t } = useTranslation('node-pool');
  const { t: tKubeNodes } = useTranslation('kube-nodes');

  const columns: DatagridColumn<TClusterNodePool>[] = [
    {
      id: 'name',
      cell: (pool: TClusterNodePool) => (
        <DataGridTextCell>
          <OsdsLink
            color={ODS_THEME_COLOR_INTENT.primary}
            href={useHref(`${pool.id}/nodes`)}
            className="whitespace-nowrap"
          >
            {pool.name}
          </OsdsLink>
        </DataGridTextCell>
      ),
      label: t('kube_node_pool_name'),
    },
    {
      id: 'flavor',
      cell: (pool: TClusterNodePool) => (
        <DataGridTextCell>
          <span className="whitespace-nowrap">{pool.formattedFlavor}</span>
        </DataGridTextCell>
      ),
      label: tKubeNodes('kube_nodes_flavor'),
    },
    {
      id: 'antiAffinity',
      cell: (pool: TClusterNodePool) => (
        <DataGridTextCell>
          <OsdsIcon
            size={ODS_ICON_SIZE.sm}
            name={pool.antiAffinity ? ODS_ICON_NAME.CHECK : ODS_ICON_NAME.CLOSE}
          />
        </DataGridTextCell>
      ),
      label: t('kube_node_pool_anti_affinity'),
    },
    {
      id: 'numberOfNodes',
      cell: (pool: TClusterNodePool) => (
        <DataGridTextCell>
          {pool.availableNodes}/{pool.desiredNodes}
        </DataGridTextCell>
      ),
      label: t('kube_node_pool_node_count'),
    },
    {
      id: 'autoscale',
      cell: (pool: TClusterNodePool) => (
        <DataGridTextCell>
          <span className="whitespace-nowrap">
            <OsdsChip
              color={
                pool.autoscale
                  ? ODS_THEME_COLOR_INTENT.success
                  : ODS_THEME_COLOR_INTENT.error
              }
              inline
              size={ODS_CHIP_SIZE.sm}
            >
              {t(`kube_node_pool_autoscale_${pool.autoscale}`)}
            </OsdsChip>
            {pool.autoscale &&
              ` (min: ${pool.minNodes} , max: ${pool.maxNodes})`}
          </span>
        </DataGridTextCell>
      ),
      label: 'Autoscaling',
    },
    {
      id: 'monthlyBilled',
      cell: (pool: TClusterNodePool) => (
        <DataGridTextCell>
          <OsdsIcon
            size={ODS_ICON_SIZE.sm}
            name={
              pool.monthlyBilled ? ODS_ICON_NAME.CHECK : ODS_ICON_NAME.CLOSE
            }
          />
        </DataGridTextCell>
      ),
      label: t('kube_node_pool_monthly_billing'),
    },
    {
      id: 'createdAt',
      cell: (pool: TClusterNodePool) => (
        <DataGridTextCell>
          <span className="whitespace-nowrap">{pool.createdAt}</span>
        </DataGridTextCell>
      ),
      label: t('kube_node_pool_creation_date'),
    },
    {
      id: 'status',
      cell: (pool: TClusterNodePool) => (
        <DataGridTextCell>
          <OsdsChip
            color={(() => {
              if (pool.status === 'READY')
                return ODS_THEME_COLOR_INTENT.success;
              if (pool.status === 'ERROR') return ODS_THEME_COLOR_INTENT.error;
              return ODS_THEME_COLOR_INTENT.warning;
            })()}
            inline
            size={ODS_CHIP_SIZE.sm}
          >
            {tKubeNodes(`kube_nodes_status_${pool.status}`)}
          </OsdsChip>
        </DataGridTextCell>
      ),
      label: tKubeNodes('kube_service_cluster_status'),
    },
    {
      id: 'actions',
      cell: (pool: TClusterNodePool) => (
        <div className="min-w-16">
          <ActionsComponent pool={pool} />
        </div>
      ),
      label: '',
    },
  ];

  return columns;
};
