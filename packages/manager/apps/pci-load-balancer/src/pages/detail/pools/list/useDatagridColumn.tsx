import {
  DatagridColumn,
  DataGridTextCell,
} from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';

import OperatingStatusComponent from '@/components/listing/OperatingStatus.component';
import ProvisioningStatusComponent from '@/components/listing/ProvisioningStatus.component';
import ActionsComponent from './Actions.component';
import { TLoadBalancerPool } from '@/api/data/pool';
import DataGridLinkCell from '@/components/datagrid/DataGridLinkCell.component';

export const useDatagridColumn = () => {
  const { t } = useTranslation(['pools', 'load-balancer']);

  const columns: DatagridColumn<TLoadBalancerPool>[] = [
    {
      id: 'name',
      cell: ({ id, name }: TLoadBalancerPool) => (
        <DataGridLinkCell href={`../${id}`}>{name}</DataGridLinkCell>
      ),
      label: t('octavia_load_balancer_pools_name'),
    },
    {
      id: 'protocol',
      cell: (props: TLoadBalancerPool) => (
        <DataGridTextCell>{props.protocol}</DataGridTextCell>
      ),
      label: t('octavia_load_balancer_pools_protocol'),
    },
    {
      id: 'algorithm',
      cell: (props: TLoadBalancerPool) => (
        <DataGridTextCell>
          {t(`octavia_load_balancer_pools_enum_algorithm_${props.algorithm}`)}
        </DataGridTextCell>
      ),
      label: t('octavia_load_balancer_pools_algorithm'),
    },
    {
      id: 'provisioningStatus',
      cell: (props: TLoadBalancerPool) => (
        <ProvisioningStatusComponent
          status={props.provisioningStatus}
          className="w-fit"
        />
      ),
      label: t('load-balancer:octavia_load_balancer_provisioning_status'),
    },
    {
      id: 'operatingStatus',
      cell: (props: TLoadBalancerPool) => (
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
      cell: (props: TLoadBalancerPool) => (
        <div className="min-w-16">
          <ActionsComponent pool={props} />
        </div>
      ),
      label: '',
      isSortable: false,
    },
  ];

  return columns;
};
