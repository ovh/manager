import { BillingInformationsTileStandard } from "@ovh-ux/manager-billing-informations"

import { GeneralInformationTenantTile } from "./_components/general-information-tenant-tile/GeneralInformationTenantTile.component";
import { useParams } from "react-router-dom";
import { useBackupTenantDetails } from "@/data/hooks/tenants/useBackupTenantDetails";


export default function GeneralInformationPage() {
  const { tenantId } = useParams<{ tenantId: string }>();
  const { data: tenantResource } = useBackupTenantDetails({ tenantId: tenantId! })

  return (
    <section className="max-w-6xl mx-auto px-12 grid md:grid-cols-2 lg:grid-cols-3 grid-cols-1 gap-8">
      <GeneralInformationTenantTile tenantId={tenantId!} />
      <BillingInformationsTileStandard resourceName={tenantResource?.id} />
    </section>
  );
}
