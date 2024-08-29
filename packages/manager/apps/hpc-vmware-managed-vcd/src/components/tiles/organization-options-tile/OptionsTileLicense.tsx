import { ActionMenu, Description } from '@ovhcloud/manager-components';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import useManagedVcdOrganization from '@/data/hooks/useManagedVcdOrganization';
import TileSubtitle from '../tile-subtitle/TileSubtitle.component';

export default function OptionsTileLicense() {
  const { t } = useTranslation('dashboard');
  const { id } = useParams();
  const { data: vcdOrganization } = useManagedVcdOrganization(id);
  const isLicenseActive = vcdOrganization?.data?.currentState?.spla;

  return isLicenseActive ? (
    <>
      <TileSubtitle>{t('managed_vcd_dashboard_windows_license')}</TileSubtitle>
      <Description>
        {t('managed_vcd_dashboard_windows_license_active')}
      </Description>
    </>
  ) : (
    <div className="flex justify-between items-center">
      <div className="flex flex-col">
        <TileSubtitle>
          {t('managed_vcd_dashboard_windows_license')}
        </TileSubtitle>
        <Description>
          {t('managed_vcd_dashboard_windows_license_unactive')}
        </Description>
      </div>
      <ActionMenu items={[]} isCompact />
    </div>
  );
}
