import React from 'react';
import { CommonTitle, Description, Links } from '@ovhcloud/manager-components';
import {
  OsdsChip,
  OsdsDivider,
  OsdsLink,
  OsdsTile,
} from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_CHIP_SIZE } from '@ovhcloud/ods-components';
import TileSubtitle from '../tile-subtitle/TileSubtitle.component';
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
    <OsdsTile>
      <div className="flex flex-col w-full">
        <CommonTitle>
          {t('managed_vcd_dashboard_service_management')}
        </CommonTitle>
        <OsdsDivider separator />
        <TileSubtitle>{t('managed_vcd_dashboard_mailing_list')}</TileSubtitle>
        <Description>{user?.email}</Description>
        <OsdsDivider separator />
        <TileSubtitle>{t('managed_vcd_dashboard_service_renew')}</TileSubtitle>
        {nextBillingDate ? (
          <Links
            onClickReturn={() => {}}
            label={dateTimeFormat?.format(new Date(nextBillingDate))}
          />
        ) : (
          <span>-</span>
        )}
        <OsdsDivider separator />
        <TileSubtitle>{t('managed_vcd_dashboard_password')}</TileSubtitle>
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
      </div>
    </OsdsTile>
  );
}
