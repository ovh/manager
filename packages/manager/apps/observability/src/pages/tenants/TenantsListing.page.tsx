import { Outlet } from 'react-router-dom';

import TenantsListDatagrid from '@/components/listing/tenants/TenantsListDatagrid.component';
import { useObservabilityServiceContext } from '@/contexts/ObservabilityService.context';
import { useTenants } from '@/data/hooks/tenants/useTenants.hook';

export default function TenantsListingPage() {
  const { selectedService } = useObservabilityServiceContext();
  const {
    data: tenants,
    isSuccess,
    isError,
    error,
    isLoading,
  } = useTenants(selectedService?.id || '');

  return tenants && isSuccess ? (
    <>
      <TenantsListDatagrid
        tenantsList={tenants}
        isLoading={isLoading}
        isError={isError}
        error={error}
      />
      <Outlet />
    </>
  ) : null;
}
