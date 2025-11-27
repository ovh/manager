import React from 'react';
import { useTranslation } from 'react-i18next';
import { DashboardTile } from '@ovh-ux/manager-react-components';
import { useParams } from 'react-router-dom';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import {
  isStatusTerminated,
  useVcdOrganization,
} from '@ovh-ux/manager-module-vcd-api';
import ServiceRenewTileItem from './renew-tile-item/ServiceRenewTileItem';
import ServiceContactsTileItem from './contact-tile-item/ServiceContactsTileItem';
import ServicePasswordTileItem from './password-tile-item/ServicePasswordTileItem';
import CancellationTileItem from './cancellation-tile-item/CancellationTileItem';

export default function OrganizationServiceManagementTile() {
  const { t } = useTranslation('dashboard');
  const { t: tContact } = useTranslation(NAMESPACES.CONTACT);
  const { t: tSystem } = useTranslation(NAMESPACES.SYSTEM);
  const { id } = useParams() as { id: string };
  const { data: vcdOrganisation } = useVcdOrganization({ id });
  const isDisabled = isStatusTerminated(vcdOrganisation?.data?.resourceStatus);

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
            value: <CancellationTileItem isDisabled={isDisabled} />,
          },
          {
            id: 'servicePassword',
            label: tSystem('password'),
            value: <ServicePasswordTileItem isDisabled={isDisabled} />,
          },
          {
            id: 'serviceContacts',
            label: tContact('contacts'),
            value: <ServiceContactsTileItem />,
          },
        ]}
      />
    </div>
  );
}
