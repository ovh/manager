import React from 'react';
import {
  DashboardTile,
  Description,
  useServiceDetails,
} from '@ovh-ux/manager-react-components';
import {
  OsdsChip,
  OsdsIcon,
  OsdsLink,
  OsdsSkeleton,
  OsdsTooltip,
  OsdsTooltipContent,
} from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_CHIP_SIZE,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
} from '@ovhcloud/ods-components';
import useCurrentUser from '@/hooks/user/useCurrentUser';

type TBillingTileProps = {
  id: string;
};

function ServiceRenew({ id }: TBillingTileProps) {
  const { data: billingService, isLoading } = useServiceDetails({
    resourceName: id,
  });
  const { dateTimeFormat } = useCurrentUser();

  const nextBillingDate = billingService?.data?.billing?.nextBillingDate;

  if (isLoading) {
    return <OsdsSkeleton />;
  }

  return nextBillingDate ? (
    <Description>
      {dateTimeFormat?.format(new Date(nextBillingDate))}
    </Description>
  ) : (
    <span>-</span>
  );
}

export default function BillingTile({ id }: TBillingTileProps) {
  const { t } = useTranslation('dashboard');
  const { user } = useCurrentUser();

  return (
    <div className="h-fit">
      <DashboardTile
        title={t('managed_vcd_dashboard_service_management')}
        items={[
          {
            id: 'mailingList',
            label: t('managed_vcd_dashboard_mailing_list'),
            value: <Description>{user?.email}</Description>,
          },
          {
            id: 'serviceRenew',
            label: t('managed_vcd_dashboard_service_renew'),
            value: <ServiceRenew id={id} />,
          },
          {
            id: 'cancellation',
            label: t('managed_vcd_dashboard_service_cancellation'),
            value: (
              <OsdsChip
                inline
                color={ODS_THEME_COLOR_INTENT.primary}
                className="ml-3"
                size={ODS_CHIP_SIZE.sm}
              >
                {t('managed_vcd_dashboard_coming_soon')}
              </OsdsChip>
            ),
          },
          {
            id: 'password',
            label: t('managed_vcd_dashboard_password'),
            value: (
              <div className="flex-wrap">
                <div className="flex items-center gap-x-2">
                  <OsdsLink disabled>
                    {t('managed_vcd_dashboard_password_renew')}
                  </OsdsLink>
                  <OsdsTooltip className="flex items-center">
                    <OsdsIcon
                      className="cursor-pointer"
                      name={ODS_ICON_NAME.HELP}
                      size={ODS_ICON_SIZE.xxs}
                      color={ODS_THEME_COLOR_INTENT.text}
                    />
                    <OsdsTooltipContent
                      slot="tooltip-content"
                      className="break-normal"
                    >
                      {t('managed_vcd_dashboard_password_tooltip')}
                    </OsdsTooltipContent>
                  </OsdsTooltip>
                </div>
                <OsdsChip
                  inline
                  color={ODS_THEME_COLOR_INTENT.primary}
                  className="ml-3"
                  size={ODS_CHIP_SIZE.sm}
                >
                  {t('managed_vcd_dashboard_coming_soon')}
                </OsdsChip>
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
