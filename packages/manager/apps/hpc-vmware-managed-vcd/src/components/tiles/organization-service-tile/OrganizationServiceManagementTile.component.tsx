import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { DashboardTile, Links } from '@ovh-ux/manager-react-components';
import { OsdsChip } from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_CHIP_SIZE } from '@ovhcloud/ods-components';
import ServiceRenewTileItem from './renew-tile-item/ServiceRenewTileItem';
import ServiceContactsTileItem from './contact-tile-item/ServiceContactsTileItem';
import { subRoutes, urls } from '@/routes/routes.constant';

export default function OrganizationServiceManagementTile() {
  const { t } = useTranslation('dashboard');
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="h-fit">
      <DashboardTile
        title={t('managed_vcd_dashboard_service_management')}
        items={[
          {
            id: 'serviceRenew',
            label: t('managed_vcd_dashboard_service_renew'),
            value: <ServiceRenewTileItem />,
          },
          {
            id: 'serviceCancellation',
            label: t('managed_vcd_dashboard_service_cancellation'),
            value: (
              <OsdsChip
                inline
                color={ODS_THEME_COLOR_INTENT.primary}
                className="ml-3"
                size={ODS_CHIP_SIZE.sm}
              >
                {t('managed_vcd_dashboard_coming_soon')}
              </OsdsChip>
            ),
          },
          {
            id: 'servicePassword',
            label: t('managed_vcd_dashboard_password'),
            value: (
              <Links
                label={t('managed_vcd_dashboard_password_renew')}
                onClickReturn={() =>
                  navigate(urls.resetPassword.replace(subRoutes.dashboard, id))
                }
              />
            ),
          },
          {
            id: 'serviceContacts',
            label: t('managed_vcd_dashboard_contact_list'),
            value: <ServiceContactsTileItem />,
          },
        ]}
      />
    </div>
  );
}
