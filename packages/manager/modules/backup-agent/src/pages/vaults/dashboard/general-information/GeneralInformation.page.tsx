import { Outlet, useNavigate, useParams } from 'react-router-dom';

import { useQuery, useQueryClient } from '@tanstack/react-query';

import { BillingInformationsTileStandard } from '@ovh-ux/manager-billing-informations';
import { Region } from '@ovh-ux/manager-config';
import { useEnvironment } from '@ovh-ux/manager-react-shell-client';

import { vaultsQueries } from '@/data/queries/vaults.queries';
import { subRoutes } from '@/routes/routes.constants';

import { GeneralInformationVaultTile } from './_components/general-information-vault-tile/GeneralInformationVaultTile.component';
import { SubscriptionTile } from './_components/subscription-tile/SubscriptionTile.component';

export default function GeneralInformationPage() {
  const { vaultId } = useParams<{ vaultId: string }>();
  const queryClient = useQueryClient();
  const { data: vaultResource } = useQuery(vaultsQueries.withClient(queryClient).detail(vaultId!));
  const navigate = useNavigate();
  const isUsRegion = useEnvironment().getRegion?.() === Region.US;

  return (
    <section className="flex flex-col sm:flex-row gap-8">
      <GeneralInformationVaultTile vaultId={vaultId!} />
      <SubscriptionTile vaultId={vaultId!} />
      <BillingInformationsTileStandard
        resourceName={vaultResource?.currentState?.resourceName}
        onResiliateLinkClick={
          isUsRegion
            ? undefined
            : () => {
                navigate(subRoutes.delete);
              }
        }
        hideResiliateLink={isUsRegion}
      />
      <Outlet />
    </section>
  );
}
