import { fireEvent, render } from '@testing-library/react';
import { describe, it, vi } from 'vitest';

import { TInstance, buildInstanceId } from '@/api/hooks/instance/selector/instances.selector';
import { useInstance, usePaginatedInstances } from '@/api/hooks/instance/useInstances';
import { StepState } from '@/pages/new/hooks/useStep';
import { wrapper } from '@/wrapperRenders';

import { WorkflowResource } from './WorkflowResource.component';

vi.mock('@/api/hooks/instance/useInstances');

vi.mocked(useInstance).mockReturnValue({ instance: null });

describe('WorkflowResource Component', () => {
  const mockOnSubmit = vi.fn();
  const mockOnUpdate = vi.fn();
  const instanceId = buildInstanceId('instance1', 'region1');
  const unlockedStep = { isLocked: false };
  vi.mocked(usePaginatedInstances).mockReturnValue({
    isPending: false,
    data: {
      rows: [
        {
          label: 'instance1',
          region: { label: 'region1' },
          status: { group: 'A' },
          flavor: { label: 'flavor1' },
          autoBackup: true,
        } as TInstance,
        {
          label: 'instance2',
          region: { label: 'region2' },
          status: { group: 'B' },
          flavor: { label: 'flavor1' },
          autoBackup: false,
        } as TInstance,
      ],
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
        onUpdate={mockOnUpdate}
        instanceId={instanceId}
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
        onUpdate={mockOnUpdate}
        instanceId={null}
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
        onUpdate={mockOnUpdate}
        instanceId={instanceId}
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
        onUpdate={mockOnUpdate}
        instanceId={instanceId}
      />,
      { wrapper },
    );
    expect(getByTestId('radio-button-instance2')).toBeDisabled();
  });
});
