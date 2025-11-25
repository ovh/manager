import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, vi } from 'vitest';

import { WorkflowType } from '@/api/hooks/workflows';
import { StepState } from '@/pages/new/hooks/useStep';

import { WorkflowTypeSelector } from './WorkflowType.component';

describe('WorkflowType Component', () => {
  const mockOnSubmit = vi.fn();
  const mockOnChange = vi.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
    mockOnChange.mockClear();
  });

  it('renders description and tile component', () => {
    const { getByText } = render(
      <WorkflowTypeSelector
        step={{ isLocked: false } as StepState}
        selectedWorkflowType={null}
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
      />,
    );

    expect(getByText(/pci_workflow_create_type_instance_backup_description/i)).toBeVisible();
    expect(getByText(/pci_workflow_type_instance_backup_title/i)).toBeVisible();
    expect(getByText(/pci_workflow_create_type_instance_backup_description/i)).toBeVisible();
    expect(getByText(/pci_workflow_create_type_volume_backup_description/i)).toBeVisible();
  });

  it('calls onChange with "instance_backup" when tile is clicked', async () => {
    const { getByText } = render(
      <WorkflowTypeSelector
        step={{ isLocked: false } as StepState}
        selectedWorkflowType={null}
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
      />,
    );

    await userEvent.click(getByText(/pci_workflow_create_type_instance_backup_description/i));

    expect(mockOnChange).toHaveBeenCalledWith(WorkflowType.INSTANCE_BACKUP);
  });

  it('calls onSubmit with "instance_backup" when next button is clicked', async () => {
    const { getByText } = render(
      <WorkflowTypeSelector
        step={{ isLocked: false } as StepState}
        selectedWorkflowType={WorkflowType.INSTANCE_BACKUP}
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
      />,
    );

    await userEvent.click(getByText(/common_stepper_next_button_label/i));

    expect(mockOnSubmit).toHaveBeenCalled();
  });

  it('does not render next button when step is locked', () => {
    const { queryByText } = render(
      <WorkflowTypeSelector
        step={{ isLocked: true } as StepState}
        selectedWorkflowType={WorkflowType.INSTANCE_BACKUP}
        onChange={mockOnChange}
        onSubmit={mockOnSubmit}
      />,
    );

    expect(queryByText(/common_stepper_next_button_label/i)).toBeNull();
  });
});
