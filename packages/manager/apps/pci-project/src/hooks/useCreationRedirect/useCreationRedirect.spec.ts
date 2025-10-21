import { TProject } from '@ovh-ux/manager-pci-common';
import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useIsAskIncreaseProjectsQuota } from '@/data/hooks/useEligibility';
import { useDiscoveryProject } from '@/data/hooks/useProjects';
import { createWrapper } from '@/wrapperRenders';
import useCreationRedirect from './useCreationRedirect';

vi.mock('@/data/hooks/useEligibility', () => ({
  useIsAskIncreaseProjectsQuota: vi.fn(),
}));

vi.mock('@/data/hooks/useProjects', () => ({
  useDiscoveryProject: vi.fn(),
}));

const mockUseIsAskIncreaseProjectsQuota = vi.mocked(
  useIsAskIncreaseProjectsQuota,
);
const mockUseDiscoveryProject = vi.mocked(useDiscoveryProject);

describe('useCreationRedirect', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderHookWithWrapper = () => {
    const Wrapper = createWrapper();
    return renderHook(() => useCreationRedirect(), {
      wrapper: Wrapper,
    });
  };

  const mockDiscoveryProject: TProject = {
    project_id: 'discovery-123',
    planCode: 'project.discovery',
    description: 'Discovery Project',
    status: 'ok',
  } as TProject;

  it('should return loading state when quota query is loading', () => {
    mockUseIsAskIncreaseProjectsQuota.mockReturnValue({
      data: undefined,
      isLoading: true,
    } as ReturnType<typeof useIsAskIncreaseProjectsQuota>);
    mockUseDiscoveryProject.mockReturnValue({
      data: undefined,
      isPending: false,
    } as ReturnType<typeof useDiscoveryProject>);

    const { result } = renderHookWithWrapper();

    expect(result.current.isLoading).toBe(true);
  });

  it('should return loading state when discovery project query is pending', () => {
    mockUseIsAskIncreaseProjectsQuota.mockReturnValue({
      data: false,
      isLoading: false,
    } as ReturnType<typeof useIsAskIncreaseProjectsQuota>);
    mockUseDiscoveryProject.mockReturnValue({
      data: undefined,
      isPending: true,
    } as ReturnType<typeof useDiscoveryProject>);

    const { result } = renderHookWithWrapper();

    expect(result.current.isLoading).toBe(true);
  });

  it('should not block creation when no conditions are met', () => {
    mockUseIsAskIncreaseProjectsQuota.mockReturnValue({
      data: false,
      isLoading: false,
    } as ReturnType<typeof useIsAskIncreaseProjectsQuota>);
    mockUseDiscoveryProject.mockReturnValue({
      data: undefined,
      isPending: false,
    } as ReturnType<typeof useDiscoveryProject>);

    const { result } = renderHookWithWrapper();

    expect(result.current.shouldBlockCreation).toBe(false);
    expect(result.current.isLoading).toBe(false);
  });

  it('should block creation and redirect to increase quota when user needs quota increase', () => {
    mockUseIsAskIncreaseProjectsQuota.mockReturnValue({
      data: true,
      isLoading: false,
    } as ReturnType<typeof useIsAskIncreaseProjectsQuota>);
    mockUseDiscoveryProject.mockReturnValue({
      data: undefined,
      isPending: false,
    } as ReturnType<typeof useDiscoveryProject>);

    const { result } = renderHookWithWrapper();

    expect(result.current.shouldBlockCreation).toBe(true);
    expect(result.current.redirectRoute).toContain('increase-quota');
  });

  it('should block creation and redirect to discovery project when discovery project exists', () => {
    mockUseIsAskIncreaseProjectsQuota.mockReturnValue({
      data: false,
      isLoading: false,
    } as ReturnType<typeof useIsAskIncreaseProjectsQuota>);
    mockUseDiscoveryProject.mockReturnValue({
      data: mockDiscoveryProject,
      isPending: false,
    } as ReturnType<typeof useDiscoveryProject>);

    const { result } = renderHookWithWrapper();

    expect(result.current.shouldBlockCreation).toBe(true);
    expect(result.current.redirectRoute).toBe(
      `../${mockDiscoveryProject.project_id}?activateDiscovery=1`,
    );
  });

  it('should prioritize discovery project route when both conditions are true', () => {
    mockUseIsAskIncreaseProjectsQuota.mockReturnValue({
      data: true,
      isLoading: false,
    } as ReturnType<typeof useIsAskIncreaseProjectsQuota>);
    mockUseDiscoveryProject.mockReturnValue({
      data: mockDiscoveryProject,
      isPending: false,
    } as ReturnType<typeof useDiscoveryProject>);

    const { result } = renderHookWithWrapper();

    expect(result.current.shouldBlockCreation).toBe(true);
    expect(result.current.redirectRoute).toBe(
      `../${mockDiscoveryProject.project_id}?activateDiscovery=1`,
    );
  });
});
