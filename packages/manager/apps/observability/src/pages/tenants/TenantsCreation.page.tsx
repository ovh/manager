import { RedirectionGuard } from '@ovh-ux/manager-react-components';

import { useObservabilityServiceContext } from '@/contexts/ObservabilityService.context';
import { urls } from '@/routes/Routes.constants';

import { TenantsForm } from './TenantsForm.component';

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
