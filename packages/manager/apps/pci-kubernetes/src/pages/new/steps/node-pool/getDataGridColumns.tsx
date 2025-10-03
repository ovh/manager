import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_CHIP_SIZE, ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { OsdsChip } from '@ovhcloud/ods-components/react';

import { DataGridTextCell, DatagridColumn } from '@ovh-ux/manager-react-components';

import { NodePool } from '@/api/data/kubernetes';
import RestrictionAction from '@/components/restriction/RestrictionAction.component';
import { MonthlyBilled } from '@/pages/detail/nodepools/useDatagridColumn';

export const getDatagridColumns = ({
  onDelete,
  t,
}: {
  onDelete: (name: string) => void;
  t: (text: string) => string;
}) => {
  const columns: DatagridColumn<NodePool>[] = [
    {
      id: 'name',
      cell: (props) => <DataGridTextCell>{props.name}</DataGridTextCell>,
      label: t('add:kubernetes_add_name'),
    },

    {
      id: 'localisation',
      cell: (props) => <DataGridTextCell>{props.localisation}</DataGridTextCell>,
      label: t('node-pool:kube_common_node_pool_localisation'),
    },
    {
      id: 'model',
      cell: (props) => <DataGridTextCell>{props.flavorName}</DataGridTextCell>,
      label: t('node-pool:kube_common_node_pool_model'),
    },
    {
      id: 'desiredNodes',
      cell: (props) => <DataGridTextCell>{props.desiredNodes}</DataGridTextCell>,
      label: t('node-pool:kube_common_node_pool_desired_node'),
    },
    {
      id: 'autoscaling',
      cell: (props) =>
        props.autoscale ? (
          <DataGridTextCell>
            Min {props.minNodes}, Max {props.maxNodes}
          </DataGridTextCell>
        ) : (
          <DataGridTextCell>
            <span className="whitespace-nowrap">
              <OsdsChip
                color={
                  props.autoscale ? ODS_THEME_COLOR_INTENT.success : ODS_THEME_COLOR_INTENT.error
                }
                inline
                size={ODS_CHIP_SIZE.sm}
              >
                {t(`node-pool:kube_node_pool_autoscale_${props.autoscale}`)}
              </OsdsChip>
            </span>
          </DataGridTextCell>
        ),
      label: t('autoscaling:kubernetes_node_pool_autoscaling_autoscale'),
    },
    {
      id: 'anti-affinity',
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
              {t(`node-pool:kube_node_pool_autoscale_${props.antiAffinity}`)}
            </OsdsChip>
          </span>
        </DataGridTextCell>
      ),
      label: t('billing-anti-affinity:kubernetes_node_pool_anti_affinity'),
    },
    {
      id: 'billing',
      cell: MonthlyBilled,
      label: t('node-pool:kube_node_pool_monthly_billing'),
    },
    {
      id: 'actions',
      cell: (props) => (
        <div className="min-w-16">
          <RestrictionAction
            onClick={() => onDelete(props.name)}
            disabled={false}
            iconName={ODS_ICON_NAME.TRASH}
          />
        </div>
      ),
      label: '',
    },
  ];

  return columns;
};
