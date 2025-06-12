import { describe, it, expect, vi, beforeEach } from 'vitest';
import { v6 } from '@ovh-ux/manager-core-api';
import { FetchResultV6 } from '@ovh-ux/manager-react-components';
import { getServices } from './services';
import { TService } from '../types/service.type';

vi.mock('@ovh-ux/manager-core-api');

const mockedV6 = vi.mocked(v6.get);

describe('services API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getServices', () => {
    it('should call v6.get with correct parameters', async () => {
      const mockResponse: FetchResultV6<TService> = {
        data: [],
      };

      mockedV6.mockResolvedValue(mockResponse);

      const result = await getServices();

      expect(mockedV6).toHaveBeenCalledWith('/services', {
        headers: {
          'x-pagination-mode': 'CachedObjectList-Pages',
          'x-pagination-filter': `${encodeURIComponent(
            'route.path',
          )}:eq=${encodeURIComponent(
            '/cloud/project/{serviceName}',
          )}&${encodeURIComponent(
            'billing.lifecycle.current.state',
          )}:ne=${encodeURIComponent('terminated')}`,
        },
      });

      expect(result).toEqual(mockResponse);
    });

    it('should return services data successfully', async () => {
      const mockServices: TService[] = [
        {
          serviceId: 123,
          parentServiceId: null,
          route: {
            url: '/cloud/project/test-project-1',
            path: '/cloud/project/{serviceName}',
            vars: [{ key: 'serviceName', value: 'test-project-1' }],
          },
          billing: {
            plan: { code: 'project.2018', invoiceName: 'Public Cloud Project' },
            renew: null,
            pricing: {
              price: { text: '0.00 €', value: 0, currencyCode: 'EUR' },
              duration: 'P1M',
              interval: 1,
              capacities: [],
              description: 'Monthly billing',
              pricingMode: 'default',
              pricingType: 'purchase',
              maximumRepeat: null,
              minimumRepeat: 1,
              priceInUcents: 0,
              maximumQuantity: 1,
              minimumQuantity: 1,
            },
            lifecycle: {
              current: {
                state: 'active',
                creationDate: '2023-01-01T00:00:00Z',
                terminationDate: null,
              },
              capacities: { actions: ['terminate'] },
            },
            expirationDate: '2024-01-01T00:00:00Z',
            nextBillingDate: '2024-02-01T00:00:00Z',
          },
          customer: {
            contacts: [{ type: 'admin', customerCode: 'ab123456-ovh' }],
          },
          resource: {
            name: 'test-project-1',
            state: 'active',
            product: {
              name: 'Public Cloud',
              description: 'Public Cloud Project',
            },
            displayName: 'Test Project 1',
          },
        },
        {
          serviceId: 456,
          parentServiceId: null,
          route: {
            url: '/cloud/project/test-project-2',
            path: '/cloud/project/{serviceName}',
            vars: [{ key: 'serviceName', value: 'test-project-2' }],
          },
          billing: {
            plan: { code: 'project.2018', invoiceName: 'Public Cloud Project' },
            renew: null,
            pricing: {
              price: { text: '0.00 €', value: 0, currencyCode: 'EUR' },
              duration: 'P1M',
              interval: 1,
              capacities: [],
              description: 'Monthly billing',
              pricingMode: 'default',
              pricingType: 'purchase',
              maximumRepeat: null,
              minimumRepeat: 1,
              priceInUcents: 0,
              maximumQuantity: 1,
              minimumQuantity: 1,
            },
            lifecycle: {
              current: {
                state: 'active',
                creationDate: '2023-01-01T00:00:00Z',
                terminationDate: null,
              },
              capacities: { actions: ['terminate'] },
            },
            expirationDate: '2024-01-01T00:00:00Z',
            nextBillingDate: '2024-02-01T00:00:00Z',
          },
          customer: {
            contacts: [{ type: 'admin', customerCode: 'cd789012-ovh' }],
          },
          resource: {
            name: 'test-project-2',
            state: 'active',
            product: {
              name: 'Public Cloud',
              description: 'Public Cloud Project',
            },
            displayName: 'Test Project 2',
          },
        },
      ];

      const mockResponse: FetchResultV6<TService> = {
        data: mockServices,
      };

      mockedV6.mockResolvedValue(mockResponse);

      const result = await getServices();

      expect(result.data).toHaveLength(2);
      expect(result.data[0].resource.name).toBe('test-project-1');
      expect(result.data[1].resource.name).toBe('test-project-2');
      expect(result.data[0].billing.lifecycle.current.state).toBe('active');
    });

    it('should handle API errors', async () => {
      const mockError = new Error('API Error');
      mockedV6.mockRejectedValue(mockError);

      await expect(getServices()).rejects.toThrow('API Error');
    });

    it('should encode filter parameters correctly', async () => {
      const mockResponse: FetchResultV6<TService> = {
        data: [],
      };

      mockedV6.mockResolvedValue(mockResponse);

      await getServices();

      const expectedFilter = `${encodeURIComponent(
        'route.path',
      )}:eq=${encodeURIComponent(
        '/cloud/project/{serviceName}',
      )}&${encodeURIComponent(
        'billing.lifecycle.current.state',
      )}:ne=${encodeURIComponent('terminated')}`;

      expect(mockedV6).toHaveBeenCalledWith('/services', {
        headers: expect.objectContaining({
          'x-pagination-filter': expectedFilter,
        }),
      });
    });
  });
});
