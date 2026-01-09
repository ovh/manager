import { useParams } from 'react-router-dom';

import { RedirectionGuard } from '@ovh-ux/muk';

import { useObservabilityServiceContext } from '@/contexts/ObservabilityService.context';
import { useTenant } from '@/data/hooks/tenants/useTenants.hook';
import { TenantForm } from '@/pages/tenants/TenantForm.component';
import { LocationPathParams } from '@/routes/Routes.constants';
import { getTenantDashboardUrl } from '@/routes/Routes.utils';

const EditTenantPage = () => {
  const { selectedService, isLoading, isSuccess } = useObservabilityServiceContext();
  const resourceName = selectedService?.id ?? '';

  const { tenantId = '' } = useParams<LocationPathParams>();

  const { data: tenant, isLoading: isTenantLoading } = useTenant(resourceName, tenantId);

  return (
    <RedirectionGuard
      condition={!resourceName && isSuccess}
      isLoading={isLoading || isTenantLoading}
      route={getTenantDashboardUrl({ tenantId, resourceName })}
    >
      <TenantForm tenant={tenant} />
    </RedirectionGuard>
  );
};

export default EditTenantPage;
