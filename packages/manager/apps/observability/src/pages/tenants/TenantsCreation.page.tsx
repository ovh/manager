import { RedirectionGuard } from '@ovh-ux/muk';

import { useObservabilityServiceContext } from '@/contexts/ObservabilityService.context';
import { TenantsForm } from '@/pages/tenants/TenantsForm.component';
import { urls } from '@/routes/Routes.constants';

export default function TenantsCreationPage() {
  const { selectedService, isLoading, isSuccess } = useObservabilityServiceContext();

  return (
    <RedirectionGuard
      condition={!selectedService && isSuccess}
      isLoading={isLoading}
      route={urls.tenants}
    >
      <TenantsForm />
    </RedirectionGuard>
  );
}
