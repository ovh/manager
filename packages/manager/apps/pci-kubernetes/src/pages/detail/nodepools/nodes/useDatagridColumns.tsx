import { useTranslation } from 'react-i18next';

import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_CHIP_SIZE } from '@ovhcloud/ods-components';
import { OsdsChip } from '@ovhcloud/ods-components/react';

import { Clipboard, DataGridTextCell, DatagridColumn } from '@ovh-ux/manager-react-components';

import { TNode } from '@/api/data/nodes';

import ActionsComponent from './actions.component';

export const useDatagridColumns = () => {
  const { t: tListing } = useTranslation('listing');
  const { t: tKubeNodes } = useTranslation('kube-nodes');

  const columns: DatagridColumn<TNode>[] = [
    {
      id: 'name',
      cell: (node: TNode) => <DataGridTextCell>{node.name}</DataGridTextCell>,
      label: tKubeNodes('kube_nodes_name'),
    },
    {
      id: 'id',
      cell: (node: TNode) => (
        <DataGridTextCell>
          <Clipboard aria-label="clipboard" value={node.id} />
        </DataGridTextCell>
      ),
      label: tListing('kube_list_id'),
    },
    {
      id: 'flavor',
      cell: (node: TNode) => (
        <DataGridTextCell>
          <span className="whitespace-nowrap">{node.formattedFlavor}</span>
        </DataGridTextCell>
      ),
      label: tKubeNodes('kube_nodes_flavor'),
    },
    {
      id: 'billingType',
      cell: (node: TNode) => (
        <DataGridTextCell>
          {node.billingType && (
            <span className="whitespace-nowrap">
              {tKubeNodes(`kube_nodes_billing_${node.billingType}`)}
            </span>
          )}
        </DataGridTextCell>
      ),
      label: tKubeNodes('kube_nodes_billing_type'),
    },
    {
      id: 'status',
      cell: (node: TNode) => (
        <DataGridTextCell>
          {node.billingType && (
            <OsdsChip
              color={(() => {
                if (node.status === 'READY') return ODS_THEME_COLOR_INTENT.success;
                if (node.status === 'ERROR') return ODS_THEME_COLOR_INTENT.error;
                return ODS_THEME_COLOR_INTENT.warning;
              })()}
              inline
              size={ODS_CHIP_SIZE.sm}
            >
              {tKubeNodes(`kube_nodes_status_${node.status}`)}
            </OsdsChip>
          )}
        </DataGridTextCell>
      ),
      label: tKubeNodes('kube_service_cluster_status'),
    },
    {
      id: 'actions',
      cell: (node: TNode) => (
        <div className="min-w-16">
          <ActionsComponent node={node} />
        </div>
      ),
      label: '',
    },
  ];

  return columns;
};
