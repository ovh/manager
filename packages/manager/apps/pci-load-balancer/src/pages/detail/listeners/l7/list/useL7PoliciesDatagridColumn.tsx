import {
  DatagridColumn,
  DataGridTextCell,
} from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useHref, useNavigate } from 'react-router-dom';
import { OsdsButton, OsdsIcon, OsdsLink } from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
} from '@ovhcloud/ods-components';
import OperatingStatusComponent from '@/components/listing/OperatingStatus.component';
import ProvisioningStatusComponent from '@/components/listing/ProvisioningStatus.component';
import { TL7Policy } from '@/api/data/l7Policies';
import ActionsComponent from '@/pages/detail/listeners/l7/list/Actions.component';

export const useL7PoliciesDatagridColumn = () => {
  const { t: tLoadBalancer } = useTranslation('load-balancer');
  const { t: tL7Policies } = useTranslation('l7');
  const navigate = useNavigate();

  const columns: DatagridColumn<TL7Policy>[] = [
    {
      id: 'position',
      cell: (props: TL7Policy) => (
        <DataGridTextCell>
          <span className="inline-block align-text-top">
            {props.position}
            <OsdsButton
              className="inline-block align-bottom"
              size={ODS_BUTTON_SIZE.sm}
              color={ODS_THEME_COLOR_INTENT.text}
              variant={ODS_BUTTON_VARIANT.ghost}
              onClick={() => navigate(`../${props.id}/edit`)}
            >
              <OsdsIcon size={ODS_ICON_SIZE.xxs} name={ODS_ICON_NAME.PEN} />
            </OsdsButton>
          </span>
        </DataGridTextCell>
      ),
      label: tL7Policies('octavia_load_balancer_list_l7_policies_position'),
    },
    {
      id: 'name',
      cell: (props: TL7Policy) => (
        <DataGridTextCell>
          <OsdsLink
            color={ODS_THEME_COLOR_INTENT.primary}
            href={useHref(`../${props.id}/edit`)}
          >
            {props.name}
          </OsdsLink>
        </DataGridTextCell>
      ),
      label: tL7Policies('octavia_load_balancer_list_l7_policies_name'),
    },
    {
      id: 'action',
      cell: (props: TL7Policy) => (
        <DataGridTextCell>{props.action}</DataGridTextCell>
      ),
      label: tL7Policies('octavia_load_balancer_list_l7_policies_action'),
    },
    {
      id: 'attribute',
      cell: (props: TL7Policy) => (
        <DataGridTextCell>{props.attribute}</DataGridTextCell>
      ),
      label: tL7Policies('octavia_load_balancer_list_l7_policies_attribute'),
      isSortable: false,
    },
    {
      id: 'redirectHttpCode',
      cell: (props: TL7Policy) => (
        <DataGridTextCell>{props.redirectHttpCode || '-'}</DataGridTextCell>
      ),
      label: tL7Policies(
        'octavia_load_balancer_list_l7_policies_redirect_code',
      ),
      isSortable: false,
    },
    {
      id: 'provisioningStatus',
      cell: (props: TL7Policy) => (
        <ProvisioningStatusComponent
          status={props.provisioningStatus}
          className="w-fit flex mx-auto"
        />
      ),
      label: tLoadBalancer('octavia_load_balancer_provisioning_status'),
      isSortable: false,
    },
    {
      id: 'operatingStatus',
      cell: (props: TL7Policy) => (
        <OperatingStatusComponent
          status={props.operatingStatus}
          className="w-fit flex mx-auto"
        />
      ),
      label: tLoadBalancer('octavia_load_balancer_operating_status'),
      isSortable: false,
    },
    {
      id: 'actions',
      cell: (props: TL7Policy) => (
        <div className="min-w-16">
          <ActionsComponent l7PoliciesId={props.id} />
        </div>
      ),
      label: '',
      isSortable: false,
    },
  ];

  return columns;
};
