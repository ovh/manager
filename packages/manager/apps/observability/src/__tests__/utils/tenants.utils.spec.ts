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

    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('should map tenants to listing format with all properties', () => {
      const mockTenants: Tenant[] = [
        {
          id: 'tenant-1',
          currentState: {
            title: 'Test Tenant',
            limits: {
              retention: { id: 'retention-1', duration: '30d' },
              numberOfSeries: { current: 100, maximum: 200 },
            },
            infrastructure: {
              id: 'infra-1',
              currentState: {
                entryPoint: 'https://example.com',
                location: 'GRA11',
                type: 'SHARED',
                usage: 'GRAFANA',
              },
            },
            tags: ['production', 'monitoring'],
          },
        },
      ];

      const result: TenantListing[] = mapTenantsToListing(mockTenants, mockDateFnsLocale);

      expect(result).toEqual([
        {
          id: 'tenant-1',
          name: 'Test Tenant',
          infrastructure: {
            id: 'infra-1',
            currentState: {
              entryPoint: 'https://example.com',
              location: 'GRA11',
              type: 'SHARED',
              usage: 'GRAFANA',
            },
          },
          endpoint: 'https://example.com',
          retention: 'formatted-30d',
          numberOfSeries: 100,
          tags: 'production;monitoring',
          tagsArray: ['production', 'monitoring'],
          search: 'Test Tenant https://example.com formatted-30d 100 production;monitoring',
        },
      ] as TenantListing[]);
    });

    it('should call formatDuration with correct parameters', () => {
      const mockTenants: Tenant[] = [
        {
          id: 'tenant-1',
          currentState: {
            title: 'Test Tenant',
            limits: {
              retention: { id: 'retention-1', duration: '30d' },
              numberOfSeries: { current: 100, maximum: 200 },
            },
            tags: [],
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
        tenant: {
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
            tags: [],
          },
        },
        expectations: (result: TenantListing) => {
          expect(result.retention).toBeUndefined();
          expect(result.numberOfSeries).toBeUndefined();
        },
      },
      {
        description: 'tenant without infrastructure',
        tenant: {
          id: 'tenant-3',
          currentState: {
            title: 'Tenant Without Infrastructure',
            limits: {
              retention: { id: 'retention-1', duration: '7d' },
              numberOfSeries: { current: 50, maximum: 100 },
            },
            tags: ['test'],
          },
        },
        expectations: (result: TenantListing) => {
          expect(result.infrastructure).toBeUndefined();
          expect(result.endpoint).toBeUndefined();
        },
      },
      {
        description: 'tenant without tags',
        tenant: {
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
        },
        expectations: (result: TenantListing) => {
          expect(result.tags).toBe('');
          expect(result.tagsArray).toEqual([]);
        },
      },
      {
        description: 'tenant with retention but without duration',
        tenant: {
          id: 'tenant-5',
          currentState: {
            title: 'Tenant With Partial Retention',
            limits: {
              numberOfSeries: { current: 150, maximum: 300 },
            },
            tags: [],
          },
        },
        expectations: (result: TenantListing) => {
          expect(result.retention).toBeUndefined();
        },
      },
    ])('should handle $description', ({ tenant, expectations }) => {
      const mockTenants: Tenant[] = [tenant as Tenant];
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
        {
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
            tags: ['first'],
          },
        },
        {
          id: 'tenant-2',
          currentState: {
            title: 'Second Tenant',
            limits: {
              retention: { id: 'retention-2', duration: '7d' },
              numberOfSeries: { current: 50, maximum: 100 },
            },
            tags: ['second', 'test'],
          },
        },
      ];

      const result = mapTenantsToListing(mockTenants, mockDateFnsLocale);

      expect(result).toHaveLength(2);
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
          tags: 'first',
          tagsArray: ['first'],
          search: 'First Tenant https://first.com formatted-30d 100 first',
        },
        {
          id: 'tenant-2',
          name: 'Second Tenant',
          infrastructure: undefined,
          endpoint: undefined,
          retention: 'formatted-7d',
          numberOfSeries: 50,
          tags: 'second;test',
          tagsArray: ['second', 'test'],
          search: 'Second Tenant  formatted-7d 50 second;test',
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
        {
          id: 'tenant-series',
          currentState: {
            title: 'Tenant With Series',
            limits: {
              numberOfSeries: { current: numberOfSeries, maximum: 100 },
            },
            tags: [],
          },
        },
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
        tags: ['tag1'],
        expectedJoined: 'tag1',
        expectedArray: ['tag1'],
      },
      {
        description: 'multiple tags',
        tags: ['tag1', 'tag2', 'tag3', 'tag4'],
        expectedJoined: 'tag1;tag2;tag3;tag4',
        expectedArray: ['tag1', 'tag2', 'tag3', 'tag4'],
      },
      {
        description: 'empty tags array',
        tags: [],
        expectedJoined: '',
        expectedArray: [],
      },
    ])(
      'should handle $description with semicolon separator',
      ({ tags, expectedJoined, expectedArray }) => {
        const mockTenants: Tenant[] = [
          {
            id: 'tenant-tags',
            currentState: {
              title: 'Tag Test Tenant',
              tags,
            },
          },
        ];

        const result = mapTenantsToListing(mockTenants, mockDateFnsLocale);

        expect(result).toHaveLength(1);
        const firstResult = result[0];
        expect(firstResult).toBeDefined();
        expect(firstResult?.tags).toBe(expectedJoined);
        expect(firstResult?.tagsArray).toEqual(expectedArray);
      },
    );

    it('should preserve tenant ids correctly', () => {
      const mockTenants: Tenant[] = [
        {
          id: 'unique-id-1',
          currentState: { title: 'Tenant 1', tags: [] },
        },
        {
          id: 'unique-id-2',
          currentState: { title: 'Tenant 2', tags: [] },
        },
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
          tags: '',
          tagsArray: [],
          search: 'Tenant 1    ',
        },
        {
          id: 'unique-id-2',
          name: 'Tenant 2',
          infrastructure: undefined,
          endpoint: undefined,
          retention: undefined,
          numberOfSeries: undefined,
          tags: '',
          tagsArray: [],
          search: 'Tenant 2    ',
        },
      ]);
    });
  });
});
