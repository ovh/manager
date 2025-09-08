import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useFeatureAvailability } from '@ovh-ux/manager-react-components';
import useRedirectAfterProjectSelection from './useRedirectAfterProjectSelection';
import { TProjectWithService } from '@/data/types/project.type';
import { createWrapper, shellContext } from '@/wrapperRenders';

vi.mock('@/constants', () => ({
  PCI_FEATURES_STATES: {
    TEST: {
      ENABLED: {
        url: '/test-path',
        isExternal: false,
      },
      EXTERNAL: {
        url: 'https://external.com/:projectId',
        isExternal: true,
      },
      WITHPARAMS: {
        url: '/test-path',
        isExternal: false,
        targetParamKeys: ['params'],
      },
      WITHFF: {
        url: '/test-path',
        isExternal: false,
        featureAvailability: 'test-feature',
      },
    },
  },
}));

vi.mock('@tanstack/react-query', async (importOriginal) => {
  const actual: typeof import('@tanstack/react-query') = await importOriginal();
  return {
    ...actual,
    useQuery: vi.fn(),
  };
});

const mockUseSearchParams = vi.mocked(useSearchParams);
const mockUseQuery = vi.mocked(useQuery);
const mockUseFeatureAvailability = vi.mocked(useFeatureAvailability);

const mockProjects: TProjectWithService[] = [
  {
    project_id: 'project1',
    status: 'ok',
    planCode: 'discovery',
    description: 'Test Project 1',
  },
  {
    project_id: 'project2',
    status: 'ok',
    planCode: 'standard',
    description: 'Test Project 2',
  },
  {
    project_id: 'project3',
    status: 'suspended',
    planCode: 'standard',
    description: 'Suspended Project',
  },
] as TProjectWithService[];

