import { ReactNode } from 'react';

import { ODS_ICON_NAME } from '@ovhcloud/ods-components';

import { DataGridTextCell, DatagridColumn } from '@ovh-ux/manager-react-components';

import { NodePool } from '@/api/data/kubernetes';
import StatusChip from '@/components/StatusChip';
import RestrictionAction from '@/components/restriction/RestrictionAction.component';
import { MonthlyBilled } from '@/pages/detail/nodepools/useDatagridColumn';
import { ResourceStatus } from '@/types';

const TextCell = ({ children }: { children: ReactNode }) => (
  <DataGridTextCell>{children}</DataGridTextCell>
);

const AutoscalingCell = ({
  maxNodes,
  minNodes,
  autoscale,
}: {
  maxNodes?: number;
  minNodes?: number;
  autoscale: boolean;
}) => (
  <TextCell>
    {autoscale ? `Min ${minNodes}, Max ${maxNodes}` : <StatusChip label={'DISABLED'} />}
  </TextCell>
);

const createTextColumn = (
  id: string,
  accessor: (props: NodePool) => ReactNode,
  labelKey: string,
  t: (text: string) => string,
): DatagridColumn<NodePool> => ({
  id,
  cell: (props) => <TextCell>{accessor(props)}</TextCell>,
  label: t(labelKey),
});

export const getDatagridColumns = ({
  onDelete,
  t,
  showFloatingIp = false,
}: {
  onDelete: (name: string) => void;
  t: (text: string) => string;
  showFloatingIp: boolean;
}) => {
  const columns: DatagridColumn<NodePool>[] = [
    createTextColumn('name', (props) => props.name, 'add:kubernetes_add_name', t),
    createTextColumn(
      'localisation',
      (props) => props.localisation,
      'node-pool:kube_common_node_pool_localisation',
      t,
    ),
    createTextColumn(
      'model',
      (props) => props.flavorName,
      'node-pool:kube_common_node_pool_model',
      t,
    ),
    createTextColumn(
      'desiredNodes',
      (props) => props.desiredNodes,
      'node-pool:kube_common_node_pool_desired_node',
      t,
    ),
    {
      id: 'autoscaling',
      cell: (props) => (
        <AutoscalingCell
          minNodes={props.minNodes}
          maxNodes={props.maxNodes}
          autoscale={props.autoscale}
        />
      ),
      label: t('autoscaling:kubernetes_node_pool_autoscaling_autoscale'),
    },
    {
      id: 'anti-affinity',
      cell: (props) => (
        <TextCell>
          <StatusChip
            label={props.antiAffinity ? ResourceStatus.ENABLED : ResourceStatus.DISABLED}
          />
        </TextCell>
      ),
      label: t('billing-anti-affinity:kubernetes_node_pool_anti_affinity'),
    },
    ...(showFloatingIp
      ? [
          {
            id: 'floating-ip',
            cell: (props: NodePool) => (
              <TextCell>
                <StatusChip
                  label={
                    props.attachFloatingIps?.enabled
                      ? ResourceStatus.ENABLED
                      : ResourceStatus.DISABLED
                  }
                />
              </TextCell>
            ),
            label: 'Floating IPs',
          },
        ]
      : []),
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
