import { ObservabilityServiceParams } from '@/types/ClientApi.type';
import { Tenant } from '@/types/observability.type';

export const getTenants = async ({
  serviceName,
}: ObservabilityServiceParams): Promise<Tenant[]> => {
  const isOnboarding = serviceName !== 'ldp-rg-93836'; // '[DO NOT TOUCH] Monito service'
  console.info(
    `[MOCK-ADAPTER][getTenants] is onboarding mock for ${serviceName} -> `,
    isOnboarding,
  );
  return Promise.resolve(
    !isOnboarding
      ? [
          {
            id: '1',
            currentState: {
              title: 'Tenant 1',
            },
          },
          {
            id: '2',
            currentState: {
              title: 'Tenant 2',
            },
          },
        ]
      : [],
  );
};
