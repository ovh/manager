import { vi, test, expect, beforeEach, afterEach } from 'vitest';
import { v6 } from '@ovh-ux/manager-core-api';
import {
  getAllRegistries,
  getRegistry,
  deleteRegistry,
  createRegistry,
  updatePlan,
  TRegistry,
} from './registry';

vi.mock('@ovh-ux/manager-core-api');

describe('Registry API Tests', () => {
  const projectId = 'test-project-id';
  const registryId = 'test-registry-id';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('getAllRegistries should return a list of registries', async () => {
    const mockData: TRegistry[] = [
      {
        createdAt: '2024-01-01',
        deliveredAt: '2024-01-02',
        id: 'registry1',
        name: 'Test Registry',
        notary_url: 'https://example.com/notary',
        region: 'GRA',
        size: 1024,
        status: 'READY',
        updatedAt: '2024-01-03',
        url: 'https://example.com/registry',
        version: '1.0',
        iamEnabled: false,
        plan: {
          id: 'plan1',
          name: 'SMALL',
          createdAt: '2024-01-01',
          updatedAt: '2024-01-02',
          registryLimits: {
            imageStorage: 100,
            parallelRequest: 10,
          },
          features: {
            vulnerability: true,
          },
          code: 'PLAN_CODE',
        },
      },
    ];

    vi.mocked(v6.get).mockResolvedValue({ data: mockData });

    const result = await getAllRegistries(projectId);
    expect(result).toEqual(mockData);
    expect(v6.get).toHaveBeenCalledWith(
      `cloud/project/${projectId}/containerRegistry`,
    );
  });

  test('getRegistry should return a single registry', async () => {
    const mockData: TRegistry = {
      createdAt: '2024-01-01',
      deliveredAt: '2024-01-02',
      id: registryId,
      name: 'Test Registry',
      notary_url: 'https://example.com/notary',
      region: 'GRA',
      size: 1024,
      status: 'READY',
      updatedAt: '2024-01-03',
      url: 'https://example.com/registry',
      version: '1.0',
      iamEnabled: false,
      plan: {
        id: 'plan1',
        name: 'SMALL',
        createdAt: '2024-01-01',
        updatedAt: '2024-01-02',
        registryLimits: {
          imageStorage: 100,
          parallelRequest: 10,
        },
        features: {
          vulnerability: true,
        },
        code: 'PLAN_CODE',
      },
    };

    vi.mocked(v6.get).mockResolvedValue({ data: mockData });

    const result = await getRegistry(projectId, registryId);
    expect(result).toEqual(mockData);
    expect(v6.get).toHaveBeenCalledWith(
      `cloud/project/${projectId}/containerRegistry/${registryId}`,
    );
  });

  test('deleteRegistry should delete a registry', async () => {
    vi.mocked(v6.delete).mockResolvedValue({ data: 'success' });

    const result = await deleteRegistry(projectId, registryId);
    expect(result).toBe('success');
    expect(v6.delete).toHaveBeenCalledWith(
      `/cloud/project/${projectId}/containerRegistry/${registryId}`,
    );
  });

  test('createRegistry should create a new registry', async () => {
    const payload = {
      name: 'New Registry',
      planID: 'plan1',
      region: 'GRA',
    };
    const mockResponse = {
      id: 'new-registry-id',
      name: payload.name,
      region: payload.region,
      status: 'INSTALLING',
      createdAt: '2024-01-04',
      deliveredAt: '2024-01-05',
      updatedAt: '2024-01-06',
      url: 'https://example.com/new-registry',
      version: '1.0',
    };

    vi.mocked(v6.post).mockResolvedValue({ data: mockResponse });

    const result = await createRegistry(projectId, payload);
    expect(result).toEqual(mockResponse);
    expect(v6.post).toHaveBeenCalledWith(
      `/cloud/project/${projectId}/containerRegistry`,
      payload,
    );
  });

  test('updatePlan should update the plan', async () => {
    const planId = 'new-plan-id';
    vi.mocked(v6.put).mockResolvedValue({ data: 'success' });

    const result = await updatePlan(projectId, registryId, planId);
    expect(result).toBe('success');
    expect(v6.put).toHaveBeenCalledWith(
      `/cloud/project/${projectId}/containerRegistry/${registryId}/plan`,
      {
        planID: planId,
      },
    );
  });
});
