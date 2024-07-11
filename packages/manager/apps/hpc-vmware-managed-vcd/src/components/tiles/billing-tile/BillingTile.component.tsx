import React from 'react';
import { CommonTitle, Description, Links } from '@ovhcloud/manager-components';
import { OsdsDivider, OsdsTile } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import TileSubtitle from '../tile-subtitle/TileSubtitle.component';
import useManagedVcdService from '@/data/hooks/useManagedVcdService';
import { TGetVcdServiceIdParams } from '@/data/api/hpc-vmware-managed-vcd-service';
import useCurrentUser from '@/hooks/user/useCurrentUser';

export default function BillingTile({ id }: TGetVcdServiceIdParams) {
  const { t } = useTranslation('dashboard');

  const { user, dateTimeFormat } = useCurrentUser();
  const { data: billingService } = useManagedVcdService(id);

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
        <Links
          onClickReturn={() => {}}
          label={dateTimeFormat?.format(
            // new Date(billingService.data.billing.nextBillingDate),
            new Date(),
          )}
        />
        <OsdsDivider separator />
        <TileSubtitle>{t('managed_vcd_dashboard_password')}</TileSubtitle>
        <Links
          onClickReturn={() => {}}
          label={t('managed_vcd_dashboard_password_renew')}
        />
      </div>
    </OsdsTile>
  );
}
