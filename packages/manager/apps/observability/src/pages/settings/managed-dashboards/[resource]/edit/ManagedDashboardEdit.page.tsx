import { useParams } from 'react-router-dom';

import { RedirectionGuard } from '@ovh-ux/muk';

import { useObservabilityServiceContext } from '@/contexts/ObservabilityService.context';
import { useGrafana } from '@/data/hooks/grafana/useGrafana.hook';
import ManagedDashboardForm from '@/pages/settings/managed-dashboards/[resource]/ManagedDashboardForm.component';
import { LocationPathParams } from '@/routes/Routes.constants';
import { getManagedDashboardsUrl } from '@/routes/Routes.utils';

const ManagedDashboardEditPage = () => {
  const { selectedService, isLoading, isSuccess } = useObservabilityServiceContext();
  const resourceName = selectedService?.id ?? '';

  const { managedDashboardId = '' } = useParams<LocationPathParams>();

  const { data: managedDashboard, isLoading: isGrafanaLoading } = useGrafana(
    resourceName,
    managedDashboardId,
  );

  return (
    <RedirectionGuard
      condition={!resourceName && isSuccess}
      isLoading={isLoading || isGrafanaLoading}
      route={getManagedDashboardsUrl({ resourceName })}
    >
      <ManagedDashboardForm managedDashboard={managedDashboard} />
    </RedirectionGuard>
  );
};

export default ManagedDashboardEditPage;
