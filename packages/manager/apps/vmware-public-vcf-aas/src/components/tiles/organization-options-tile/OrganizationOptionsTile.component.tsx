import React from 'react';
import { ActionMenu, DashboardTile } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useVcdOrder } from '@ovh-ux/manager-module-vcd-api';
import { OdsText } from '@ovhcloud/ods-components/react';
import { ODS_BUTTON_VARIANT, ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { WINDOWS_LICENSE_PLANCODE } from '@/utils/planCode.constants';
import { TRACKING } from '@/tracking.constants';
import TEST_IDS from '@/utils/testIds.constants';

export default function OrganizationOptionsTile({
  isLicenseActive,
  isDisabled,
}: Readonly<{
  isLicenseActive: boolean;
  isDisabled: boolean;
}>) {
  const { t } = useTranslation('dashboard');
  const { id } = useParams();
  const { trackClick } = useOvhTracking();
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
                <ActionMenu
                  id="license_menu"
                  isCompact
                  isDisabled={isDisabled}
                  variant={ODS_BUTTON_VARIANT.ghost}
                  icon={ODS_ICON_NAME.ellipsisVertical}
                  items={[
                    {
                      id: 1,
                      label: t(
                        'managed_vcd_dashboard_windows_license_activate',
                      ),
                      onClick: () => {
                        trackClick(TRACKING.dashboard.activateWindowsLicence);
                        redirectToOrder();
                      },
                      'data-testid': TEST_IDS.activateLicenseCta,
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
