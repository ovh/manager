import {
  DatagridColumn,
  DataGridTextCell,
} from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import OperatingStatusComponent from '@/components/listing/OperatingStatus.component';
import ProvisioningStatusComponent from '@/components/listing/ProvisioningStatus.component';
import ActionsComponent from '@/components/detail/listeners/l7/rules/Actions.component';
import { TPoolMember } from '@/api/data/pool-member';

export const usePoolMemberDatagridColumn = () => {
  const { t: tLoadBalancer } = useTranslation('octavia-load-balancer');
  const { t: tPoolMembers } = useTranslation('pools/members/list');
  const columns: DatagridColumn<TPoolMember>[] = [
    {
      id: 'name',
      cell: (props: TPoolMember) => (
        <DataGridTextCell>{props.name}</DataGridTextCell>
      ),
      label: tPoolMembers('octavia_load_balancer_pools_detail_members_name'),
    },
    {
      id: 'address',
      cell: (props: TPoolMember) => (
        <DataGridTextCell>{props.address}</DataGridTextCell>
      ),
      label: tPoolMembers('octavia_load_balancer_pools_detail_members_address'),
    },
    {
      id: 'protocolPort',
      cell: (props: TPoolMember) => (
        <DataGridTextCell>{props.protocolPort}</DataGridTextCell>
      ),
      label: tPoolMembers(
        'octavia_load_balancer_pools_detail_members_protocol_port',
      ),
    },
    {
      id: 'provisioningStatus',
      cell: (props: TPoolMember) => (
        <ProvisioningStatusComponent
          status={props.provisioningStatus}
          className="w-fit flex mx-auto"
        />
      ),
      label: tLoadBalancer('octavia_load_balancer_provisioning_status'),
    },
    {
      id: 'operatingStatus',
      cell: (props: TPoolMember) => (
        <OperatingStatusComponent
          status={props.operatingStatus}
          className="w-fit flex mx-auto"
        />
      ),
      label: tLoadBalancer('octavia_load_balancer_operating_status'),
    },
    {
      id: 'actions',
      cell: (props: TPoolMember) => (
        <div className="min-w-16">
          <ActionsComponent l7RulesId={props.id} />
        </div>
      ),
      label: '',
    },
  ];

  return columns;
};
