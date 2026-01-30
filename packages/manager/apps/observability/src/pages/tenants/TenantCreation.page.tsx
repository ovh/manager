import { RedirectionGuard } from '@ovh-ux/muk';

import { useObservabilityServiceContext } from '@/contexts/ObservabilityService.context';
import { TenantForm } from '@/pages/tenants/TenantForm.component';
import { urls } from '@/routes/Routes.constants';

export default function TenantCreationPage() {
  const { selectedService, isLoading, isSuccess } = useObservabilityServiceContext();

  return (
    <RedirectionGuard
      condition={!selectedService && isSuccess}
      isLoading={isLoading}
      route={urls.tenants}
    >
      <TenantForm />
    </RedirectionGuard>
  );
}
