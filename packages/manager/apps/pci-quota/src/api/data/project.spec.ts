import { describe, expect, it, vi } from 'vitest';
import { v6 } from '@ovh-ux/manager-core-api';
import { getProject } from '@ovh-ux/manager-pci-common';
import { toggleManualQuota, unleash } from './project';

describe('getProject', () => {
  it('returns project data successfully', async () => {
    const mockData = {
      access: 'full',
      creationDate: '2023-01-01T00:00:00Z',
      description: 'Test Project',
      expiration: null,
      iam: {
        displayName: 'Test IAM',
        id: 'iam1',
        tags: { key1: 'value1' },
        urn: 'urn:ovh:iam:iam1',
      },
      manualQuota: false,
      orderId: 12345,
      planCode: 'plan1',
      projectName: 'Test Project',
      project_id: 'project1',
      status: 'ok',
      unleash: true,
    };
    vi.mocked(v6.get).mockResolvedValueOnce({ data: mockData });
    const result = await getProject('project1');
    expect(result).toEqual(mockData);
  });

  it('throws an error when API call fails', async () => {
    const errorMessage = 'Network Error';
    vi.mocked(v6.get).mockRejectedValueOnce(new Error(errorMessage));
    await expect(getProject('project1')).rejects.toThrow(errorMessage);
  });

  it('returns project data with optional fields missing', async () => {
    const mockData = {
      access: 'restricted',
      creationDate: '2023-01-01T00:00:00Z',
      iam: {
        id: 'iam1',
        urn: 'urn:ovh:iam:iam1',
      },
      manualQuota: true,
      orderId: null,
      planCode: 'plan2',
      projectName: null,
      project_id: 'project2',
      status: 'creating',
      unleash: false,
    };
    vi.mocked(v6.get).mockResolvedValueOnce({ data: mockData });
    const result = await getProject('project2');
    expect(result).toEqual(mockData);
  });
});
describe('unleash', () => {
  it('unleashes the project successfully', async () => {
    const projectId = 'project1';
    const mockResponse = { status: 200 };
    vi.mocked(v6.post).mockResolvedValueOnce(mockResponse);
    const result = await unleash(projectId);
    expect(result).toEqual(mockResponse);
  });

  it('throws an error when unleash API call fails', async () => {
    const projectId = 'project1';
    const errorMessage = 'Network Error';
    vi.mocked(v6.post).mockRejectedValueOnce(new Error(errorMessage));
    await expect(unleash(projectId)).rejects.toThrow(errorMessage);
  });
});

describe('toggleManualQuota', () => {
  it('activates manual quota successfully', async () => {
    const projectId = 'project1';
    const isActive = true;
    vi.mocked(v6.put).mockResolvedValueOnce({ status: 200 });
    await expect(toggleManualQuota(projectId, isActive)).resolves.not.toThrow();
  });

  it('deactivates manual quota successfully', async () => {
    const projectId = 'project1';
    const isActive = false;
    vi.mocked(v6.put).mockResolvedValueOnce({ status: 200 });
    await expect(toggleManualQuota(projectId, isActive)).resolves.not.toThrow();
  });

  it('throws an error when toggleManualQuota API call fails', async () => {
    const projectId = 'project1';
    const isActive = true;
    const errorMessage = 'Network Error';
    vi.mocked(v6.put).mockRejectedValueOnce(new Error(errorMessage));
    await expect(toggleManualQuota(projectId, isActive)).rejects.toThrow(
      errorMessage,
    );
  });
});
