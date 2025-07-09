import { isDiscoveryProject } from '@ovh-ux/manager-pci-common';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { render, screen, waitFor } from '@testing-library/react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { vi } from 'vitest';
import { UseQueryResult } from '@tanstack/react-query';
import { createWrapper } from '@/wrapperRenders';
import { useHasActiveOrPendingSavingsPlan } from '@/data/hooks/useSavingsPlans';
import { useIsDefaultProject } from '@/data/hooks/useProjects';
import RemovePage from './Remove.page';

const createMockQueryResult = <T,>(
  data: T,
  isLoading = false,
): UseQueryResult<T> => {
  const baseResult = ({
    data: isLoading ? undefined : data,
    isLoading,
    isError: false,
    isSuccess: !isLoading,
    isPending: isLoading,
    error: null,
    status: isLoading ? 'pending' : 'success',
  } as unknown) as UseQueryResult<T>;

  return baseResult;
};

vi.mock('@ovh-ux/manager-react-components', () => ({
  useNotifications: vi.fn(),
  useFeatureAvailability: () => ({
    data: { 'savings-plan': true },
  }),
}));

vi.mock('@/data/hooks/useSavingsPlans', () => ({
  useHasActiveOrPendingSavingsPlan: vi.fn(),
}));

const mockRemoveProject = vi.fn();

vi.mock('@/data/hooks/useProjects', () => ({
  useIsDefaultProject: vi.fn(),
  useRemoveProjectMutation: () => ({
    mutate: mockRemoveProject,
    isPending: false,
  }),
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

    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
    vi.mocked(useSearchParams).mockReturnValue([
      new URLSearchParams({
        projectId: 'test-project-id',
        serviceId: 'test-service-id',
      }),
      vi.fn(),
    ]);

    vi.mocked(useNotifications).mockReturnValue({
      addSuccess: mockAddSuccess,
      addError: mockAddError,
    });

    vi.mocked(useHasActiveOrPendingSavingsPlan).mockReturnValue(
      createMockQueryResult(false),
    );

    vi.mocked(useIsDefaultProject).mockReturnValue(
      createMockQueryResult(false),
    );
  });

  it('should render the deletion modal', () => {
    render(<RemovePage />, { wrapper: createWrapper() });
    expect(screen.getByTestId('pciModal-modal')).toBeInTheDocument();
  });

  it('should handle project removal', async () => {
    render(<RemovePage />, { wrapper: createWrapper() });

    const confirmButton = screen.getByTestId('pciModal-button_submit');
    await confirmButton.click();

    await waitFor(() => {
      expect(mockRemoveProject).toHaveBeenCalled();
    });
  });

  it('should handle active savings plan case', async () => {
    vi.mocked(useHasActiveOrPendingSavingsPlan).mockReturnValue(
      createMockQueryResult(true),
    );

    render(<RemovePage />, { wrapper: createWrapper() });

    const modalContent = screen.getByText(
      'pci_projects_project_discovery_edit_savings_plan',
    );
    expect(modalContent).toBeVisible();

    const confirmButton = screen.getByTestId('pciModal-button_submit');
    await confirmButton.click();

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('..');
    });
  });

  it('should handle discovery project case', async () => {
    vi.mocked(isDiscoveryProject).mockReturnValue(true);

    render(<RemovePage />, { wrapper: createWrapper() });

    const modalContent = screen.getByText(
      'pci_projects_project_discovery_edit_remove_please_note',
    );
    expect(modalContent).toBeVisible();
  });

  it('should handle loading states', async () => {
    vi.mocked(useHasActiveOrPendingSavingsPlan).mockReturnValue(
      createMockQueryResult(false, true),
    );

    vi.mocked(useIsDefaultProject).mockReturnValue(
      createMockQueryResult(false, true),
    );

    render(<RemovePage />, { wrapper: createWrapper() });

    const modalSpinner = screen.getByTestId('pciModal-spinner');
    const confirmButton = screen.getByTestId('pciModal-button_submit');
    expect(confirmButton).toHaveAttribute('is-disabled', 'true');
    expect(modalSpinner).toBeVisible();
  });

  it('should handle cancel action', async () => {
    render(<RemovePage />, { wrapper: createWrapper() });

    const cancelButton = screen.getByTestId('pciModal-button_cancel');
    await cancelButton.click();

    expect(mockNavigate).toHaveBeenCalledWith('..');
  });
});
