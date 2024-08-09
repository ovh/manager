import { describe, it, vi } from 'vitest';
import { fireEvent, render } from '@testing-library/react';
import { WorkflowType } from './WorkflowType.component';
import { StepState } from '@/pages/new/hooks/useStep';

describe('WorkflowType Component', () => {
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it('renders description and tile component', () => {
    const { getByText } = render(
      <WorkflowType
        step={{ isLocked: false } as StepState}
        onSubmit={mockOnSubmit}
      />,
    );
    expect(
      getByText(/pci_workflow_create_type_description/i),
    ).toBeInTheDocument();
    expect(getByText(/pci_workflow_create_type_title/i)).toBeInTheDocument();
  });

  it('calls onSubmit with "instance_backup" when next button is clicked', () => {
    const { getByText } = render(
      <WorkflowType
        step={{ isLocked: false } as StepState}
        onSubmit={mockOnSubmit}
      />,
    );
    fireEvent.click(getByText(/common_stepper_next_button_label/i));
    expect(mockOnSubmit).toHaveBeenCalledWith('instance_backup');
  });

  it('does not render next button when step is locked', () => {
    const { queryByText } = render(
      <WorkflowType
        step={{ isLocked: true } as StepState}
        onSubmit={mockOnSubmit}
      />,
    );
    expect(queryByText(/common_stepper_next_button_label/i)).toBeNull();
  });
});
