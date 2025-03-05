import {
  DatagridColumn,
  DataGridTextCell,
} from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { TLoadBalancer } from '@/api/data/load-balancer';
import OperatingStatusComponent from '@/components/listing/OperatingStatus.component';
import ProvisioningStatusComponent from '@/components/listing/ProvisioningStatus.component';
import ActionsComponent from '@/components/listing/Actions.component';
import CreationDate from '@/components/listing/CreationDate.component';
import DataGridLinkCell from '@/components/datagrid/DataGridLinkCell.component';

export const useDatagridColumn = () => {
  const { t } = useTranslation('load-balancer');

  const columns: DatagridColumn<TLoadBalancer>[] = [
    {
      id: 'name',
      cell: ({ id, region, name }: TLoadBalancer) => (
        <DataGridLinkCell href={`../${region}/${id}`}>{name}</DataGridLinkCell>
      ),
      label: t('octavia_load_balancer_name'),
    },
    {
      id: 'region',
      cell: (props: TLoadBalancer) => (
        <DataGridTextCell>{props.region}</DataGridTextCell>
      ),
      label: t('octavia_load_balancer_region'),
    },
    {
      id: 'vipAddress',
      cell: (props: TLoadBalancer) => (
        <DataGridTextCell>{props.vipAddress}</DataGridTextCell>
      ),
      label: t('octavia_load_balancer_ip'),
    },
    {
      id: 'createdAt',
      cell: (props: TLoadBalancer) => <CreationDate date={props.createdAt} />,
      label: t('octavia_load_balancer_creation_date'),
    },
    {
      id: 'provisioningStatus',
      cell: (props: TLoadBalancer) => (
        <ProvisioningStatusComponent
          status={props.provisioningStatus}
          className="w-fit"
        />
      ),
      label: t('octavia_load_balancer_provisioning_status'),
    },
    {
      id: 'operatingStatus',
      cell: (props: TLoadBalancer) => (
        <OperatingStatusComponent
          status={props.operatingStatus}
          className="w-fit"
        />
      ),
      label: t('octavia_load_balancer_operating_status'),
    },
    {
      id: 'actions',
      cell: (props: TLoadBalancer) => (
        <div className="min-w-16">
          <ActionsComponent loadBalancer={props} />
        </div>
      ),
      label: '',
      isSortable: false,
    },
  ];

  return columns;
};
