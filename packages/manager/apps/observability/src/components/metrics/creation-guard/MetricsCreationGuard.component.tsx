import { RedirectionGuard } from '@ovh-ux/muk';

import { useObservabilityServiceContext } from '@/contexts/ObservabilityService.context';

export default function MetricsCreationGuard({
  children,
  route,
}: {
  children: React.ReactNode;
  route: string;
}) {
  const { selectedService, isLoading, isSuccess } = useObservabilityServiceContext();

  return (
    <RedirectionGuard condition={!selectedService && isSuccess} isLoading={isLoading} route={route}>
      {children}
    </RedirectionGuard>
  );
}
