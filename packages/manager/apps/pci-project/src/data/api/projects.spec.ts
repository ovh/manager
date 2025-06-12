import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TProject } from '@ovh-ux/manager-pci-common';
import { FetchResultV6 } from '@ovh-ux/manager-react-components';
import { v6 } from '@ovh-ux/manager-core-api';
import { getProjects } from './projects';

const mockedV6 = vi.mocked(v6.get);

describe('getProjects', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call v6.get with correct endpoint and headers', async () => {
    const mockResponse: FetchResultV6<TProject> = {
      data: [],
    };

    mockedV6.mockResolvedValue(mockResponse);

    await getProjects();

    expect(mockedV6).toHaveBeenCalledWith('/cloud/project', {
      headers: {
        'x-pagination-mode': 'CachedObjectList-Pages',
      },
    });
  });

  it('should return project data when API call succeeds', async () => {
    const mockProjects: TProject[] = [
      {
        project_id: 'project-1',
        projectName: 'Test Project 1',
        description: 'Test description 1',
        status: 'ok',
        creationDate: '2023-01-01T00:00:00Z',
        planCode: 'project.discovery',
        unleash: true,
        orderId: null,
        expiration: null,
        access: 'full',
      } as TProject,
      {
        project_id: 'project-2',
        projectName: 'Test Project 2',
        description: 'Test description 2',
        status: 'suspended',
        creationDate: '2023-01-02T00:00:00Z',
        planCode: 'project.standard',
        unleash: false,
        orderId: null,
        expiration: '2024-01-01T00:00:00Z',
        access: 'restricted',
      } as TProject,
    ];

    const mockResponse: FetchResultV6<TProject> = {
      data: mockProjects,
    };

    mockedV6.mockResolvedValue(mockResponse);

    const result = await getProjects();

    expect(result).toEqual(mockResponse);
    expect(result.data).toHaveLength(2);
    expect(result.data[0].project_id).toBe('project-1');
    expect(result.data[1].project_id).toBe('project-2');
  });

  it('should return empty array when no projects exist', async () => {
    const mockResponse: FetchResultV6<TProject> = {
      data: [],
    };

    mockedV6.mockResolvedValue(mockResponse);

    const result = await getProjects();

    expect(result).toEqual(mockResponse);
    expect(result.data).toHaveLength(0);
  });

  it('should throw error when API call fails', async () => {
    const mockError = new Error('API Error');
    mockedV6.mockRejectedValue(mockError);

    await expect(getProjects()).rejects.toThrow('API Error');
  });

  it('should handle API error responses properly', async () => {
    const mockErrorResponse: FetchResultV6<TProject> = {
      data: [],
    };

    mockedV6.mockResolvedValue(mockErrorResponse);

    const result = await getProjects();

    expect(result.data).toEqual([]);
  });
});
