import React from 'react';
import {
  useOrderURL,
  getVcdProductSettings,
} from '@ovh-ux/manager-module-order';
import {
  ActionMenu,
  DashboardTile,
  Description,
} from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { ODS_ICON_NAME } from '@ovhcloud/ods-components';

export default function OrganizationOptionsTile({
  isLicenseActive,
  organizationName,
}: Readonly<{
  isLicenseActive: boolean;
  organizationName: string;
}>) {
  const { t } = useTranslation('dashboard');

  const orderBaseUrl = useOrderURL('express_review_base');
  const vcdProductSettings = getVcdProductSettings(organizationName);
  const orderLink = `${orderBaseUrl}?products=~(${vcdProductSettings})`;
  const handleActivateLicense = () => {
    window.open(orderLink, '_blank', 'noopener,noreferrer');
  };

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
                  items={[
                    {
                      id: 1,
                      label: t(
                        'managed_vcd_dashboard_windows_license_activate',
                      ),
                      onClick: handleActivateLicense,
                    },
                  ]}
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
// orderconfirmation.tsx // order funnel example
