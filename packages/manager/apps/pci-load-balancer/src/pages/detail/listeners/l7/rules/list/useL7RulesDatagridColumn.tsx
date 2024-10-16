import {
  DatagridColumn,
  DataGridTextCell,
} from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { ODS_ICON_NAME, ODS_ICON_SIZE } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { OsdsIcon } from '@ovhcloud/ods-components/react';
import OperatingStatusComponent from '@/components/listing/OperatingStatus.component';
import ProvisioningStatusComponent from '@/components/listing/ProvisioningStatus.component';
import ActionsComponent from '@/pages/detail/listeners/l7/rules/list/Actions.component';
import { TL7Rule } from '@/api/data/l7Rules';

export const useL7RulesDatagridColumn = () => {
  const { t: tLoadBalancer } = useTranslation('load-balancer');
  const { t: tL7Policies } = useTranslation('l7/rules/list');
  const columns: DatagridColumn<TL7Rule>[] = [
    {
      id: 'ruleType',
      cell: (props: TL7Rule) => (
        <DataGridTextCell>{props.ruleType}</DataGridTextCell>
      ),
      label: tL7Policies('octavia_load_balancer_list_l7_rules_type'),
    },
    {
      id: 'compareType',
      cell: (props: TL7Rule) => (
        <DataGridTextCell>{props.compareType}</DataGridTextCell>
      ),
      label: tL7Policies('octavia_load_balancer_list_l7_rules_comparison_type'),
    },
    {
      id: 'key',
      cell: (props: TL7Rule) => (
        <DataGridTextCell>{props.key}</DataGridTextCell>
      ),
      label: tL7Policies('octavia_load_balancer_list_l7_rules_key'),
    },
    {
      id: 'value',
      cell: (props: TL7Rule) => (
        <DataGridTextCell>{props.value}</DataGridTextCell>
      ),
      label: tL7Policies('octavia_load_balancer_list_l7_rules_value'),
    },
    {
      id: 'invert',
      cell: (props: TL7Rule) => (
        <DataGridTextCell>
          {props.invert ? (
            <OsdsIcon
              name={ODS_ICON_NAME.CHECK}
              color={ODS_THEME_COLOR_INTENT.text}
              size={ODS_ICON_SIZE.xxs}
            />
          ) : (
            '-'
          )}
        </DataGridTextCell>
      ),
      label: tL7Policies('octavia_load_balancer_list_l7_rules_invert'),
    },
    {
      id: 'provisioningStatus',
      cell: (props: TL7Rule) => (
        <ProvisioningStatusComponent
          status={props.provisioningStatus}
          className="w-fit flex mx-auto"
        />
      ),
      label: tLoadBalancer('octavia_load_balancer_provisioning_status'),
    },
    {
      id: 'operatingStatus',
      cell: (props: TL7Rule) => (
        <OperatingStatusComponent
          status={props.operatingStatus}
          className="w-fit flex mx-auto"
        />
      ),
      label: tLoadBalancer('octavia_load_balancer_operating_status'),
    },
    {
      id: 'actions',
      cell: (props: TL7Rule) => (
        <div className="min-w-16">
          <ActionsComponent l7RulesId={props.id} />
        </div>
      ),
      label: '',
      isSortable: false,
    },
  ];

  return columns;
};