describe('useRedirectAfterProjectSelection', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Default mocks
    mockUseSearchParams.mockReturnValue([new URLSearchParams(), vi.fn()]);

    mockUseQuery.mockReturnValue({
      data: { data: mockProjects },
      isError: false,
      isLoading: false,
      error: null,
      isSuccess: true,
    } as ReturnType<typeof useQuery>);

    mockUseFeatureAvailability.mockReturnValue({
      data: {},
      isLoading: false,
      error: null,
    } as ReturnType<typeof useFeatureAvailability>);

    // Mock window.top
    Object.defineProperty(window, 'top', {
      value: {
        location: '',
      },
      writable: true,
    });
  });

  const renderHookWithWrapper = () => {
    const Wrapper = createWrapper();
    return renderHook(() => useRedirectAfterProjectSelection(), {
      wrapper: Wrapper,
    });
  };

  it('should return no redirect required when no target is provided', () => {
    const { result } = renderHookWithWrapper();

    expect(result.current.isRedirectRequired).toBe(false);
    expect(typeof result.current.redirect).toBe('function');
  });

  it('should return no redirect required when target is invalid', () => {
    mockUseSearchParams.mockReturnValue([
      new URLSearchParams('target={"invalid": true}'),
      vi.fn(),
    ]);

    const { result } = renderHookWithWrapper();

    expect(result.current.isRedirectRequired).toBe(false);
  });

  it('should handle loading state', () => {
    mockUseQuery.mockReturnValue({
      data: undefined,
      isError: false,
      isLoading: true,
      error: null,
      isSuccess: false,
    } as ReturnType<typeof useQuery>);

    const { result } = renderHookWithWrapper();

    expect(result.current.isRedirectRequired).toBe(false);
  });

  it('should handle error state', () => {
    mockUseQuery.mockReturnValue({
      data: undefined,
      isError: true,
      isLoading: false,
      error: new Error('API Error'),
      isSuccess: false,
    } as ReturnType<typeof useQuery>);

    const { result } = renderHookWithWrapper();

    expect(result.current.isRedirectRequired).toBe(false);
  });

  it('should require manual selection when multiple active projects exist', () => {
    mockUseSearchParams.mockReturnValue([
      new URLSearchParams('target={"category": "test", "state": "enabled"}'),
      vi.fn(),
    ]);

    const { result } = renderHookWithWrapper();

    expect(result.current.isRedirectRequired).toBe(true);
  });

  it('should auto-redirect when only one active project exists', async () => {
    const singleProject = [mockProjects[0]];
    mockUseQuery.mockReturnValue({
      data: { data: singleProject },
      isError: false,
      isLoading: false,
      error: null,
      isSuccess: true,
    } as ReturnType<typeof useQuery>);

    mockUseSearchParams.mockReturnValue([
      new URLSearchParams('target={"category": "test", "state": "enabled"}'),
      vi.fn(),
    ]);

    renderHookWithWrapper();

    await waitFor(() => {
      expect(shellContext.shell?.navigation.navigateTo).toHaveBeenCalledWith(
        'public-cloud',
        '/test-path',
        {
          projectId: 'project1',
        },
      );
    });
  });

  it('should handle internal navigation correctly', () => {
    mockUseSearchParams.mockReturnValue([
      new URLSearchParams('target={"category": "test", "state": "enabled"}'),
      vi.fn(),
    ]);

    const { result } = renderHookWithWrapper();

    result.current.redirect('test-project-id');

    expect(shellContext.shell?.navigation.navigateTo).toHaveBeenCalledWith(
      'public-cloud',
      '/test-path',
      {
        projectId: 'test-project-id',
      },
    );
  });

  it('should handle external navigation correctly', () => {
    mockUseSearchParams.mockReturnValue([
      new URLSearchParams('target={"category": "test", "state": "external"}'),
      vi.fn(),
    ]);

    const { result } = renderHookWithWrapper();

    result.current.redirect('test-project-id');

    expect(window.top?.location).toBe('https://external.com/test-project-id');
  });

  it('should handle redirect parameters correctly', () => {
    mockUseSearchParams.mockReturnValue([
      new URLSearchParams(
        'target={"category": "test", "state": "withparams", "params": {"key": "value"}}',
      ),
      vi.fn(),
    ]);

    const { result } = renderHookWithWrapper();

    result.current.redirect('test-project-id');

    expect(shellContext.shell?.navigation.navigateTo).toHaveBeenCalledWith(
      'public-cloud',
      '/test-path',
      {
        key: 'value',
        projectId: 'test-project-id',
      },
    );
  });

  it('should check feature availability when required', () => {
    mockUseSearchParams.mockReturnValue([
      new URLSearchParams('target={"category": "test", "state": "withff"}'),
      vi.fn(),
    ]);

    mockUseFeatureAvailability.mockReturnValue(({
      data: { 'test-feature': true },
      isLoading: false,
      error: null,
    } as unknown) as ReturnType<typeof useFeatureAvailability>);

    renderHookWithWrapper();

    expect(mockUseFeatureAvailability).toHaveBeenCalledWith(['test-feature'], {
      enabled: true,
    });
  });

  it('should filter only active projects', () => {
    mockUseSearchParams.mockReturnValue([
      new URLSearchParams('target={"category": "test", "state": "enabled"}'),
      vi.fn(),
    ]);

    const { result } = renderHookWithWrapper();

    // Should only consider projects with status 'ok' (2 out of 3 mock projects)
    expect(result.current.isRedirectRequired).toBe(true);
  });

  it('should return no redirect when no active projects exist', () => {
    const suspendedProjects = [mockProjects[2]]; // Only suspended project
    mockUseQuery.mockReturnValue({
      data: { data: suspendedProjects },
      isError: false,
      isLoading: false,
      error: null,
      isSuccess: true,
    } as ReturnType<typeof useQuery>);

    mockUseSearchParams.mockReturnValue([
      new URLSearchParams('target={"category": "test", "state": "enabled"}'),
      vi.fn(),
    ]);

    const { result } = renderHookWithWrapper();

    expect(result.current.isRedirectRequired).toBe(false);
  });

  describe('redirectUrl function', () => {
    it('should return internal navigation URL correctly', async () => {
      mockUseSearchParams.mockReturnValue([
        new URLSearchParams('target={"category": "test", "state": "enabled"}'),
        vi.fn(),
      ]);

      const mockGetURL = vi
        .fn()
        .mockResolvedValue('/public-cloud/test-path?projectId=test-project-id');
      if (shellContext.shell) {
        shellContext.shell.navigation.getURL = mockGetURL;
      }

      const { result } = renderHookWithWrapper();

      const url = await result.current.redirectUrl('test-project-id');

      expect(mockGetURL).toHaveBeenCalledWith('public-cloud', '/test-path', {
        projectId: 'test-project-id',
      });
      expect(url).toBe('/public-cloud/test-path?projectId=test-project-id');
    });

    it('should return external navigation URL correctly', async () => {
      mockUseSearchParams.mockReturnValue([
        new URLSearchParams('target={"category": "test", "state": "external"}'),
        vi.fn(),
      ]);

      const { result } = renderHookWithWrapper();

      const url = await result.current.redirectUrl('test-project-id');

      expect(url).toBe('https://external.com/test-project-id');
    });

    it('should handle redirect URL with parameters correctly', async () => {
      mockUseSearchParams.mockReturnValue([
        new URLSearchParams(
          'target={"category": "test", "state": "withparams", "params": {"key": "value"}}',
        ),
        vi.fn(),
      ]);

      const mockGetURL = vi
        .fn()
        .mockResolvedValue(
          '/public-cloud/test-path?key=value&projectId=test-project-id',
        );
      if (shellContext.shell) {
        shellContext.shell.navigation.getURL = mockGetURL;
      }

      const { result } = renderHookWithWrapper();

      const url = await result.current.redirectUrl('test-project-id');

      expect(mockGetURL).toHaveBeenCalledWith('public-cloud', '/test-path', {
        key: 'value',
        projectId: 'test-project-id',
      });
      expect(url).toBe(
        '/public-cloud/test-path?key=value&projectId=test-project-id',
      );
    });
  });
});
