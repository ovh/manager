import { Locale } from 'date-fns';
import { describe, expect, it, vi } from 'vitest';

import { Tenant, TenantListing } from '@/types/tenants.type';
import { formatDuration } from '@/utils/duration.utils';
import { mapTenantsToListing } from '@/utils/tenants.utils';

// Mock formatDuration to return a predictable value
vi.mock('@/utils/duration.utils', () => ({
  formatDuration: vi.fn((duration: string) => `formatted-${duration}`),
}));

describe('tenants.utils', () => {
  describe('mapTenantsToListing', () => {
    const mockDateFnsLocale = { code: 'en-US' } as Locale;

    const createTenant = (overrides: Partial<Tenant>): Tenant => {
      const baseTenant: Tenant = {
        id: 'tenant-default',
        createdAt: '2025-11-21T14:26:14.041Z',
        updatedAt: '2025-11-21T14:26:14.041Z',
        currentState: {
          title: 'Default Tenant',
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
            numberOfSeries: {
              current: 222,
              maximum: 300,
            },
            retention: {
              id: 'retention-1',
              duration: 'P6M',
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
          endpoint: 'sbg1.metrics.ovh.com',
          retention: 'formatted-P6M',
          numberOfSeries: 222,
          tags: expectedTags,
          search: `Tenant 1 sbg1.metrics.ovh.com formatted-P6M 222 ${expectedTagsStr}`,
        },
      ]);
    });

    it('should call formatDuration with correct parameters', () => {
      const mockTenants: Tenant[] = [
        {
          id: 'tenant-1',
          createdAt: '2025-11-21T14:26:14.041Z',
          updatedAt: '2025-11-21T14:26:14.041Z',
          iam: {
            id: '92c16299-3f5b-4ea9-a806-e0464e7bfa31',
            urn: 'urn:v1:eu:resource:ldp:ldp-sbg-55078',
          },
          currentState: {
            title: 'Test Tenant',
            limits: {
              retention: { id: 'retention-1', duration: '30d' },
              numberOfSeries: { current: 100, maximum: 200 },
            },
          },
        },
      ];

      mapTenantsToListing(mockTenants, mockDateFnsLocale);

      expect(formatDuration).toHaveBeenCalledWith('30d', mockDateFnsLocale);
      expect(formatDuration).toHaveBeenCalledTimes(1);
    });

    it.each([
      {
        description: 'tenant without limits',
        tenant: createTenant({
          id: 'tenant-2',
          currentState: {
            title: 'Tenant Without Limits',
            infrastructure: {
              id: 'infra-2',
              currentState: {
                entryPoint: 'https://test.com',
                location: 'GRA11',
                type: 'SHARED',
                usage: 'GRAFANA',
              },
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
            limits: {
              retention: { id: 'retention-1', duration: '7d' },
              numberOfSeries: { current: 50, maximum: 100 },
            },
          },
        }),
        expectations: (result: TenantListing) => {
          expect(result.infrastructure).toBeUndefined();
          expect(result.endpoint).toBeUndefined();
        },
      },
      {
        description: 'tenant without tags',
        tenant: createTenant({
          id: 'tenant-4',
          currentState: {
            title: 'Tenant Without Tags',
            limits: {
              retention: { id: 'retention-1', duration: '90d' },
              numberOfSeries: { current: 200, maximum: 500 },
            },
            infrastructure: {
              id: 'infra-4',
              currentState: {
                entryPoint: 'https://no-tags.com',
                location: 'GRA11',
                type: 'SHARED',
                usage: 'GRAFANA',
              },
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
        description: 'tenant with retention but without duration',
        tenant: createTenant({
          id: 'tenant-5',
          currentState: {
            title: 'Tenant With Partial Retention',
            limits: {
              numberOfSeries: { current: 150, maximum: 300 },
              retention: { id: 'retention-2', duration: '' },
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
            limits: {
              retention: { id: 'retention-1', duration: '30d' },
              numberOfSeries: { current: 100, maximum: 200 },
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
            limits: {
              retention: { id: 'retention-1', duration: '30d' },
              numberOfSeries: { current: 100, maximum: 200 },
            },
            infrastructure: {
              id: 'infra-1',
              currentState: {
                entryPoint: 'https://first.com',
                location: 'GRA11',
                type: 'SHARED',
                usage: 'GRAFANA',
              },
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
            limits: {
              retention: { id: 'retention-2', duration: '7d' },
              numberOfSeries: { current: 50, maximum: 100 },
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
            currentState: {
              entryPoint: 'https://first.com',
              location: 'GRA11',
              type: 'SHARED',
              usage: 'GRAFANA',
            },
          },
          endpoint: 'https://first.com',
          retention: 'formatted-30d',
          numberOfSeries: 100,
          tags: expectedFirstTags,
          search: `First Tenant https://first.com formatted-30d 100 team:alpha`,
        },
        {
          id: 'tenant-2',
          name: 'Second Tenant',
          infrastructure: undefined,
          endpoint: undefined,
          retention: 'formatted-7d',
          numberOfSeries: 50,
          tags: expectedSecondTags,
          search: `Second Tenant  formatted-7d 50 team:beta;env:test`,
        },
      ]);
    });

    it('should handle empty tenant array', () => {
      const mockTenants: Tenant[] = [];
      const result = mapTenantsToListing(mockTenants, mockDateFnsLocale);
      expect(result).toEqual([]);
    });

    it.each([
      {
        description: 'zero current value',
        numberOfSeries: 0,
        expected: 0,
      },
      {
        description: 'positive current value',
        numberOfSeries: 100,
        expected: 100,
      },
    ])('should handle numberOfSeries with $description', ({ numberOfSeries, expected }) => {
      const mockTenants: Tenant[] = [
        createTenant({
          id: 'tenant-series',
          currentState: {
            title: 'Tenant With Series',
            limits: {
              numberOfSeries: { current: numberOfSeries, maximum: 100 },
            },
          },
        }),
      ];

      const result = mapTenantsToListing(mockTenants, mockDateFnsLocale);

      expect(result).toHaveLength(1);
      const firstResult = result[0];
      expect(firstResult).toBeDefined();
      expect(firstResult?.numberOfSeries).toBe(expected);
    });

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

    it('should preserve tenant ids correctly', () => {
      const mockTenants: Tenant[] = [
        createTenant({
          id: 'unique-id-1',
          currentState: { title: 'Tenant 1' },
        }),
        createTenant({
          id: 'unique-id-2',
          currentState: { title: 'Tenant 2' },
        }),
      ];

      const result = mapTenantsToListing(mockTenants, mockDateFnsLocale);

      expect(result).toEqual([
        {
          id: 'unique-id-1',
          name: 'Tenant 1',
          infrastructure: undefined,
          endpoint: undefined,
          retention: undefined,
          numberOfSeries: undefined,
          tags: {},
          search: 'Tenant 1    ',
        },
        {
          id: 'unique-id-2',
          name: 'Tenant 2',
          infrastructure: undefined,
          endpoint: undefined,
          retention: undefined,
          numberOfSeries: undefined,
          tags: {},
          search: 'Tenant 2    ',
        },
      ]);
    });

    it('should handle tenant without infrastructure currentState', () => {
      const mockTenants: Tenant[] = [
        createTenant({
          id: 'tenant-no-infra-state',
          currentState: {
            title: 'Tenant Without Infra State',
            infrastructure: {
              id: 'infra-id',
              currentState: {
                entryPoint: 'test-endpoint.com',
                location: 'GRA11',
                type: 'SHARED',
                usage: 'METRICS',
              },
            },
          },
        }),
      ];

      const result = mapTenantsToListing(mockTenants, mockDateFnsLocale);

      expect(result).toHaveLength(1);
      expect(result[0]?.endpoint).toBe('test-endpoint.com');
      expect(result[0]?.infrastructure).toBeDefined();
    });

    it('should format search string correctly with all optional fields', () => {
      const mockTenants: Tenant[] = [
        createTenant({
          id: 'tenant-search',
          currentState: {
            title: 'Search Test',
            limits: {
              retention: { id: 'ret-1', duration: 'P1M' },
              numberOfSeries: { current: 42, maximum: 100 },
            },
            infrastructure: {
              id: 'infra-search',
              currentState: {
                entryPoint: 'search.example.com',
                location: 'GRA11',
                type: 'SHARED',
                usage: 'METRICS',
              },
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
        'Search Test search.example.com formatted-P1M 42 env:prod;team:backend',
      );
    });
  });
});
