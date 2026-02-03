import { Outlet, useNavigate } from 'react-router-dom';

import { BillingInformationsTileStandard } from '@ovh-ux/manager-billing-informations';

import { useBackupVSPCTenantDetails } from '@/data/hooks/tenants/useVspcTenantDetails';
import { urls } from '@/routes/routes.constants';

import { GeneralInformationTenantTile } from './_components/general-information-tenant-tile/GeneralInformationTenantTile.component';
import SubscriptionTile from './_components/subscription-tile/SubscriptionTile.component';

export default function GeneralInformationPage() {
  const { data: tenantResource } = useBackupVSPCTenantDetails();
  const navigate = useNavigate();

  return (
    <section className="flex md:flex-row flex-col gap-8">
      <GeneralInformationTenantTile />
      <SubscriptionTile />
      <BillingInformationsTileStandard
        resourceName={tenantResource?.id}
        onResiliateLinkClick={() => {
          navigate(urls.dashboardTenantDelete);
        }}
      />
      <Outlet />
    </section>
  );
}
