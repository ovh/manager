import { ObservabilityServiceParams } from '@/data/api/observability.props';
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
              description: 'Tenant 1 description',
              limits: {
                numberOfSeries: {
                  current: 222,
                  maximum: 300,
                },
                retention: {
                  id: 'retention-1',
                  duration: '36 mois',
                  link: 'retention_link_1',
                },
              },
              infrastructure: {
                id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                currentState: {
                  location: 'eu-west-sbg',
                  entryPoint: 'sbg1.metrics.ovh.com',
                  type: 'SHARED',
                  usage: 'METRICS',
                },
              },
              tags: ['tag name1', 'tag name2', 'tag name3'],
            },
          },
          {
            id: '2',
            currentState: {
              title: 'Tenant 2',
              description: 'Tenant 2 description',
              limits: {
                numberOfSeries: {
                  current: 36,
                  maximum: 50,
                },
                retention: {
                  id: 'retention-2',
                  duration: '12 mois',
                  link: 'retention_link_2',
                },
              },
              infrastructure: {
                id: '6ee8fb35-2621-4530-a288-84fc0e85dac1',
                currentState: {
                  entryPoint: 'gra1.metrics.ovh.com',
                  location: 'eu-west-gra',
                  type: 'SHARED',
                  usage: 'METRICS',
                },
              },
              tags: ['tag name3'],
            },
          },
        ]
      : [],
  );
};
