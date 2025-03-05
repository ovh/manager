import {
  DatagridColumn,
  DataGridTextCell,
} from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';

import OperatingStatusComponent from '@/components/listing/OperatingStatus.component';
import ProvisioningStatusComponent from '@/components/listing/ProvisioningStatus.component';
import ActionsComponent from '@/pages/detail/listeners/list/Actions.component';
import { TLoadBalancerListener } from '@/api/data/listener';
import DataGridLinkCell from '@/components/datagrid/DataGridLinkCell.component';

export const useDatagridColumn = () => {
  const { t } = useTranslation(['listeners', 'load-balancer']);

  const columns: DatagridColumn<TLoadBalancerListener>[] = [
    {
      id: 'name',
      cell: ({ id, name }: TLoadBalancerListener) => (
        <DataGridLinkCell href={`../${id}/edit`}>{name}</DataGridLinkCell>
      ),
      label: t('octavia_load_balancer_listeners_name'),
    },
    {
      id: 'defaultPoolId',
      cell: ({ defaultPoolId }: TLoadBalancerListener) => (
        <DataGridLinkCell href={`../../pools/${defaultPoolId}`}>
          {defaultPoolId}
        </DataGridLinkCell>
      ),
      label: t('octavia_load_balancer_listeners_default_pool'),
    },
    {
      id: 'protocol',
      cell: (props: TLoadBalancerListener) => (
        <DataGridTextCell>{props.protocol}</DataGridTextCell>
      ),
      label: t('octavia_load_balancer_listeners_protocol'),
    },
    {
      id: 'port',
      cell: (props: TLoadBalancerListener) => (
        <DataGridTextCell>{props.port}</DataGridTextCell>
      ),
      label: t('octavia_load_balancer_listeners_port'),
    },
    {
      id: 'provisioningStatus',
      cell: (props: TLoadBalancerListener) => (
        <ProvisioningStatusComponent
          status={props.provisioningStatus}
          className="w-fit"
        />
      ),
      label: t('load-balancer:octavia_load_balancer_provisioning_status'),
    },
    {
      id: 'operatingStatus',
      cell: (props: TLoadBalancerListener) => (
        <OperatingStatusComponent
          status={props.operatingStatus}
          className="w-fit"
        />
      ),
      label: t('load-balancer:octavia_load_balancer_operating_status'),
      isSortable: false,
    },
    {
      id: 'actions',
      cell: (props: TLoadBalancerListener) => (
        <div className="min-w-16">
          <ActionsComponent listener={props} />
        </div>
      ),
      label: '',
      isSortable: false,
    },
  ];

  return columns;
};
