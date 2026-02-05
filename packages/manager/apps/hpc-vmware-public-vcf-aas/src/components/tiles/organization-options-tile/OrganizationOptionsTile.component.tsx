import { useTranslation } from 'react-i18next';

import { ODS_BUTTON_VARIANT, ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { OdsText } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useVcdOrder } from '@ovh-ux/manager-module-vcd-api';
import { ActionMenu, DashboardTile } from '@ovh-ux/manager-react-components';
import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';

import { useOrganisationParams } from '@/hooks/params/useSafeParams';
import { TRACKING } from '@/tracking.constants';
import { WINDOWS_LICENSE_PLANCODE } from '@/utils/planCode.constants';
import TEST_IDS from '@/utils/testIds.constants';

export default function OrganizationOptionsTile({
  isLicenseActive,
  isDisabled,
}: Readonly<{
  isLicenseActive: boolean;
  isDisabled: boolean;
}>) {
  const { t } = useTranslation('dashboard');
  const { t: tActions } = useTranslation(NAMESPACES.ACTIONS);
  const { id } = useOrganisationParams();
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
              <OdsText>{t('managed_vcd_dashboard_windows_license_active')}</OdsText>
            ) : (
              <div className="flex items-center justify-between">
                <OdsText>{t('managed_vcd_dashboard_windows_license_unactive')}</OdsText>
                <ActionMenu
                  id="license_menu"
                  isCompact
                  isDisabled={isDisabled}
                  variant={ODS_BUTTON_VARIANT.ghost}
                  icon={ODS_ICON_NAME.ellipsisVertical}
                  items={[
                    {
                      id: 1,
                      label: tActions('activate'),
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
