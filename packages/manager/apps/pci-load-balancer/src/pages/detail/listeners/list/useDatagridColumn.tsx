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
import ActionsComponent from '@/components/detail/listeners/Actions.component';
import { TLoadBalancerListener } from '@/api/data/load-balancer';

export const useDatagridColumn = () => {
  const { t } = useTranslation('octavia-load-balancer');
  const { t: tListeners } = useTranslation('octavia-load-balancer-listeners');

  const columns: DatagridColumn<TLoadBalancerListener>[] = [
    {
      id: 'name',
      cell: (props: TLoadBalancerListener) => (
        <DataGridTextCell>
          <OsdsLink color={ODS_THEME_COLOR_INTENT.primary} href={useHref('')}>
            {props.name}
          </OsdsLink>
        </DataGridTextCell>
      ),
      label: tListeners('octavia_load_balancer_listeners_name'),
    },
    {
      id: 'defaultPoolId',
      cell: (props: TLoadBalancerListener) => (
        <DataGridTextCell>
          <OsdsLink color={ODS_THEME_COLOR_INTENT.primary} href={useHref('')}>
            {props.defaultPoolId}
          </OsdsLink>
        </DataGridTextCell>
      ),
      label: tListeners('octavia_load_balancer_listeners_default_pool'),
    },
    {
      id: 'protocol',
      cell: (props: TLoadBalancerListener) => (
        <DataGridTextCell>{props.protocol}</DataGridTextCell>
      ),
      label: tListeners('octavia_load_balancer_listeners_protocol'),
    },
    {
      id: 'port',
      cell: (props: TLoadBalancerListener) => (
        <DataGridTextCell>{props.port}</DataGridTextCell>
      ),
      label: tListeners('octavia_load_balancer_listeners_port'),
    },
    {
      id: 'provisioningStatus',
      cell: (props: TLoadBalancerListener) => (
        <ProvisioningStatusComponent
          status={props.provisioningStatus}
          className="w-fit flex mx-auto"
        />
      ),
      label: t('octavia_load_balancer_provisioning_status'),
    },
    {
      id: 'operatingStatus',
      cell: (props: TLoadBalancerListener) => (
        <OperatingStatusComponent
          status={props.operatingStatus}
          className="w-fit flex mx-auto"
        />
      ),
      label: t('octavia_load_balancer_operating_status'),
    },
    {
      id: 'actions',
      cell: () => (
        <div className="min-w-16">
          <ActionsComponent />
        </div>
      ),
      label: '',
    },
  ];

  return columns;
};
