import { CommonTitle } from '@ovhcloud/manager-components';
import { OsdsDivider, OsdsTile } from '@ovhcloud/ods-components/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import TileSubtitle from '../tile-subtitle/TileSubtitle.component';

export default function VcdOptionsTile() {
  const { t } = useTranslation('dashboard');

  return (
    <OsdsTile>
      <div className="flex flex-col w-full">
        <CommonTitle>{t('managed_vcd_dashboard_options')}</CommonTitle>
        <OsdsDivider separator />
        <TileSubtitle>
          {t('managed_vcd_dashboard_windows_licence')}
        </TileSubtitle>
      </div>
    </OsdsTile>
  );
}
