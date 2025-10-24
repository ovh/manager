import { ObservabilityServiceParams } from '@/data/api/observability.props';
import { CreateTenantsPayload } from '@/data/api/tenants.props';
import { Tenant } from '@/types/tenants.type';

export const getTenants = async ({
  resourceName,
}: ObservabilityServiceParams): Promise<Tenant[]> => {
  const isOnboarding = resourceName !== 'ldp-rg-93836'; // '[DO NOT TOUCH] Monito service'
  console.info(
    `[MOCK-ADAPTER][getTenants] is onboarding mock for ${resourceName} -> `,
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

export const createTenant = async function ({
  resourceName,
  targetSpec,
}: CreateTenantsPayload): Promise<Tenant> {
  console.info(`[MOCK-ADAPTER][createTenant] mock creation of tenant for ${resourceName}`);
  console.info(`[MOCK-ADAPTER][createTenant] targetSpec -> `, targetSpec);
  return Promise.resolve({
    id: '1',
    currentState: {
      title: 'Tenant 1',
    },
    targetSpec: {
      ...targetSpec,
      limits: {
        ...targetSpec.limits,
        numberOfSeries: {
          ...targetSpec.limits.numberOfSeries,
          current: targetSpec.limits.numberOfSeries.maximum,
        },
        retention: {
          ...targetSpec.limits.retention,
          duration: '30d', // Add required duration property
        },
      },
    },
  });
};
