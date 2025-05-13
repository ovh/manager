import React from 'react';
import { useTranslation } from 'react-i18next';
import { DashboardTile } from '@ovh-ux/manager-react-components';
import ServiceRenewTileItem from './renew-tile-item/ServiceRenewTileItem';
import ServiceContactsTileItem from './contact-tile-item/ServiceContactsTileItem';
import ServicePasswordTileItem from './password-tile-item/ServicePasswordTileItem';
import CancellationTileItem from './cancellation-tile-item/CancellationTileItem';

export default function OrganizationServiceManagementTile() {
  const { t } = useTranslation('dashboard');

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
            value: <CancellationTileItem />,
          },
          {
            id: 'servicePassword',
            label: t('managed_vcd_dashboard_password'),
            value: <ServicePasswordTileItem />,
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
