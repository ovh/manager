import {
  DatagridColumn,
  DataGridTextCell,
} from '@ovh-ux/manager-react-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { OsdsLink } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { useHref } from 'react-router-dom';

import OperatingStatusComponent from '@/components/listing/OperatingStatus.component';
import ProvisioningStatusComponent from '@/components/listing/ProvisioningStatus.component';
import ActionsComponent from './Actions.component';
import { TLoadBalancerPool } from '@/api/data/pool';

export const useDatagridColumn = () => {
  const { t } = useTranslation('load-balancer');
  const { t: tPools } = useTranslation('pools');

  const columns: DatagridColumn<TLoadBalancerPool>[] = [
    {
      id: 'name',
      cell: (props: TLoadBalancerPool) => (
        <DataGridTextCell>
          <OsdsLink
            color={ODS_THEME_COLOR_INTENT.primary}
            href={useHref(`../${props.id}`)}
          >
            {props.name}
          </OsdsLink>
        </DataGridTextCell>
      ),
      label: tPools('octavia_load_balancer_pools_name'),
    },
    {
      id: 'protocol',
      cell: (props: TLoadBalancerPool) => (
        <DataGridTextCell>{props.protocol}</DataGridTextCell>
      ),
      label: tPools('octavia_load_balancer_pools_protocol'),
    },
    {
      id: 'algorithm',
      cell: (props: TLoadBalancerPool) => (
        <DataGridTextCell>
          {tPools(
            `octavia_load_balancer_pools_enum_algorithm_${props.algorithm}`,
          )}
        </DataGridTextCell>
      ),
      label: tPools('octavia_load_balancer_pools_algorithm'),
    },
    {
      id: 'provisioningStatus',
      cell: (props: TLoadBalancerPool) => (
        <ProvisioningStatusComponent
          status={props.provisioningStatus}
          className="w-fit flex mx-auto"
        />
      ),
      label: t('octavia_load_balancer_provisioning_status'),
    },
    {
      id: 'operatingStatus',
      cell: (props: TLoadBalancerPool) => (
        <OperatingStatusComponent
          status={props.operatingStatus}
          className="w-fit flex mx-auto"
        />
      ),
      label: t('octavia_load_balancer_operating_status'),
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
