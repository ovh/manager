import { useTranslation } from 'react-i18next';

import { isStatusTerminated, useVcdOrganization } from '@ovh-ux/manager-module-vcd-api';
import { DashboardTile } from '@ovh-ux/manager-react-components';

import { useOrganisationParams } from '@/hooks/params/useSafeParams';

import CancellationTileItem from './cancellation-tile-item/CancellationTileItem';
import ServiceContactsTileItem from './contact-tile-item/ServiceContactsTileItem';
import ServicePasswordTileItem from './password-tile-item/ServicePasswordTileItem';
import ServiceRenewTileItem from './renew-tile-item/ServiceRenewTileItem';

export default function OrganizationServiceManagementTile() {
  const { t } = useTranslation('dashboard');
  const { id } = useOrganisationParams();
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
            label: t('managed_vcd_dashboard_password'),
            value: <ServicePasswordTileItem isDisabled={isDisabled} />,
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
