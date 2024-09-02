import React from 'react';
import {
  DashboardTile,
  Description,
  Links,
} from '@ovhcloud/manager-components';
import { OsdsChip, OsdsLink } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_CHIP_SIZE } from '@ovhcloud/ods-components';
import useManagedVcdService from '@/data/hooks/useManagedVcdService';
import useCurrentUser from '@/hooks/user/useCurrentUser';

type TBillingTileProps = {
  id: string;
};

export default function BillingTile({ id }: TBillingTileProps) {
  const { t } = useTranslation('dashboard');

  const { user, dateTimeFormat } = useCurrentUser();
  const { data: billingService } = useManagedVcdService(id);

  const nextBillingDate = billingService?.data?.billing?.nextBillingDate;

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
            value: nextBillingDate ? (
              <Links
                onClickReturn={() => {}}
                label={dateTimeFormat?.format(new Date(nextBillingDate))}
              />
            ) : (
              <span>-</span>
            ),
          },
          {
            id: 'password',
            label: t('managed_vcd_dashboard_password'),
            value: (
              <div className="flex-wrap">
                <OsdsLink disabled>
                  {t('managed_vcd_dashboard_password_renew')}
                </OsdsLink>
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
