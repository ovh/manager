import { renderHook, waitFor } from '@testing-library/react';
import { vi, describe, it } from 'vitest';
import { getProject, TProject } from '../data/project';
import { useProject } from './useProject';
import { wrapper } from '@/wrapperRenders';

vi.mock('../data/project', () => ({
  getProject: vi.fn(),
}));

describe('useProject', () => {
  it('returns project data successfully with provided projectId', async () => {
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
    } as TProject;
    vi.mocked(getProject).mockResolvedValueOnce(mockData);
    const { result } = renderHook(() => useProject('project1'), {
      wrapper,
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockData);
  });

  it('returns project data successfully with default projectId from useParams', async () => {
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
    } as TProject;
    vi.mocked(getProject).mockResolvedValueOnce(mockData);
    const { result } = renderHook(() => useProject(), {
      wrapper,
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockData);
  });

  it('throws an error when API call fails', async () => {
    const errorMessage = 'Network Error';
    vi.mocked(getProject).mockRejectedValueOnce(new Error(errorMessage));
    const { result } = renderHook(() => useProject('project1'), {
      wrapper,
    });
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error.message).toBe(errorMessage);
  });
});
