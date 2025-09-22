import { useHref } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_CHIP_SIZE } from '@ovhcloud/ods-components';
import { OsdsChip, OsdsLink } from '@ovhcloud/ods-components/react';

import { DataGridTextCell, DatagridColumn } from '@ovh-ux/manager-react-components';

import { TClusterNodePool } from '@/api/data/node-pools';

import ActionsComponent from './actions.component';

export const MonthlyBilled = ({ monthlyBilled }: { monthlyBilled: boolean }) => {
  const { t } = useTranslation('flavor-billing');
  return (
    <DataGridTextCell>
      {t(`pci_project_flavors_billing_${monthlyBilled ? 'monthly' : 'hourly'}`)}
    </DataGridTextCell>
  );
};

export const useDatagridColumns = () => {
  const { t } = useTranslation([
    'node-pool',
    'add',
    'kube-nodes',
    'autoscaling',
    'flavor-billing',
    'billing-anti-affinity',
  ]);
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
      id: 'location',
      cell: (props) => <DataGridTextCell>{props.location}</DataGridTextCell>,
      label: t('kube_common_node_pool_localisation'),
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
      cell: (pool: TClusterNodePool) =>
        pool.autoscale ? (
          <DataGridTextCell>
            Min {pool.minNodes}, Max {pool.maxNodes}
          </DataGridTextCell>
        ) : (
          <DataGridTextCell>
            <span className="whitespace-nowrap">
              <OsdsChip color={ODS_THEME_COLOR_INTENT.error} inline size={ODS_CHIP_SIZE.sm}>
                {t(`kube_node_pool_autoscale_${pool.autoscale}`)}
              </OsdsChip>
            </span>
          </DataGridTextCell>
        ),
      label: 'Autoscaling',
    },
    {
      id: 'antiAffinity',
      cell: (props) => (
        <DataGridTextCell>
          <span className="whitespace-nowrap">
            <OsdsChip
              color={
                props.antiAffinity ? ODS_THEME_COLOR_INTENT.success : ODS_THEME_COLOR_INTENT.error
              }
              inline
              size={ODS_CHIP_SIZE.sm}
            >
              {t(`kube_node_pool_autoscale_${props.antiAffinity}`)}
            </OsdsChip>
          </span>
        </DataGridTextCell>
      ),
      label: t('kube_node_pool_anti_affinity'),
    },
    {
      id: 'monthlyBilled',
      cell: MonthlyBilled,
      label: t('kube-nodes:kube_nodes_billing_type'),
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
              if (pool.status === 'READY') return ODS_THEME_COLOR_INTENT.success;
              if (pool.status === 'ERROR') return ODS_THEME_COLOR_INTENT.error;
              return ODS_THEME_COLOR_INTENT.warning;
            })()}
            inline
            size={ODS_CHIP_SIZE.sm}
          >
            <span className="whitespace-nowrap">
              {tKubeNodes(`kube_nodes_status_${pool.status}`)}
            </span>
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
