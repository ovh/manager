import { describe, it, vi } from 'vitest';
import { fireEvent, render } from '@testing-library/react';
import { WorkflowScheduling } from './WorkflowScheduling.component';
import { StepState } from '@/pages/new/hooks/useStep';

describe('WorkflowScheduling Component', () => {
  const mockOnSubmit = vi.fn();
  const stepUnlocked = { isLocked: false };
  const stepLocked = { isLocked: true };

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it('renders rotation options when step is unlocked', () => {
    const { getByText } = render(
      <WorkflowScheduling
        step={stepUnlocked as StepState}
        onSubmit={mockOnSubmit}
      />,
    );
    expect(
      getByText('pci_workflow_create_schedule_rotate7_title'),
    ).toBeInTheDocument();
    expect(
      getByText('pci_workflow_create_schedule_rotate14_title'),
    ).toBeInTheDocument();
    expect(
      getByText('pci_workflow_create_schedule_custom_title'),
    ).toBeInTheDocument();
  });

  it('renders selected schedule title when step is locked', () => {
    const { getByText } = render(
      <WorkflowScheduling
        step={stepLocked as StepState}
        onSubmit={mockOnSubmit}
      />,
    );
    // Assuming ROTATE_7 is the default selected schedule
    expect(
      getByText(/pci_workflow_create_schedule_rotate7_title/i),
    ).toBeInTheDocument();
  });

  it('submits selected schedule when next button is clicked', () => {
    const { getByText } = render(
      <WorkflowScheduling
        step={stepUnlocked as StepState}
        onSubmit={mockOnSubmit}
      />,
    );
    fireEvent.click(getByText('common_stepper_next_button_label'));
    expect(mockOnSubmit).toHaveBeenCalled();
  });

  it('allows changing to custom schedule when custom option is clicked', () => {
    const { getByText } = render(
      <WorkflowScheduling
        step={stepUnlocked as StepState}
        onSubmit={mockOnSubmit}
      />,
    );
    fireEvent.click(getByText('pci_workflow_create_schedule_custom_title'));
    expect(getByText('pci_workflow_create_cron_title')).toBeInTheDocument();
  });
});
