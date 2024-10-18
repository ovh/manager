import React from 'react';
import {
  ActionMenu,
  DashboardTile,
  Description,
} from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { useParams } from 'react-router-dom';
import useVcdOrder from '@/data/hooks/useVcdOrder';
import { WINDOWS_LICENSE_PLANCODE } from '@/utils/planCode.constants';

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
                      onClick: redirectToOrder,
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
