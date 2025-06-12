import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import useActiveProjects from './useActiveProjects';
import * as projectsApi from '@/data/api/projects-with-services';
import { TProjectWithService } from '@/data/types/project.type';
import { createWrapper } from '@/wrapperRenders';

// Mock the API module
vi.mock('@/data/api/projects-with-services', () => ({
  getProjectsWithServices: vi.fn(),
  projectsWithServiceQueryKey: vi.fn(() => 'projects-with-services--active'),
}));

const mockGetProjectsWithServices = vi.mocked(
  projectsApi.getProjectsWithServices,
);
const mockProjectsWithServiceQueryKey = vi.mocked(
  projectsApi.projectsWithServiceQueryKey,
);

// Test data
const mockProjectsData: TProjectWithService[] = [
  {
    project_id: '1',
    description: 'Project 1',
    status: 'ok',
  } as TProjectWithService,
  {
    project_id: '2',
    description: 'Project 2',
    status: 'suspended',
  } as TProjectWithService,
  {
    project_id: '3',
    description: 'Project 3',
    status: 'ok',
  } as TProjectWithService,
  {
    project_id: '4',
    description: 'Project 4',
    status: 'creating',
  } as TProjectWithService,
];

describe('useActiveProjects', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return loading state initially', () => {
    mockGetProjectsWithServices.mockImplementation(() =>
      Promise.resolve({ data: [] }),
    );
    mockProjectsWithServiceQueryKey.mockReturnValue([
      'projects-with-services--active--loading',
    ]);

    const { result } = renderHook(() => useActiveProjects(), {
      wrapper: createWrapper(),
    });

    expect(result.current.activeProjects).toEqual([]);
    expect(result.current.isReady).toBe(false);
  });

  it('should return filtered active projects when data is loaded successfully', async () => {
    mockGetProjectsWithServices.mockResolvedValue({
      data: mockProjectsData,
    });
    mockProjectsWithServiceQueryKey.mockReturnValue([
      'projects-with-services--active--loaded-success',
    ]);

    const { result } = renderHook(() => useActiveProjects(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isReady).toBe(true);
    });

    expect(result.current.activeProjects).toHaveLength(2);
    expect(result.current.activeProjects).toEqual([
      { project_id: '1', description: 'Project 1', status: 'ok' },
      { project_id: '3', description: 'Project 3', status: 'ok' },
    ]);
  });

  it('should return empty array when no projects have ok status', async () => {
    const projectsWithoutOkStatus = [
      {
        project_id: '1',
        description: 'Project 1',
        status: 'suspended',
      } as TProjectWithService,
      {
        project_id: '2',
        description: 'Project 2',
        status: 'creating',
      } as TProjectWithService,
    ];

    mockGetProjectsWithServices.mockResolvedValue({
      data: projectsWithoutOkStatus,
    });
    mockProjectsWithServiceQueryKey.mockReturnValue([
      'projects-with-services--active--loaded-no-project',
    ]);

    const { result } = renderHook(() => useActiveProjects(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isReady).toBe(true);
    });

    expect(result.current.activeProjects).toEqual([]);
  });

  it('should handle empty data response', async () => {
    mockGetProjectsWithServices.mockResolvedValue({
      data: [],
    });
    mockProjectsWithServiceQueryKey.mockReturnValue([
      'projects-with-services--active--loaded-empty',
    ]);

    const { result } = renderHook(() => useActiveProjects(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isReady).toBe(true);
    });

    expect(result.current.activeProjects).toEqual([]);
  });

  it('should return not ready state when query fails', async () => {
    mockGetProjectsWithServices.mockRejectedValue(new Error('API Error'));
    mockProjectsWithServiceQueryKey.mockReturnValue([
      'projects-with-services--active--error',
    ]);

    const { result } = renderHook(() => useActiveProjects(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isReady).toBe(false);
    });

    expect(result.current.activeProjects).toEqual([]);
  });
});
