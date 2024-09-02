import React from 'react';
import {
  ActionMenu,
  DashboardTile,
  Description,
} from '@ovhcloud/manager-components';
import { useTranslation } from 'react-i18next';
import { ODS_ICON_NAME } from '@ovhcloud/ods-components';

export default function OrganizationOptionsTile({
  isLicenseActive,
}: {
  readonly isLicenseActive: boolean;
}) {
  const { t } = useTranslation('dashboard');

  return (
    <div className="h-fit">
      <DashboardTile
        title={t('managed_vcd_dashboard_options')}
        items={[
          {
            id: 'license',
            label: t('managed_vcd_dashboard_windows_license'),
            value: isLicenseActive ? (
              <Description>
                {t('managed_vcd_dashboard_windows_license_active')}
              </Description>
            ) : (
              <div className="flex justify-between items-center">
                <Description>
                  {t('managed_vcd_dashboard_windows_license_unactive')}
                </Description>
                <ActionMenu
                  items={[]}
                  isCompact
                  icon={ODS_ICON_NAME.ELLIPSIS_VERTICAL}
                />
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
