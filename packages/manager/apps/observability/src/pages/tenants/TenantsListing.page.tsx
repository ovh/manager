import { Outlet } from 'react-router-dom';

import { RedirectionGuard } from '@ovh-ux/muk';

import TenantsListDatagrid from '@/components/listing/tenants/TenantsListDatagrid.component';
import { useObservabilityServiceContext } from '@/contexts/ObservabilityService.context';
import { useTenants } from '@/data/hooks/tenants/useTenants.hook';
import { urls } from '@/routes/Routes.constants';

export default function TenantsListingPage() {
  const { selectedService } = useObservabilityServiceContext();
  const {
    data: tenants = [],
    isPending,
    isError,
    error,
    isLoading,
  } = useTenants(selectedService?.id || '');

  return !isPending ? (
    <RedirectionGuard
      condition={!tenants || tenants.length === 0}
      isLoading={isLoading}
      route={urls.tenantsOnboarding}
    >
      <TenantsListDatagrid
        tenantsList={tenants}
        isLoading={isLoading}
        isError={isError}
        error={error}
      />
      <Outlet />
    </RedirectionGuard>
  ) : null;
}
