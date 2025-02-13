import {
  DatagridColumn,
  DataGridTextCell,
} from '@ovh-ux/manager-react-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_CHIP_SIZE } from '@ovhcloud/ods-components';
import { OsdsChip } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import ActionsComponent from '@/components/listing/actions.component';
import { TKube } from '@/types';

import { NodePool } from '@/api/data/kubernetes';

export const useDatagridColumn = () => {
  const { t } = useTranslation([
    'node-pool',
    'kube-nodes',
    'autoscaling',
    'flavor-billing',
  ]);

  const columns: DatagridColumn<NodePool>[] = [
    {
      id: 'name',
      cell: (props) => <DataGridTextCell>{props.name}</DataGridTextCell>,
      label: t('kube_list_name'),
    },

    {
      id: 'localisation',
      cell: (props) => <DataGridTextCell>{props.region}</DataGridTextCell>,
      label: t('kube_common_node_pool_localisation'),
    },
    {
      id: 'model',
      cell: (props) => <DataGridTextCell>{props.flavorName}</DataGridTextCell>,
      label: t('kube_common_node_pool_model'),
    },
    {
      id: 'desiredNodes',
      cell: (props) => (
        <DataGridTextCell>{props.desiredNodes}</DataGridTextCell>
      ),
      label: t('kube_common_node_pool_desired_node'),
    },
    {
      id: 'autoscaling',
      cell: (props) => (
        <DataGridTextCell>
          <DataGridTextCell>
            <span className="whitespace-nowrap">
              <OsdsChip
                color={
                  props.autoscale
                    ? ODS_THEME_COLOR_INTENT.success
                    : ODS_THEME_COLOR_INTENT.error
                }
                inline
                size={ODS_CHIP_SIZE.sm}
              >
                {t(`kube_node_pool_autoscale_${props.autoscale}`)}
              </OsdsChip>
            </span>
          </DataGridTextCell>
        </DataGridTextCell>
      ),
      label: t('autoscaling:kubernetes_node_pool_autoscaling_autoscale'),
    },
    {
      id: 'anti-affinity',
      cell: (props) => (
        <DataGridTextCell>
          <OsdsChip className="w-fit" data-testid="clusterStatus-chip">
            {props.antiAffinity}
          </OsdsChip>
        </DataGridTextCell>
      ),
      label: t('autoscaling:kubernetes_node_pool_autoscaling_autoscale'),
    },
    {
      id: 'billing',
      cell: (props) => (
        <DataGridTextCell>
          {t(
            props.monthlyBilled
              ? 'flavor-billing:pci_project_flavors_billing_monthly'
              : 'flavor-billing:pci_project_flavors_billing_hourly',
          )}
        </DataGridTextCell>
      ),
      label: t('kube-nodes:kube_nodes_billing_type'),
    },
    {
      id: 'actions',
      cell: (props: TKube) => (
        <div className="min-w-16">
          <ActionsComponent kubeId={props.id} />
        </div>
      ),
      label: '',
    },
  ];

  return columns;
};
