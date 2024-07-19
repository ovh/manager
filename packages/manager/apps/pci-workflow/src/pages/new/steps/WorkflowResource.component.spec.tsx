import { fireEvent, render } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import { WorkflowResource } from './WorkflowResource.component';
import { StepState } from '@/pages/new/hooks/useStep';
import { wrapper } from '@/wrapperRenders';
import * as useInstancesModule from '@/api/hooks/useInstances';
import { TInstance } from '@/type';

describe('WorkflowResource Component', () => {
  const mockOnSubmit = vi.fn();
  const unlockedStep = { isLocked: false };
  const lockedStep = { isLocked: true };
  const instance = { id: 'instance1', region: 'regionmock' } as TInstance;

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it('renders ResourceSelectorComponent when step is unlocked', () => {
    vi.spyOn(useInstancesModule, 'useInstances').mockReturnValue({
      isPending: false,
      error: null,
      data: { rows: [instance], pageCount: 1, totalRows: 1 },
    });
    const { getByTestId } = render(
      <WorkflowResource
        step={unlockedStep as StepState}
        onSubmit={mockOnSubmit}
      />,
      { wrapper },
    );
    expect(getByTestId('radio-instance1')).toBeInTheDocument();
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
});
