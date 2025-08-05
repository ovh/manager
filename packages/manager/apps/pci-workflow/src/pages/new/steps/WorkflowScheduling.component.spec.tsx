import { fireEvent } from '@testing-library/react';
import { describe, it, vi } from 'vitest';

import { renderWithMockedWrappers } from '@/__tests__/renderWithMockedWrappers';
import { StepState } from '@/pages/new/hooks/useStep';

import { WorkflowScheduling } from './WorkflowScheduling.component';

describe('WorkflowScheduling Component', () => {
  const mockOnSubmit = vi.fn();
  const stepUnlocked = { isLocked: false };
  const stepLocked = { isLocked: true };

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it('renders rotation options when step is unlocked', () => {
    const { getByText } = renderWithMockedWrappers(
      <WorkflowScheduling step={stepUnlocked as StepState} onSubmit={mockOnSubmit} />,
    );
    expect(getByText('pci_workflow_create_schedule_rotate7_title')).toBeInTheDocument();
    expect(getByText('pci_workflow_create_schedule_rotate14_title')).toBeInTheDocument();
    expect(getByText('pci_workflow_create_schedule_custom_title')).toBeInTheDocument();
  });

  it('renders selected schedule title when step is locked', () => {
    const { getByText } = renderWithMockedWrappers(
      <WorkflowScheduling step={stepLocked as StepState} onSubmit={mockOnSubmit} />,
    );
    // Assuming ROTATE_7 is the default selected schedule
    expect(getByText(/pci_workflow_create_schedule_rotate7_title/i)).toBeInTheDocument();
  });

  it('submits selected schedule when next button is clicked', () => {
    const { getByText } = renderWithMockedWrappers(
      <WorkflowScheduling step={stepUnlocked as StepState} onSubmit={mockOnSubmit} />,
    );
    fireEvent.click(getByText('pci_workflow_create'));
    expect(mockOnSubmit).toHaveBeenCalled();
  });

  it('allows changing to custom schedule when custom option is clicked', () => {
    const { getByText } = renderWithMockedWrappers(
      <WorkflowScheduling step={stepUnlocked as StepState} onSubmit={mockOnSubmit} />,
    );
    fireEvent.click(getByText('pci_workflow_create_schedule_custom_title'));
    expect(getByText('pci_workflow_create_cron_title')).toBeInTheDocument();
  });
});
