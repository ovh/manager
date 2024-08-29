import React from 'react';
import { CommonTitle } from '@ovhcloud/manager-components';
import { OsdsDivider, OsdsTile } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import OptionsTileLicense from './OptionsTileLicense';

export default function OrganizationOptionsTile() {
  const { t } = useTranslation('dashboard');

  return (
    <OsdsTile>
      <div className="flex flex-col w-full">
        <CommonTitle>{t('managed_vcd_dashboard_options')}</CommonTitle>
        <OsdsDivider separator />
        <OptionsTileLicense />
      </div>
    </OsdsTile>
  );
}
