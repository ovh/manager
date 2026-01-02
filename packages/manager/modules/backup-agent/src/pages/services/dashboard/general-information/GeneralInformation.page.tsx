import { useParams } from 'react-router-dom';

import { BillingInformationsTileStandard } from '@ovh-ux/manager-billing-informations';

import { useBackupTenantDetails } from '@/data/hooks/tenants/useBackupTenantDetails';

import { GeneralInformationTenantTile } from './_components/general-information-tenant-tile/GeneralInformationTenantTile.component';
import SubscriptionTile from './_components/subscription-tile/SubscriptionTile.component';

export default function GeneralInformationPage() {
  const { tenantId } = useParams<{ tenantId: string }>();
  const { data: tenantResource } = useBackupTenantDetails({ tenantId: tenantId! });

  return (
    <section className="flex md:flex-row flex-col gap-8">
      <GeneralInformationTenantTile tenantId={tenantId!} />
      <SubscriptionTile tenantId={tenantResource?.id} />
      <BillingInformationsTileStandard resourceName={tenantResource?.id} />
    </section>
  );
}
