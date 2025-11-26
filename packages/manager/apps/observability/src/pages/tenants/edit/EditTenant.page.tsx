import { useParams } from 'react-router-dom';

import { RedirectionGuard } from '@ovh-ux/muk';

import EditTenantDrawer from '@/components/drawer/EditTenantDrawer.component';
import { useObservabilityServiceContext } from '@/contexts/ObservabilityService.context';
import { LocationPathParams } from '@/routes/Routes.constants';
import { getTenantDashboardUrl } from '@/routes/Routes.utils';

const EditTenantPage = () => {
  const { selectedService, isLoading, isSuccess } = useObservabilityServiceContext();
  const resourceName = selectedService?.id;
  const currentResourceName = resourceName ?? '';

  const { tenantId } = useParams<LocationPathParams>();
  const currentTenantId = tenantId ?? '';

  return (
    <RedirectionGuard
      condition={!resourceName && isSuccess}
      isLoading={isLoading}
      route={getTenantDashboardUrl(currentTenantId)}
    >
      <EditTenantDrawer resourceName={currentResourceName} tenantId={currentTenantId} />
    </RedirectionGuard>
  );
};

export default EditTenantPage;
