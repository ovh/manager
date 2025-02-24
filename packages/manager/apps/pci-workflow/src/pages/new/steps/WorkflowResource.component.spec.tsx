import { fireEvent, render } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import { TInstance } from '@ovh-ux/manager-pci-common';
import { WorkflowResource } from './WorkflowResource.component';
import { StepState } from '@/pages/new/hooks/useStep';
import { wrapper } from '@/wrapperRenders';
import { usePaginatedInstances } from '@/api/hooks/useInstances';
import { useRegionsWithAutomaticBackup } from '@/hooks/useRegionsWithAutomaticBackup';

vi.mock('@/api/hooks/useInstances');

vi.mock('@/hooks/useRegionsWithAutomaticBackup');

describe('WorkflowResource Component', () => {
  const mockOnSubmit = vi.fn();
  const unlockedStep = { isLocked: false };
  vi.mocked(useRegionsWithAutomaticBackup).mockReturnValue(['regionmock1']);
  vi.mocked(usePaginatedInstances).mockReturnValue({
    isPending: false,
    error: null,
    data: {
      rows: [
        { id: 'instance1', region: 'regionmock1' },
        { id: 'instance2', region: 'regionmock2' },
      ] as TInstance[],
      pageCount: 1,
      totalRows: 1,
    },
  });

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it('renders ResourceSelectorComponent when step is unlocked', () => {
    const { getByTestId } = render(
      <WorkflowResource
        step={unlockedStep as StepState}
        onSubmit={mockOnSubmit}
      />,
      { wrapper },
    );
    expect(getByTestId('radio-button-instance1')).toBeInTheDocument();
  });

  it('disables next button when no instance is selected', () => {
    const { getByText } = render(
      <WorkflowResource
        step={unlockedStep as StepState}
        onSubmit={mockOnSubmit}
      />,
      { wrapper },
    );
    expect(getByText(/common_stepper_next_button_label/i)).toBeDisabled();
  });

  it('enables next button when an instance is selected', () => {
    const { getByTestId, getByText } = render(
      <WorkflowResource
        step={unlockedStep as StepState}
        onSubmit={mockOnSubmit}
      />,
      { wrapper },
    );
    fireEvent.click(getByTestId('radio-button-instance1')); // Simulate selecting an instance
    expect(getByText(/common_stepper_next_button_label/i)).not.toBeDisabled();
  });

  it('cannot select instance where workflow is not available', () => {
    const { getByTestId } = render(
      <WorkflowResource
        step={unlockedStep as StepState}
        onSubmit={mockOnSubmit}
      />,
      { wrapper },
    );
    expect(getByTestId('radio-button-instance2')).toBeDisabled();
  });
});
