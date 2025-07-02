import {
  DataGridTextCell,
  DateFormat,
  useFormattedDate,
} from '@ovh-ux/manager-react-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_TYPE,
  ODS_BUTTON_VARIANT,
} from '@ovhcloud/ods-components';
import {
  OsdsButton,
  OsdsPopover,
  OsdsPopoverContent,
} from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import InstanceDetailPopover from './InstanceDetailPopover.component';

export type TInstanceConsumptionDetail = {
  instanceId: string;
  instanceName: string;
  total: string;
  region: string;
  reference: string;
  imageType: string;
  vmType: string;
  isDeleted: boolean;
  monthlyBilling?: {
    since: string;
    status: string;
  };
  planCode?: string;
  monthlyPlan: string[];
};

export type UseInstanceListColumnsProps = {
  colNameLabel: string;
  colTotalLabel: string;
  showAdditionalInstanceDetails?: boolean;
  isMonthlyInstances?: boolean;
};

export function useInstanceListColumns({
  colNameLabel,
  colTotalLabel,
  showAdditionalInstanceDetails = false,
  isMonthlyInstances = false,
}: UseInstanceListColumnsProps) {
  const { t } = useTranslation('consumption/hourly-instance/instance');
  const navigate = useNavigate();
  // TO DISPLAY CONFIRM MONTHLY PAYMENT BUTTON
  const displayUpdateToMonthlyBillingButton = (
    instanceConsumption: TInstanceConsumptionDetail,
  ) =>
    !isMonthlyInstances &&
    !instanceConsumption.isDeleted &&
    instanceConsumption.monthlyPlan;

  return [
    {
      id: 'name',
      cell: (row: TInstanceConsumptionDetail) => (
        <OsdsPopover>
          <div slot="popover-trigger" className="cursor-pointer">
            {row.instanceName}
          </div>
          <OsdsPopoverContent>
            <InstanceDetailPopover row={row} />
          </OsdsPopoverContent>
        </OsdsPopover>
      ),
      label: colNameLabel,
    },
    {
      id: 'consumption',
      cell: (row: TInstanceConsumptionDetail) => (
        <div>
          <DataGridTextCell>{row.total}</DataGridTextCell>
        </div>
      ),
      label: colTotalLabel,
    },
    (!isMonthlyInstances || showAdditionalInstanceDetails) && {
      id: 'action',
      cell: (row: TInstanceConsumptionDetail) => (
        <div className="min-w-[16rem]">
          {['ok', 'resized'].includes(row.monthlyBilling?.status ?? '') && (
            <DataGridTextCell>
              {t('cpbc_hourly_instance_monthly_billing_since', {
                since: useFormattedDate({
                  dateString: row.monthlyBilling?.since ?? '',
                  format: DateFormat.compact,
                }),
              })}
            </DataGridTextCell>
          )}
          {row.monthlyBilling?.status === 'activationPending' && (
            <DataGridTextCell>
              {t('cpbc_hourly_instance_monthly_billing_activationPending')}
            </DataGridTextCell>
          )}
          {!row.monthlyBilling && row.isDeleted && (
            <DataGridTextCell className="opacity-50">
              {t('cpbc_hourly_instance_deleted')}
            </DataGridTextCell>
          )}

          {displayUpdateToMonthlyBillingButton(row) && (
            <OsdsButton
              color={ODS_THEME_COLOR_INTENT.primary}
              type={ODS_BUTTON_TYPE.button}
              size={ODS_BUTTON_SIZE.sm}
              variant={ODS_BUTTON_VARIANT.stroked}
              onClick={() => navigate(`./monthly?instanceId=${row.instanceId}`)}
            >
              {t('cpbc_hourly_instance_pass_to_monthly')}
            </OsdsButton>
          )}
        </div>
      ),
      label: '',
    },
  ].filter(Boolean);
}
