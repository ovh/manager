import { useParams } from 'react-router-dom';

import { BillingInformationsTileStandard } from '@ovh-ux/manager-billing-informations';

import { useBackupVaultDetails } from '@/data/hooks/vaults/getVaultDetails';

import { GeneralInformationVaultTile } from './_components/general-information-vault-tile/GeneralInformationVaultTile.component';
import { SubscriptionTile } from './_components/subscription-tile/SubscriptionTile.component';

export default function GeneralInformationPage() {
  const { vaultId } = useParams<{ vaultId: string }>();
  const { data: vaultResource } = useBackupVaultDetails({ vaultId: vaultId! });

  return (
    <section className="max-w-6xl mx-auto px-12 grid md:grid-cols-2 lg:grid-cols-3 grid-cols-1 gap-8">
      <GeneralInformationVaultTile vaultId={vaultId!} />
      <SubscriptionTile vaultId={vaultId!} />
      <BillingInformationsTileStandard resourceName={vaultResource?.currentState?.resourceName} />
    </section>
  );
}
