import { useNavigate, useSearchParams } from 'react-router-dom';

import { UseQueryResult } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import { isDiscoveryProject } from '@ovh-ux/manager-pci-common';
import { useNotifications } from '@ovh-ux/manager-react-components';

import { createWrapper } from '@/wrapperRenders';

import RemovePage from '../Remove.page';

const createMockQueryResult = <T,>(data: T, isLoading = false): UseQueryResult<T> => {
  const baseResult = {
    data: isLoading ? undefined : data,
    isLoading,
    isError: false,
    isSuccess: !isLoading,
    isPending: isLoading,
    error: null,
    status: isLoading ? 'pending' : 'success',
  } as unknown as UseQueryResult<T>;

  return baseResult;
};

vi.mock('@ovh-ux/manager-react-components', async (importOriginal) => {
  const mod = await importOriginal<typeof import('@ovh-ux/manager-react-components')>();
  return {
    ...mod,
    useNotifications:
      vi.fn<() => { addSuccess: ReturnType<typeof vi.fn>; addError: ReturnType<typeof vi.fn> }>(),
    useFeatureAvailability: () => ({
      data: { 'savings-plan': true },
    }),
  };
});

const mockUseHasActiveOrPendingSavingsPlan = vi.fn<() => UseQueryResult<boolean>>();
const mockUseIsDefaultProject = vi.fn<() => UseQueryResult<boolean>>();
const mockUsePciProjectsCount = vi.fn<() => UseQueryResult<number>>();
const mockRemoveProject = vi.fn<() => void>();

vi.mock('@/data/hooks/useSavingsPlans', () => ({
  useHasActiveOrPendingSavingsPlan: (): UseQueryResult<boolean> =>
    mockUseHasActiveOrPendingSavingsPlan(),
}));

vi.mock('@/data/hooks/useProjects', () => ({
  useIsDefaultProject: (): UseQueryResult<boolean> => mockUseIsDefaultProject(),
  useRemoveProjectMutation: () => ({
    mutate: mockRemoveProject,
    isPending: false,
  }),
  usePciProjectsCount: () => mockUsePciProjectsCount(),
}));

// Mock window.open to avoid jsdom errors
Object.defineProperty(window, 'open', {
  value: vi.fn(),
  writable: true,
});

describe('RemovePage', () => {
  const mockNavigate = vi.fn();
  const mockAddSuccess = vi.fn();
  const mockAddError = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    (
      vi.mocked(useNavigate) as {
        mockReturnValue: (value: ReturnType<typeof vi.fn>) => void;
      }
    ).mockReturnValue(mockNavigate);
    (
      vi.mocked(useSearchParams) as {
        mockReturnValue: (value: [URLSearchParams, ReturnType<typeof vi.fn>]) => void;
      }
    ).mockReturnValue([
      new URLSearchParams({
        projectId: 'test-project-id',
        serviceId: 'test-service-id',
      }),
      vi.fn(),
    ]);

    (
      vi.mocked(useNotifications) as {
        mockReturnValue: (value: {
          addSuccess: ReturnType<typeof vi.fn>;
          addError: ReturnType<typeof vi.fn>;
        }) => void;
      }
    ).mockReturnValue({
      addSuccess: mockAddSuccess,
      addError: mockAddError,
    });

    mockUseHasActiveOrPendingSavingsPlan.mockReturnValue(createMockQueryResult(false));

    mockUseIsDefaultProject.mockReturnValue(createMockQueryResult(false));

    mockUsePciProjectsCount.mockReturnValue(createMockQueryResult(2));
  });

  it('should render the deletion modal', () => {
    render(<RemovePage />, { wrapper: createWrapper() });
    expect(screen.getByText('pci_projects_project_edit_remove_title')).toBeInTheDocument();
  });

  it('should handle project removal', async () => {
    render(<RemovePage />, { wrapper: createWrapper() });

    const confirmButton = screen.getByTestId('primary-button');
    confirmButton.click();

    await waitFor(() => {
      expect(mockRemoveProject).toHaveBeenCalled();
    });
  });

  it('should handle active savings plan case', async () => {
    mockUseHasActiveOrPendingSavingsPlan.mockReturnValue(createMockQueryResult(true));

    render(<RemovePage />, { wrapper: createWrapper() });

    const modalContent = screen.getByText('pci_projects_project_discovery_edit_savings_plan');
    expect(modalContent).toBeVisible();

    const confirmButton = screen.getByTestId('primary-button');
    confirmButton.click();

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('..');
    });
  });

  it('should handle discovery project case', () => {
    (
      vi.mocked(isDiscoveryProject) as {
        mockReturnValue: (value: boolean) => void;
      }
    ).mockReturnValue(true);

    render(<RemovePage />, { wrapper: createWrapper() });

    const modalContent = screen.getByText('pci_projects_project_discovery_edit_remove_please_note');
    expect(modalContent).toBeVisible();
  });

  it('should handle loading states', () => {
    mockUseHasActiveOrPendingSavingsPlan.mockReturnValue(createMockQueryResult(false, true));

    mockUseIsDefaultProject.mockReturnValue(createMockQueryResult(false, true));

    render(<RemovePage />, { wrapper: createWrapper() });

    const spinner = screen.getByTestId('spinner');
    expect(spinner).toBeVisible();
  });

  it('should handle cancel action', () => {
    render(<RemovePage />, { wrapper: createWrapper() });

    const cancelButton = screen.getByTestId('secondary-button');
    cancelButton.click();

    expect(mockNavigate).toHaveBeenCalledWith('..');
  });
});
