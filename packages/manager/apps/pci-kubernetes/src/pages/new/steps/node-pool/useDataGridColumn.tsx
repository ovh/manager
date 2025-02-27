import {
  DatagridColumn,
  DataGridTextCell,
} from '@ovh-ux/manager-react-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_CHIP_SIZE, ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { OsdsChip } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { NodePool } from '@/api/data/kubernetes';
import RestrictionAction from '@/components/restriction/RestrictionAction.component';

export const useDatagridColumn = ({
  onDelete,
}: {
  onDelete: (name: string) => void;
}) => {
  const { t } = useTranslation([
    'node-pool',
    'add',
    'kube-nodes',
    'autoscaling',
    'flavor-billing',
    'billing-anti-affinity',
  ]);

  const columns: DatagridColumn<NodePool>[] = [
    {
      id: 'name',
      cell: (props) => <DataGridTextCell>{props.name}</DataGridTextCell>,
      label: t('add:kubernetes_add_name'),
    },

    {
      id: 'localisation',
      cell: (props) => (
        <DataGridTextCell>{props.localisation}</DataGridTextCell>
      ),
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
                props.antiAffinity
                  ? ODS_THEME_COLOR_INTENT.success
                  : ODS_THEME_COLOR_INTENT.error
              }
              inline
              size={ODS_CHIP_SIZE.sm}
            >
              {t(`kube_node_pool_autoscale_${props.antiAffinity}`)}
            </OsdsChip>
          </span>
        </DataGridTextCell>
      ),
      label: t('billing-anti-affinity:kubernetes_node_pool_anti_affinity'),
    },
    {
      id: 'billing',
      cell: (props) => (
        <DataGridTextCell>
          {t(
            `flavor-billing:pci_project_flavors_billing_${
              props.monthlyBilled ? 'monthly' : 'hourly'
            }`,
          )}
        </DataGridTextCell>
      ),
      label: t('kube-nodes:kube_nodes_billing_type'),
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
