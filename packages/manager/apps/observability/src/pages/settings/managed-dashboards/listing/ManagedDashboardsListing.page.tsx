import { Outlet } from 'react-router-dom';

import { RedirectionGuard } from '@ovh-ux/muk';

import ManagedDashboardsListDatagrid from '@/components/listing/managedDashboards/ManagedDashboardsListDatagrid.component';
import { useObservabilityServiceContext } from '@/contexts/ObservabilityService.context';
import { useGrafanas } from '@/data/hooks/grafana/useGrafana.hook';
import { urls } from '@/routes/Routes.constants';

export default function ManagedDashboardsListingPage() {
  const { selectedService } = useObservabilityServiceContext();
  const {
    data: managedDashboards = [],
    isPending,
    isError,
    error,
    isLoading,
  } = useGrafanas(selectedService?.id || '');

  return !isPending ? (
    <RedirectionGuard
      condition={!managedDashboards?.length}
      isLoading={isLoading}
      route={urls.managedDashboardsOnboarding}
    >
      <ManagedDashboardsListDatagrid
        managedDashboardsList={managedDashboards}
        isLoading={isLoading}
        isError={isError}
        error={error}
      />
      <Outlet />
    </RedirectionGuard>
  ) : null;
}
