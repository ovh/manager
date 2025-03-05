import {
  DatagridColumn,
  DataGridTextCell,
} from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useNavigate } from 'react-router-dom';
import { OsdsButton, OsdsIcon } from '@ovhcloud/ods-components/react';
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
import DataGridLinkCell from '@/components/datagrid/DataGridLinkCell.component';

export const useL7PoliciesDatagridColumn = () => {
  const { t } = useTranslation(['l7', 'load-balancer']);
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
      label: t('octavia_load_balancer_list_l7_policies_position'),
    },
    {
      id: 'name',
      cell: ({ id, name }: TL7Policy) => (
        <DataGridLinkCell href={`../${id}/edit`}>{name}</DataGridLinkCell>
      ),
      label: t('octavia_load_balancer_list_l7_policies_name'),
    },
    {
      id: 'action',
      cell: (props: TL7Policy) => (
        <DataGridTextCell>{props.action}</DataGridTextCell>
      ),
      label: t('octavia_load_balancer_list_l7_policies_action'),
    },
    {
      id: 'attribute',
      cell: (props: TL7Policy) => (
        <DataGridTextCell>{props.attribute}</DataGridTextCell>
      ),
      label: t('octavia_load_balancer_list_l7_policies_attribute'),
      isSortable: false,
    },
    {
      id: 'redirectHttpCode',
      cell: (props: TL7Policy) => (
        <DataGridTextCell>{props.redirectHttpCode || '-'}</DataGridTextCell>
      ),
      label: t('octavia_load_balancer_list_l7_policies_redirect_code'),
      isSortable: false,
    },
    {
      id: 'provisioningStatus',
      cell: (props: TL7Policy) => (
        <ProvisioningStatusComponent
          status={props.provisioningStatus}
          className="w-fit"
        />
      ),
      label: t('load-balancer:octavia_load_balancer_provisioning_status'),
      isSortable: false,
    },
    {
      id: 'operatingStatus',
      cell: (props: TL7Policy) => (
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
