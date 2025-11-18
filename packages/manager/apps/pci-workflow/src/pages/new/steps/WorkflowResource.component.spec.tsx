import { fireEvent, render } from '@testing-library/react';
import { describe, it, vi } from 'vitest';

import {
  TInstance,
  buildInstanceSelectedResource,
} from '@/api/hooks/instance/selector/instances.selector';
import { usePaginatedInstances } from '@/api/hooks/instance/useInstances';
import { StepState } from '@/pages/new/hooks/useStep';
import { wrapper } from '@/wrapperRenders';

import { WorkflowResource } from './WorkflowResource.component';

vi.mock('@/api/hooks/instance/useInstances');

describe('WorkflowResource Component', () => {
  const mockOnSubmit = vi.fn();
  const mockOnUpdate = vi.fn();
  const instanceId = buildInstanceSelectedResource('instance1', 'region1');
  const unlockedStep = { isLocked: false };
  const instance1 = {
    id: { id: 'instance1', region: 'region1' },
    label: 'instance1',
    region: { label: 'regionLabel1' },
    status: { group: 'A' },
    flavor: { label: 'flavor1' },
    autoBackup: true,
  } as TInstance;
  vi.mocked(usePaginatedInstances).mockReturnValue({
    isPending: false,
    data: {
      rows: [
        instance1,
        {
          id: { id: 'instance2', region: 'region2' },
          label: 'instance2',
          region: { label: 'regionLabel2' },
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
        selectedResource={null}
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
        selectedResource={null}
      />,
      { wrapper },
    );
    expect(getByText(/common_stepper_next_button_label/i)).toBeDisabled();
  });

  it('enables next button when an instance is selected', () => {
    const { getByText } = render(
      <WorkflowResource
        step={unlockedStep as StepState}
        onSubmit={mockOnSubmit}
        onUpdate={mockOnUpdate}
        selectedResource={instanceId}
      />,
      { wrapper },
    );

    expect(getByText(/common_stepper_next_button_label/i)).not.toBeDisabled();
  });

  it('triggers onUpdate an instance is selected', () => {
    const { getByTestId } = render(
      <WorkflowResource
        step={unlockedStep as StepState}
        onSubmit={mockOnSubmit}
        onUpdate={mockOnUpdate}
        selectedResource={instanceId}
      />,
      { wrapper },
    );

    fireEvent.click(getByTestId('radio-button-instance1'));

    expect(mockOnUpdate).toHaveBeenCalledWith(instance1);
  });

  it('cannot select instance where workflow is not available', () => {
    const { getByTestId } = render(
      <WorkflowResource
        step={unlockedStep as StepState}
        onSubmit={mockOnSubmit}
        onUpdate={mockOnUpdate}
        selectedResource={instanceId}
      />,
      { wrapper },
    );
    expect(getByTestId('radio-button-instance2')).toBeDisabled();
  });
});
