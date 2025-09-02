import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TProject } from '@ovh-ux/manager-pci-common';
import { FetchResultV6 } from '@ovh-ux/manager-react-components';
import { v6 } from '@ovh-ux/manager-core-api';
import {
  getProjects,
  unFavProject,
  getDefaultProject,
  removeProject,
} from './projects';

const mockedV6Get = vi.mocked(v6.get);
const mockedV6Delete = vi.mocked(v6.delete);
const mockedV6Post = vi.mocked(v6.post);

describe('getProjects', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call v6.get with correct endpoint and headers', async () => {
    const mockResponse: FetchResultV6<TProject> = {
      data: [],
    };

    mockedV6Get.mockResolvedValue(mockResponse);

    await getProjects();

    expect(mockedV6Get).toHaveBeenCalledWith('/cloud/project', {
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

    mockedV6Get.mockResolvedValue(mockResponse);

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

    mockedV6Get.mockResolvedValue(mockResponse);

    const result = await getProjects();

    expect(result).toEqual(mockResponse);
    expect(result.data).toHaveLength(0);
  });

  it('should throw error when API call fails', async () => {
    const mockError = new Error('API Error');
    mockedV6Get.mockRejectedValue(mockError);

    await expect(getProjects()).rejects.toThrow('API Error');
  });

  it('should handle API error responses properly', async () => {
    const mockErrorResponse: FetchResultV6<TProject> = {
      data: [],
    };

    mockedV6Get.mockResolvedValue(mockErrorResponse);

    const result = await getProjects();

    expect(result.data).toEqual([]);
  });
});

describe('unFavProject', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call v6.delete with correct endpoint', async () => {
    const mockResponse = {
      data: { success: true },
    };

    mockedV6Delete.mockResolvedValue(mockResponse);

    await unFavProject();

    expect(mockedV6Delete).toHaveBeenCalledWith(
      'me/preferences/manager/PUBLIC_CLOUD_DEFAULT_PROJECT',
    );
  });

  it('should return response data when API call succeeds', async () => {
    const mockResponse = {
      data: { success: true },
    };

    mockedV6Delete.mockResolvedValue(mockResponse);

    const result = await unFavProject();

    expect(result).toEqual({ success: true });
  });

  it('should throw error when API call fails', async () => {
    const mockError = new Error('API Error');
    mockedV6Delete.mockRejectedValue(mockError);

    await expect(unFavProject()).rejects.toThrow('API Error');
  });

  it('should handle empty response data', async () => {
    const mockResponse = {
      data: null,
    };

    mockedV6Delete.mockResolvedValue(mockResponse);

    const result = await unFavProject();

    expect(result).toBeNull();
  });
});

describe('getDefaultProject', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call v6.get with correct endpoint', async () => {
    const mockResponse = {
      data: {
        value: JSON.stringify({ projectId: 'test-project-123' }),
      },
    };

    mockedV6Get.mockResolvedValue(mockResponse);

    await getDefaultProject();

    expect(mockedV6Get).toHaveBeenCalledWith(
      'me/preferences/manager/PUBLIC_CLOUD_DEFAULT_PROJECT',
    );
  });

  it('should return parsed project data when API call succeeds', async () => {
    const mockResponse = {
      data: {
        value: JSON.stringify({ projectId: 'test-project-123' }),
      },
    };

    mockedV6Get.mockResolvedValue(mockResponse);

    const result = await getDefaultProject();

    expect(result).toEqual({ projectId: 'test-project-123' });
  });

  it('should return null when API call fails', async () => {
    const mockError = new Error('API Error');
    mockedV6Get.mockRejectedValue(mockError);

    const result = await getDefaultProject();

    expect(result).toBeNull();
  });

  it('should handle invalid JSON data', async () => {
    const mockResponse = {
      data: {
        value: 'invalid-json',
      },
    };

    mockedV6Get.mockResolvedValue(mockResponse);

    const result = await getDefaultProject();

    expect(result).toBeNull();
  });
});

describe('removeProject', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call v6.post with correct endpoint for non-US project', async () => {
    const mockResponse = { data: { success: true } };
    mockedV6Post.mockResolvedValue(mockResponse);

    const params = {
      projectId: 'test-project-123',
    };

    await removeProject(params);

    expect(mockedV6Post).toHaveBeenCalledWith(
      'cloud/project/test-project-123/terminate',
    );
  });

  it('should call v6.delete with correct endpoint for US project', async () => {
    const mockResponse = { data: { success: true } };
    mockedV6Delete.mockResolvedValue(mockResponse);

    const params = {
      projectId: 'test-project-123',
      serviceId: 'service-123',
      isUs: true,
    };

    await removeProject(params);

    expect(mockedV6Delete).toHaveBeenCalledWith('/services/service-123');
  });

  it('should handle API error for non-US project', async () => {
    const mockError = new Error('API Error');
    mockedV6Post.mockRejectedValue(mockError);

    const params = {
      projectId: 'test-project-123',
    };

    await expect(removeProject(params)).rejects.toThrow('API Error');
  });

  it('should handle API error for US project', async () => {
    const mockError = new Error('API Error');
    mockedV6Delete.mockRejectedValue(mockError);

    const params = {
      projectId: 'test-project-123',
      serviceId: 'service-123',
      isUs: true,
    };

    await expect(removeProject(params)).rejects.toThrow('API Error');
  });

  it('should handle missing serviceId for US project', async () => {
    const params = {
      projectId: 'test-project-123',
      isUs: true,
    };

    await expect(removeProject(params)).rejects.toThrow();
  });
});
