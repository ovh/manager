import { Outlet, useNavigate } from 'react-router-dom';

import { useQuery, useQueryClient } from '@tanstack/react-query';

import { BillingInformationsTileStandard } from '@ovh-ux/manager-billing-informations';
import { ButtonType, PageLocation, useOvhTracking } from '@ovh-ux/manager-react-shell-client';

import { tenantsQueries } from '@/data/queries/tenants.queries';
import { urls } from '@/routes/routes.constants';

import { GeneralInformationTenantTile } from './_components/general-information-tenant-tile/GeneralInformationTenantTile.component';
import SubscriptionTile from './_components/subscription-tile/SubscriptionTile.component';

export default function GeneralInformationPage() {
  const queryClient = useQueryClient();
  const { data: tenantResource } = useQuery(tenantsQueries.withClient(queryClient).vspcDetail());
  const navigate = useNavigate();
  const { trackClick } = useOvhTracking();

  return (
    <section className="flex md:flex-row flex-col gap-8">
      <GeneralInformationTenantTile />
      <SubscriptionTile />
      <BillingInformationsTileStandard
        resourceName={tenantResource?.id}
        onResiliateLinkClick={() => {
          trackClick({
            location: PageLocation.tile,
            buttonType: ButtonType.link,
            actionType: 'navigation',
            actions: ['delete-tenant'],
          });
          navigate(urls.dashboardTenantDelete);
        }}
      />
      <Outlet />
    </section>
  );
}
