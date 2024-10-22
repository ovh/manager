import {
  DatagridColumn,
  DataGridTextCell,
} from '@ovh-ux/manager-react-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { OsdsLink } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { useHref } from 'react-router-dom';
import { TLoadBalancer } from '@/api/data/load-balancer';
import OperatingStatusComponent from '@/components/listing/OperatingStatus.component';
import ProvisioningStatusComponent from '@/components/listing/ProvisioningStatus.component';
import ActionsComponent from '@/components/listing/Actions.component';
import CreationDate from '@/components/listing/CreationDate.component';

export const useDatagridColumn = () => {
  const { t } = useTranslation('load-balancer');

  const columns: DatagridColumn<TLoadBalancer>[] = [
    {
      id: 'name',
      cell: (props: TLoadBalancer) => (
        <DataGridTextCell>
          <OsdsLink
            color={ODS_THEME_COLOR_INTENT.primary}
            href={useHref(`../${props.region}/${props.id}`)}
          >
            {props.name}
          </OsdsLink>
        </DataGridTextCell>
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
