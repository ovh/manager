import { Outlet, useNavigate } from 'react-router-dom';

import { BillingInformationsTileStandard } from '@ovh-ux/manager-billing-informations';

import { useBackupVSPCTenantDetails } from '@/data/hooks/tenants/useVspcTenantDetails';
import { useRequiredParams } from '@/hooks/useRequiredParams';
import { buildDeleteTenantUrl } from '@/utils/buildSearchQuery.utils';

import { GeneralInformationTenantTile } from './_components/general-information-tenant-tile/GeneralInformationTenantTile.component';
import SubscriptionTile from './_components/subscription-tile/SubscriptionTile.component';

export default function GeneralInformationPage() {
  const { tenantId } = useRequiredParams('tenantId');
  const { data: tenantResource } = useBackupVSPCTenantDetails({ tenantId: tenantId });
  const navigate = useNavigate();

  return (
    <section className="flex md:flex-row flex-col gap-8">
      <GeneralInformationTenantTile tenantId={tenantId} />
      <SubscriptionTile tenantId={tenantResource?.id} />
      <BillingInformationsTileStandard
        resourceName={tenantResource?.id}
        onResiliateLinkClick={() => {
          navigate(buildDeleteTenantUrl({ tenantId, origin: 'dashboard' }));
        }}
      />
      <Outlet />
    </section>
  );
}
