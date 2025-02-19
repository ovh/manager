import React from 'react';
import { DashboardTile } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useVcdOrder } from '@ovh-ux/manager-module-vcd-api';
import { OdsText } from '@ovhcloud/ods-components/react';
import { WINDOWS_LICENSE_PLANCODE } from '@/utils/planCode.constants';
import { Menu } from '@/components/menu/Menu.component';

export default function OrganizationOptionsTile({
  isLicenseActive,
}: Readonly<{
  isLicenseActive: boolean;
}>) {
  const { t } = useTranslation('dashboard');
  const { id } = useParams();
  const { redirectToOrder } = useVcdOrder({
    serviceName: id,
    planCode: WINDOWS_LICENSE_PLANCODE,
  });

  return (
    <div className="h-fit">
      <DashboardTile
        title={t('managed_vcd_dashboard_options')}
        items={[
          {
            id: 'license',
            label: t('managed_vcd_dashboard_windows_license'),
            value: isLicenseActive ? (
              <OdsText>
                {t('managed_vcd_dashboard_windows_license_active')}
              </OdsText>
            ) : (
              <div className="flex justify-between items-center">
                <OdsText>
                  {t('managed_vcd_dashboard_windows_license_unactive')}
                </OdsText>
                <Menu
                  items={[
                    {
                      label: t(
                        'managed_vcd_dashboard_windows_license_activate',
                      ),
                      onClick: redirectToOrder,
                    },
                  ]}
                />
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
