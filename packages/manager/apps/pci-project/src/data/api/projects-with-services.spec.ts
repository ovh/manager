import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TProject } from '@ovh-ux/manager-pci-common';
import {
  getProjectsWithServices,
  projectsWithServiceQueryKey,
} from './projects-with-services';
import { TService } from '../types/service.type';

import { getProjects } from './projects';
import { getServices } from './services';

// Mock the API functions
vi.mock('./projects', () => ({
  getProjects: vi.fn(),
  getDefaultProject: vi.fn(),
}));

vi.mock('./services', () => ({
  getServices: vi.fn(),
}));

const mockGetProjects = vi.mocked(getProjects);
const mockGetServices = vi.mocked(getServices);

describe('getProjectsWithServices', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockProjects: TProject[] = [
    {
      project_id: 'project-1',
      description: 'Project Alpha',
      status: 'ok',
      planCode: 'standard',
      unleash: true,
      creationDate: '2023-01-01T00:00:00Z',
      expiration: null,
      orderId: 123,
      access: 'full',
    } as TProject,
    {
      project_id: 'project-2',
      description: 'Project Beta',
      status: 'creating',
      planCode: 'premium',
      unleash: false,
      creationDate: '2023-02-01T00:00:00Z',
      expiration: null,
      orderId: 456,
      access: 'restricted',
    } as TProject,
    {
      project_id: 'project-3',
      description: 'Project Charlie',
      status: 'deleting',
      planCode: 'basic',
      unleash: true,
      creationDate: '2023-03-01T00:00:00Z',
      expiration: '2024-01-01T00:00:00Z',
      orderId: 789,
      access: 'full',
    } as TProject,
  ];

  const mockServices: TService[] = [
    {
      serviceId: 1,
      parentServiceId: null,
      route: {
        url: '/service/1',
        path: '/service/{serviceId}',
        vars: [{ key: 'serviceId', value: '1' }],
      },
      billing: {
        plan: { code: 'standard', invoiceName: 'Standard Plan' },
        renew: null,
        pricing: {
          price: { text: '10.00 EUR', value: 10, currencyCode: 'EUR' },
          duration: 'P1M',
          interval: 1,
          capacities: ['renew'],
          description: 'Monthly billing',
          pricingMode: 'default',
          pricingType: 'rental',
          maximumRepeat: null,
          minimumRepeat: 1,
          priceInUcents: 1000,
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
        nextBillingDate: '2023-12-01T00:00:00Z',
      },
      customer: {
        contacts: [{ type: 'admin', customerCode: 'admin123' }],
      },
      resource: {
        name: 'project-1',
        state: 'active',
        product: { name: 'PCI', description: 'Public Cloud Instance' },
        displayName: 'Project Alpha Service',
      },
    },
    {
      serviceId: 2,
      parentServiceId: null,
      route: {
        url: '/service/2',
        path: '/service/{serviceId}',
        vars: [{ key: 'serviceId', value: '2' }],
      },
      billing: {
        plan: { code: 'premium', invoiceName: 'Premium Plan' },
        renew: null,
        pricing: {
          price: { text: '20.00 EUR', value: 20, currencyCode: 'EUR' },
          duration: 'P1M',
          interval: 1,
          capacities: ['renew'],
          description: 'Monthly billing',
          pricingMode: 'default',
          pricingType: 'rental',
          maximumRepeat: null,
          minimumRepeat: 1,
          priceInUcents: 2000,
          maximumQuantity: 1,
          minimumQuantity: 1,
        },
        lifecycle: {
          current: {
            state: 'unpaid',
            creationDate: '2023-02-01T00:00:00Z',
            terminationDate: null,
          },
          capacities: { actions: ['terminate'] },
        },
        expirationDate: '2024-02-01T00:00:00Z',
        nextBillingDate: '2023-12-01T00:00:00Z',
      },
      customer: {
        contacts: [{ type: 'admin', customerCode: 'admin456' }],
      },
      resource: {
        name: 'project-2',
        state: 'suspended',
        product: { name: 'PCI', description: 'Public Cloud Instance' },
        displayName: 'Project Beta Service',
      },
    },
  ];

  it('should return projects with their corresponding services and correct aggregated status', async () => {
    mockGetProjects.mockResolvedValue({ data: mockProjects });
    mockGetServices.mockResolvedValue({ data: mockServices });

    const result = await getProjectsWithServices();

    expect(result.data).toHaveLength(2);

    const projectAlpha = result.data.find((p) => p.project_id === 'project-1');
    expect(projectAlpha).toBeDefined();
    expect(projectAlpha?.service.serviceId).toBe(1);
    expect(projectAlpha?.aggregatedStatus).toBe('ok'); // Service is active, so uses project status

    const projectBeta = result.data.find((p) => p.project_id === 'project-2');
    expect(projectBeta).toBeDefined();
    expect(projectBeta?.service.serviceId).toBe(2);
    expect(projectBeta?.aggregatedStatus).toBe('unpaid'); // Service is unpaid, so overrides project status
  });

  it('should exclude projects without corresponding services', async () => {
    mockGetProjects.mockResolvedValue({ data: mockProjects });
    mockGetServices.mockResolvedValue({ data: [mockServices[0]] }); // Only first service

    const result = await getProjectsWithServices();

    expect(result.data).toHaveLength(1);
    expect(result.data[0].project_id).toBe('project-1');
  });

  it('should sort projects by description', async () => {
    const unsortedProjects = [
      { ...mockProjects[1], description: 'Zebra Project' },
      { ...mockProjects[0], description: 'Alpha Project' },
    ];

    const correspondingServices = [
      {
        ...mockServices[1],
        resource: { ...mockServices[1].resource, name: 'project-2' },
      },
      {
        ...mockServices[0],
        resource: { ...mockServices[0].resource, name: 'project-1' },
      },
    ];

    mockGetProjects.mockResolvedValue({ data: unsortedProjects });
    mockGetServices.mockResolvedValue({ data: correspondingServices });

    const result = await getProjectsWithServices();

    expect(result.data).toHaveLength(2);
    expect(result.data[0].description).toBe('Alpha Project');
    expect(result.data[1].description).toBe('Zebra Project');
  });

  it('should handle empty projects and services arrays', async () => {
    mockGetProjects.mockResolvedValue({ data: [] });
    mockGetServices.mockResolvedValue({ data: [] });

    const result = await getProjectsWithServices();

    expect(result.data).toHaveLength(0);
  });

  it('should handle projects with undefined description for sorting', async () => {
    const projectsWithUndefinedDesc = [
      { ...mockProjects[0], description: undefined },
      { ...mockProjects[1], description: 'Beta Project' },
    ];

    mockGetProjects.mockResolvedValue({ data: projectsWithUndefinedDesc });
    mockGetServices.mockResolvedValue({ data: mockServices });

    const result = await getProjectsWithServices();

    expect(result.data).toHaveLength(2);
    // Project with undefined description should come first (empty string comparison)
    expect(result.data[0].description).toBeUndefined();
    expect(result.data[1].description).toBe('Beta Project');
  });

  it('should correctly set aggregated status based on service billing state and remove "terminated" projects', async () => {
    const testCases = [
      { serviceState: 'active', projectStatus: 'ok', expectedAggregated: 'ok' },
      {
        serviceState: 'unpaid',
        projectStatus: 'ok',
        expectedAggregated: 'unpaid',
      },
      {
        serviceState: 'unpaid',
        projectStatus: 'creating',
        expectedAggregated: 'unpaid',
      },
      {
        serviceState: 'terminated',
        projectStatus: 'deleting',
        expectedAggregated: 'deleting',
      },
    ];

    const results = await Promise.all(
      testCases.map(async (testCase) => {
        const testProject: TProject = {
          ...mockProjects[0],
          status: testCase.projectStatus as TProject['status'],
        };

        const testService: TService = {
          ...mockServices[0],
          billing: {
            ...mockServices[0].billing,
            lifecycle: {
              ...mockServices[0].billing.lifecycle,
              current: {
                ...mockServices[0].billing.lifecycle.current,
                state: testCase.serviceState as TService['billing']['lifecycle']['current']['state'],
              },
            },
          },
        };

        mockGetProjects.mockResolvedValue({ data: [testProject] });
        mockGetServices.mockResolvedValue({ data: [testService] });

        const result = await getProjectsWithServices();
        return {
          result: result.data[0].aggregatedStatus,
          expected: testCase.expectedAggregated,
        };
      }),
    );

    results.forEach(({ result, expected }) => {
      expect(result).toBe(expected);
    });
  });
});

describe('projectsWithServiceQueryKey', () => {
  it('should return correct query key array', () => {
    const queryKey = projectsWithServiceQueryKey();
    expect(queryKey).toEqual([
      '/services',
      '/cloud/project',
      'me/preferences/manager/PUBLIC_CLOUD_DEFAULT_PROJECT',
    ]);
  });
});
