import { Locale } from 'date-fns';
import { describe, expect, it, vi } from 'vitest';

import {
  Tenant,
  TenantListing,
  TenantSubscription,
  TenantSubscriptionListing,
} from '@/types/tenants.type';
import { formatObservabilityDuration } from '@/utils/duration.utils';
import { mapSubscriptionsToListing, mapTenantsToListing } from '@/utils/tenants.utils';

// Mock formatObservabilityDuration to return a predictable value
vi.mock('@/utils/duration.utils', () => ({
  formatObservabilityDuration: vi.fn((duration: string) => `formatted-${duration}`),
}));

describe('tenants.utils', () => {
  describe('mapTenantsToListing', () => {
    const mockDateFnsLocale = { code: 'en-US' } as Locale;

    const createTenant = (overrides: Partial<Tenant>): Tenant => {
      const baseTenant: Tenant = {
        id: 'tenant-default',
        createdAt: '2025-11-21T14:26:14.041Z',
        updatedAt: '2025-11-21T14:26:14.041Z',
        resourceStatus: 'READY',
        currentState: {
          title: 'Default Tenant',
          description: 'Default description',
        },
      };

      return {
        ...baseTenant,
        ...overrides,
        currentState: {
          ...baseTenant.currentState,
          ...overrides.currentState,
        },
      };
    };

    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('should map tenants to listing format with all properties', () => {
      const mockTenant = createTenant({
        id: 'tenant-1',
        currentState: {
          title: 'Tenant 1',
          description: 'Tenant 1 description',
          limits: {
            mimir: {
              compactor_blocks_retention_period: '180d',
              max_global_series_per_user: 222,
            },
          },
          infrastructure: {
            id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
            location: 'eu-west-sbg',
            entryPoint: 'sbg1.metrics.ovh.com',
            type: 'SHARED',
          },
        },
        iam: {
          id: '92c16299-3f5b-4ea9-a806-e0464e7bfa31',
          urn: 'urn:v1:eu:resource:ldp:ldp-sbg-55078',
          tags: {
            'ovh:ldp:cluster:name': 'sbg159',
            Application: 'Website',
            Compliance: 'PCI-DSS',
            Departement: 'ITOperations',
            Environment: 'Prod',
            Location: 'Europe',
            Owner: 'JohnDoe',
            Project: 'CustomerPortal',
            Region: 'EUR-East',
            Risk: 'Low',
          },
        },
      });

      const result: TenantListing[] = mapTenantsToListing([mockTenant], mockDateFnsLocale);

      const expectedTags = {
        'ovh:ldp:cluster:name': 'sbg159',
        Application: 'Website',
        Compliance: 'PCI-DSS',
        Departement: 'ITOperations',
        Environment: 'Prod',
        Location: 'Europe',
        Owner: 'JohnDoe',
        Project: 'CustomerPortal',
        Region: 'EUR-East',
        Risk: 'Low',
      };

      const expectedTagsStr =
        'ovh:ldp:cluster:name:sbg159;Application:Website;Compliance:PCI-DSS;Departement:ITOperations;Environment:Prod;Location:Europe;Owner:JohnDoe;Project:CustomerPortal;Region:EUR-East;Risk:Low';

      expect(result).toEqual([
        {
          id: 'tenant-1',
          name: 'Tenant 1',
          infrastructure: mockTenant.currentState.infrastructure,
          entryPoint: 'sbg1.metrics.ovh.com',
          endpoint: undefined,
          retention: 'formatted-180d',
          numberOfSeries: 222,
          resourceStatus: 'READY',
          tags: expectedTags,
          search: `Tenant 1 sbg1.metrics.ovh.com formatted-180d 222 ${expectedTagsStr}`,
        },
      ]);
    });

    it('should call formatObservabilityDuration with correct parameters', () => {
      const mockTenants: Tenant[] = [
        {
          id: 'tenant-1',
          createdAt: '2025-11-21T14:26:14.041Z',
          updatedAt: '2025-11-21T14:26:14.041Z',
          resourceStatus: 'READY',
          iam: {
            id: '92c16299-3f5b-4ea9-a806-e0464e7bfa31',
            urn: 'urn:v1:eu:resource:ldp:ldp-sbg-55078',
          },
          currentState: {
            title: 'Test Tenant',
            description: 'Test description',
            limits: {
              mimir: {
                compactor_blocks_retention_period: '30d',
                max_global_series_per_user: 100,
              },
            },
          },
        },
      ];

      mapTenantsToListing(mockTenants, mockDateFnsLocale);

      expect(formatObservabilityDuration).toHaveBeenCalledWith('30d', mockDateFnsLocale);
      expect(formatObservabilityDuration).toHaveBeenCalledTimes(1);
    });

    it.each([
      {
        description: 'tenant without limits',
        tenant: createTenant({
          id: 'tenant-2',
          currentState: {
            title: 'Tenant Without Limits',
            description: 'This Tenant is without Limits',
            infrastructure: {
              id: 'infra-2',
              entryPoint: 'https://test.com',
              location: 'GRA11',
              type: 'SHARED',
            },
          },
        }),
        expectations: (result: TenantListing) => {
          expect(result.retention).toBeUndefined();
          expect(result.numberOfSeries).toBeUndefined();
        },
      },
      {
        description: 'tenant without infrastructure',
        tenant: createTenant({
          id: 'tenant-3',
          currentState: {
            title: 'Tenant Without Infrastructure',
            description: 'This Tenant is without Infrastructure',
            limits: {
              mimir: {
                compactor_blocks_retention_period: '7d',
                max_global_series_per_user: 50,
              },
            },
          },
        }),
        expectations: (result: TenantListing) => {
          expect(result.infrastructure).toBeUndefined();
          expect(result.entryPoint).toBeUndefined();
        },
      },
      {
        description: 'tenant without tags',
        tenant: createTenant({
          id: 'tenant-4',
          currentState: {
            title: 'Tenant Without Tags',
            description: 'This Tenant is without Tags',
            limits: {
              mimir: {
                compactor_blocks_retention_period: '90d',
                max_global_series_per_user: 200,
              },
            },
            infrastructure: {
              id: 'infra-4',
              entryPoint: 'https://no-tags.com',
              location: 'GRA11',
              type: 'SHARED',
            },
          },
          iam: {
            id: 'iam-tenant-4',
            urn: 'urn:v1:tenant:4',
          },
        }),
        expectations: (result: TenantListing) => {
          expect(result.tags).toEqual({});
        },
      },
      {
        description: 'tenant with empty retention duration',
        tenant: createTenant({
          id: 'tenant-5',
          currentState: {
            title: 'Tenant With Empty Retention',
            description: 'This tenant is with empty Retention',
            limits: {
              mimir: {
                compactor_blocks_retention_period: '',
                max_global_series_per_user: 150,
              },
            },
          },
        }),
        expectations: (result: TenantListing) => {
          expect(result.retention).toBeUndefined();
        },
      },
      {
        description: 'tenant without iam',
        tenant: createTenant({
          id: 'tenant-6',
          currentState: {
            title: 'Tenant Without IAM',
            description: 'This Tenant is without IAM',
            limits: {
              mimir: {
                compactor_blocks_retention_period: '30d',
                max_global_series_per_user: 100,
              },
            },
          },
        }),
        expectations: (result: TenantListing) => {
          expect(result.tags).toEqual({});
        },
      },
    ])('should handle $description', ({ tenant, expectations }) => {
      const mockTenants: Tenant[] = [tenant];
      const result = mapTenantsToListing(mockTenants, mockDateFnsLocale);

      expect(result).toHaveLength(1);
      const firstResult = result[0];
      expect(firstResult).toBeDefined();
      if (firstResult) {
        expectations(firstResult);
      }
    });

    it('should map multiple tenants correctly', () => {
      const mockTenants: Tenant[] = [
        createTenant({
          id: 'tenant-1',
          currentState: {
            title: 'First Tenant',
            description: 'First description test',
            limits: {
              mimir: {
                compactor_blocks_retention_period: '30d',
                max_global_series_per_user: 100,
              },
            },
            infrastructure: {
              id: 'infra-1',
              entryPoint: 'mimir.m2c.ovh.net',
              location: 'GRA11',
              type: 'SHARED',
            },
          },
          iam: {
            id: 'iam-tenant-1',
            urn: 'urn:v1:tenant:1',
            tags: {
              team: 'alpha',
            },
          },
        }),
        createTenant({
          id: 'tenant-2',
          currentState: {
            title: 'Second Tenant',
            description: 'Second description test',
            limits: {
              mimir: {
                compactor_blocks_retention_period: '7d',
                max_global_series_per_user: 50,
              },
            },
          },
          iam: {
            id: 'iam-tenant-2',
            urn: 'urn:v1:tenant:2',
            tags: {
              team: 'beta',
              env: 'test',
            },
          },
        }),
      ];

      const result = mapTenantsToListing(mockTenants, mockDateFnsLocale);

      expect(result).toHaveLength(2);
      const expectedFirstTags = { team: 'alpha' };
      const expectedSecondTags = { team: 'beta', env: 'test' };
      expect(result).toEqual([
        {
          id: 'tenant-1',
          name: 'First Tenant',
          infrastructure: {
            id: 'infra-1',
            entryPoint: 'mimir.m2c.ovh.net',
            location: 'GRA11',
            type: 'SHARED',
          },
          entryPoint: 'mimir.m2c.ovh.net',
          endpoint: undefined,
          retention: 'formatted-30d',
          numberOfSeries: 100,
          resourceStatus: 'READY',
          tags: expectedFirstTags,
          search: `First Tenant mimir.m2c.ovh.net formatted-30d 100 team:alpha`,
        },
        {
          id: 'tenant-2',
          name: 'Second Tenant',
          infrastructure: undefined,
          entryPoint: undefined,
          endpoint: undefined,
          retention: 'formatted-7d',
          numberOfSeries: 50,
          resourceStatus: 'READY',
          tags: expectedSecondTags,
          search: `Second Tenant  formatted-7d 50 team:beta;env:test`,
        },
      ]);
    });

    it.each([
      {
        description: 'empty tenant array',
        tenants: [] as Tenant[],
        expectedLength: 0,
        expectations: () => {},
      },
      {
        description: 'single tenant',
        tenants: [
          createTenant({
            id: 'tenant-single',
            currentState: {
              title: 'Single Tenant',
              description: 'Description test',
            },
          }),
        ],
        expectedLength: 1,
        expectations: (result: TenantListing[]) => {
          expect(result[0]?.id).toBe('tenant-single');
          expect(result[0]?.name).toBe('Single Tenant');
        },
      },
    ])('should handle $description', ({ tenants, expectedLength, expectations }) => {
      const result = mapTenantsToListing(tenants, mockDateFnsLocale);

      expect(result).toHaveLength(expectedLength);
      expectations(result);
    });

    it.each([
      {
        description: 'zero value',
        numberOfSeries: 0,
        expected: 0,
      },
      {
        description: 'positive value',
        numberOfSeries: 100,
        expected: 100,
      },
    ])(
      'should handle max_global_series_per_user with $description',
      ({ numberOfSeries, expected }) => {
        const mockTenants: Tenant[] = [
          createTenant({
            id: 'tenant-series',
            currentState: {
              title: 'Tenant With Series',
              description: 'Description test',
              limits: {
                mimir: {
                  compactor_blocks_retention_period: '30d',
                  max_global_series_per_user: numberOfSeries,
                },
              },
            },
          }),
        ];

        const result = mapTenantsToListing(mockTenants, mockDateFnsLocale);

        expect(result).toHaveLength(1);
        const firstResult = result[0];
        expect(firstResult).toBeDefined();
        expect(firstResult?.numberOfSeries).toBe(expected);
      },
    );

    it.each([
      {
        description: 'single tag',
        tags: { tag1: 'value1' } as Record<string, string>,
        expectedTags: { tag1: 'value1' },
        expectedSearch: 'tag1:value1',
      },
      {
        description: 'multiple tags',
        tags: {
          tag1: 'value1',
          tag2: 'value2',
          tag3: 'value3',
          tag4: 'value4',
        } as Record<string, string>,
        expectedTags: {
          tag1: 'value1',
          tag2: 'value2',
          tag3: 'value3',
          tag4: 'value4',
        },
        expectedSearch: 'tag1:value1;tag2:value2;tag3:value3;tag4:value4',
      },
      {
        description: 'undefined tags',
        tags: undefined,
        expectedTags: {},
        expectedSearch: '',
      },
      {
        description: 'empty tags object',
        tags: {},
        expectedTags: {},
        expectedSearch: '',
      },
    ] satisfies Array<{
      description: string;
      tags: Record<string, string> | undefined;
      expectedTags: Record<string, string>;
      expectedSearch: string;
    }>)('should handle $description correctly', ({ tags, expectedTags, expectedSearch }) => {
      const mockTenants: Tenant[] = [
        createTenant({
          id: 'tenant-tags',
          currentState: {
            title: 'Tag Test Tenant',
            description: 'Description test',
          },
          iam: {
            id: 'iam-tags',
            urn: 'urn:v1:tenant:tags',
            tags,
          },
        }),
      ];

      const result = mapTenantsToListing(mockTenants, mockDateFnsLocale);

      expect(result).toHaveLength(1);
      const firstResult = result[0];
      expect(firstResult).toBeDefined();
      expect(firstResult?.tags).toEqual(expectedTags);
      expect(firstResult?.search).toContain(expectedSearch);
    });

    it.each([
      {
        description: 'tenant ids',
        tenants: [
          createTenant({
            id: 'unique-id-1',
            currentState: { title: 'Tenant 1', description: 'Description test' },
          }),
          createTenant({
            id: 'unique-id-2',
            currentState: { title: 'Tenant 2', description: 'Description test' },
          }),
        ],
        expectations: (result: TenantListing[]) => {
          expect(result.map((t) => t.id)).toEqual(['unique-id-1', 'unique-id-2']);
          expect(result.map((t) => t.name)).toEqual(['Tenant 1', 'Tenant 2']);
        },
      },
      {
        description: 'infrastructure',
        tenants: [
          createTenant({
            id: 'tenant-with-infra',
            currentState: {
              title: 'Tenant With Infrastructure',
              description: 'Description test',
              infrastructure: {
                id: 'infra-id',
                entryPoint: 'mimir.m2c.ovh.net',
                location: 'GRA11',
                type: 'SHARED',
              },
            },
          }),
        ],
        expectations: (result: TenantListing[]) => {
          expect(result[0]?.entryPoint).toBe('mimir.m2c.ovh.net');
          expect(result[0]?.infrastructure).toBeDefined();
        },
      },
    ])('should preserve $description correctly', ({ tenants, expectations }) => {
      const result = mapTenantsToListing(tenants, mockDateFnsLocale);

      expectations(result);
    });

    it('should format search string correctly with all optional fields', () => {
      const mockTenants: Tenant[] = [
        createTenant({
          id: 'tenant-search',
          currentState: {
            title: 'Search Test',
            description: 'Description test',
            limits: {
              mimir: {
                compactor_blocks_retention_period: '30d',
                max_global_series_per_user: 42,
              },
            },
            infrastructure: {
              id: 'infra-search',
              entryPoint: 'search.example.com',
              location: 'GRA11',
              type: 'SHARED',
            },
          },
          iam: {
            id: 'iam-search',
            urn: 'urn:v1:search',
            tags: {
              env: 'prod',
              team: 'backend',
            },
          },
        }),
      ];

      const result = mapTenantsToListing(mockTenants, mockDateFnsLocale);

      expect(result[0]?.search).toBe(
        'Search Test search.example.com formatted-30d 42 env:prod;team:backend',
      );
    });
  });

  describe('mapSubscriptionsToListing', () => {
    const createSubscription = (overrides: Partial<TenantSubscription>): TenantSubscription => {
      const baseSubscription: TenantSubscription = {
        id: 'subscription-default',
        createdAt: '2025-01-01T00:00:00.000Z',
        updatedAt: '2025-01-01T00:00:00.000Z',
        resourceStatus: 'READY',
        currentState: {
          kind: 'logs',
          link: 'https://logs.example.com',
          resource: {
            name: 'default-resource',
            type: 'logs',
          },
        },
      };

      return {
        ...baseSubscription,
        ...overrides,
        currentState: {
          ...baseSubscription.currentState,
          ...overrides.currentState,
        },
      };
    };

    it('should map subscriptions to listing format with all properties', () => {
      const mockSubscription = createSubscription({
        id: 'subscription-1',
        resourceStatus: 'READY',
        currentState: {
          kind: 'metrics',
          link: 'https://metrics.example.com',
          resource: {
            name: 'metrics-resource',
            type: 'prometheus',
          },
        },
        iam: {
          id: 'iam-1',
          urn: 'urn:v1:subscription:1',
          tags: {
            environment: 'production',
            team: 'monitoring',
          },
        },
      });

      const result: TenantSubscriptionListing[] = mapSubscriptionsToListing([mockSubscription]);

      expect(result).toEqual([
        {
          id: 'subscription-1',
          resourceStatus: 'READY',
          resource: {
            name: 'metrics-resource',
            type: 'prometheus',
          },
          tags: {
            environment: 'production',
            team: 'monitoring',
          },
          search: 'environment:production;team:monitoring metrics-resource prometheus',
        },
      ]);
    });

    it.each([
      {
        description: 'subscription without iam',
        subscription: createSubscription({
          id: 'subscription-no-iam',
          currentState: {
            kind: 'logs',
            link: 'https://logs.example.com',
            resource: { name: 'logs-resource', type: 'loki' },
          },
        }),
        expectedTags: {},
      },
      {
        description: 'subscription with empty tags',
        subscription: createSubscription({
          id: 'subscription-empty-tags',
          iam: {
            id: 'iam-empty',
            urn: 'urn:v1:subscription:empty',
            tags: {},
          },
        }),
        expectedTags: {},
      },
      {
        description: 'subscription with undefined tags',
        subscription: createSubscription({
          id: 'subscription-undefined-tags',
          iam: {
            id: 'iam-undefined',
            urn: 'urn:v1:subscription:undefined',
          },
        }),
        expectedTags: {},
      },
    ])('should handle $description', ({ subscription, expectedTags }) => {
      const result = mapSubscriptionsToListing([subscription]);

      expect(result).toHaveLength(1);
      expect(result[0]?.tags).toEqual(expectedTags);
    });

    it.each([
      ['READY', 'READY'],
      ['UPDATING', 'UPDATING'],
      ['ERROR', 'ERROR'],
      ['DELETING', 'DELETING'],
      ['CREATING', 'CREATING'],
    ] as const)('should preserve resourceStatus %s', (status, expected) => {
      const subscription = createSubscription({
        id: 'subscription-status',
        resourceStatus: status,
      });

      const result = mapSubscriptionsToListing([subscription]);

      expect(result[0]?.resourceStatus).toBe(expected);
    });

    it.each([
      {
        description: 'empty array',
        subscriptions: [] as TenantSubscription[],
        expectedLength: 0,
        expectations: () => {},
      },
      {
        description: 'single subscription',
        subscriptions: [
          createSubscription({
            id: 'subscription-single',
            currentState: {
              kind: 'logs',
              link: 'https://logs.example.com',
              resource: { name: 'single-resource', type: 'loki' },
            },
          }),
        ],
        expectedLength: 1,
        expectations: (result: TenantSubscriptionListing[]) => {
          expect(result[0]?.id).toBe('subscription-single');
          expect(result[0]?.resource.name).toBe('single-resource');
        },
      },
      {
        description: 'multiple subscriptions',
        subscriptions: [
          createSubscription({
            id: 'subscription-1',
            currentState: {
              kind: 'logs',
              link: 'https://logs.example.com',
              resource: { name: 'logs-resource', type: 'loki' },
            },
            iam: {
              id: 'iam-1',
              urn: 'urn:v1:subscription:1',
              tags: { env: 'prod' },
            },
          }),
          createSubscription({
            id: 'subscription-2',
            currentState: {
              kind: 'traces',
              link: 'https://traces.example.com',
              resource: { name: 'traces-resource', type: 'tempo' },
            },
            iam: {
              id: 'iam-2',
              urn: 'urn:v1:subscription:2',
              tags: { env: 'staging', team: 'backend' },
            },
          }),
        ],
        expectedLength: 2,
        expectations: (result: TenantSubscriptionListing[]) => {
          expect(result[0]?.id).toBe('subscription-1');
          expect(result[0]?.resource.name).toBe('logs-resource');
          expect(result[1]?.id).toBe('subscription-2');
          expect(result[1]?.resource.name).toBe('traces-resource');
        },
      },
    ])('should handle $description', ({ subscriptions, expectedLength, expectations }) => {
      const result = mapSubscriptionsToListing(subscriptions);

      expect(result).toHaveLength(expectedLength);
      expectations(result);
    });

    it.each([
      {
        description: 'single tag',
        tags: { tag1: 'value1' } as Record<string, string> | undefined,
        expectedSearch: 'tag1:value1 resource-name resource-type',
      },
      {
        description: 'multiple tags',
        tags: { tag1: 'value1', tag2: 'value2' } as Record<string, string> | undefined,
        expectedSearch: 'tag1:value1;tag2:value2 resource-name resource-type',
      },
      {
        description: 'no tags',
        tags: undefined as Record<string, string> | undefined,
        expectedSearch: ' resource-name resource-type',
      },
    ])('should format search string correctly with $description', ({ tags, expectedSearch }) => {
      const subscription = createSubscription({
        id: 'subscription-search',
        currentState: {
          kind: 'metrics',
          link: 'https://example.com',
          resource: { name: 'resource-name', type: 'resource-type' },
        },
        iam: tags ? { id: 'iam-search', urn: 'urn:v1:search', tags } : undefined,
      });

      const result = mapSubscriptionsToListing([subscription]);

      expect(result[0]?.search).toBe(expectedSearch);
    });

    it.each([
      {
        description: 'resource object',
        subscriptions: [
          createSubscription({
            id: 'subscription-resource',
            currentState: {
              kind: 'custom',
              link: 'https://custom.example.com',
              resource: {
                name: 'my-custom-resource',
                type: 'custom-type',
              },
            },
          }),
        ],
        expectations: (result: TenantSubscriptionListing[]) => {
          expect(result[0]?.resource).toEqual({
            name: 'my-custom-resource',
            type: 'custom-type',
          });
        },
      },
      {
        description: 'subscription ids',
        subscriptions: [
          createSubscription({ id: 'unique-id-1' }),
          createSubscription({ id: 'unique-id-2' }),
          createSubscription({ id: 'unique-id-3' }),
        ],
        expectations: (result: TenantSubscriptionListing[]) => {
          expect(result.map((s) => s.id)).toEqual(['unique-id-1', 'unique-id-2', 'unique-id-3']);
        },
      },
    ])('should preserve $description correctly', ({ subscriptions, expectations }) => {
      const result = mapSubscriptionsToListing(subscriptions);

      expectations(result);
    });
  });
});
