import { Outlet, useNavigate, useParams } from 'react-router-dom';

import { BillingInformationsTileStandard } from '@ovh-ux/manager-billing-informations';

import { useBackupVaultDetails } from '@/data/hooks/vaults/getVaultDetails';
import { subRoutes } from '@/routes/routes.constants';

import { GeneralInformationVaultTile } from './_components/general-information-vault-tile/GeneralInformationVaultTile.component';
import { SubscriptionTile } from './_components/subscription-tile/SubscriptionTile.component';

export default function GeneralInformationPage() {
  const { vaultId } = useParams<{ vaultId: string }>();
  const { data: vaultResource } = useBackupVaultDetails({ vaultId: vaultId! });
  const navigate = useNavigate();

  return (
    <section className="flex flex-col sm:flex-row gap-8">
      <GeneralInformationVaultTile vaultId={vaultId!} />
      <SubscriptionTile vaultId={vaultId!} />
      <BillingInformationsTileStandard
        resourceName={vaultResource?.currentState?.resourceName}
        onResiliateLinkClick={() => {
          navigate(subRoutes.delete);
        }}
      />
      <Outlet />
    </section>
  );
}
