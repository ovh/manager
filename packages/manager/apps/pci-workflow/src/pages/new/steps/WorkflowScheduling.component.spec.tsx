import { act, fireEvent } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, it, vi } from 'vitest';

import { renderWithMockedWrappers } from '@/__tests__/renderWithMockedWrappers';
import { buildInstanceId } from '@/api/hooks/instance/selector/instances.selector';
import { ContinentRegion, useInstanceSnapshotPricing } from '@/api/hooks/order';
import { StepState } from '@/pages/new/hooks/useStep';

import { WorkflowScheduling } from './WorkflowScheduling.component';

vi.mock('@/api/hooks/order');

describe('WorkflowScheduling Component', () => {
  const mockOnSubmit = vi.fn();
  const mockInstanceId = buildInstanceId('instance1', 'region1');
  const stepUnlocked = { isLocked: false };
  const stepLocked = { isLocked: true };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useInstanceSnapshotPricing).mockReturnValue({
      distantContinents: new Map<string, ContinentRegion[]>(),
      isPending: false,
      pricing: null,
    });
  });

  it('renders rotation options when step is unlocked', () => {
    const { getByText } = renderWithMockedWrappers(
      <WorkflowScheduling
        step={stepUnlocked as StepState}
        onSubmit={mockOnSubmit}
        instanceId={mockInstanceId}
      />,
    );
    expect(getByText('pci_workflow_create_schedule_rotate7_title')).toBeInTheDocument();
    expect(getByText('pci_workflow_create_schedule_rotate14_title')).toBeInTheDocument();
    expect(getByText('pci_workflow_create_schedule_custom_title')).toBeInTheDocument();
  });

  it('renders selected schedule title when step is locked', () => {
    const { getByText } = renderWithMockedWrappers(
      <WorkflowScheduling
        step={stepLocked as StepState}
        onSubmit={mockOnSubmit}
        instanceId={mockInstanceId}
      />,
    );
    // Assuming ROTATE_7 is the default selected schedule
    expect(getByText(/pci_workflow_create_schedule_rotate7_title/i)).toBeInTheDocument();
  });

  it('submits selected schedule when next button is clicked', () => {
    const { getByText } = renderWithMockedWrappers(
      <WorkflowScheduling
        step={stepUnlocked as StepState}
        onSubmit={mockOnSubmit}
        instanceId={mockInstanceId}
      />,
    );
    fireEvent.click(getByText('pci_workflow_create'));
    expect(mockOnSubmit).toHaveBeenCalled();
  });

  it('allows changing to custom schedule when custom option is clicked', () => {
    const { getByText } = renderWithMockedWrappers(
      <WorkflowScheduling
        step={stepUnlocked as StepState}
        onSubmit={mockOnSubmit}
        instanceId={mockInstanceId}
      />,
    );
    fireEvent.click(getByText('pci_workflow_create_schedule_custom_title'));
    expect(getByText('pci_workflow_create_cron_title')).toBeInTheDocument();
  });

  it('should not display distant region when no distantContinents is provided', () => {
    const { queryByLabelText } = renderWithMockedWrappers(
      <WorkflowScheduling
        step={stepUnlocked as StepState}
        onSubmit={mockOnSubmit}
        instanceId={mockInstanceId}
      />,
    );

    expect(queryByLabelText('pci_workflow_create_distant_label')).not.toBeInTheDocument();
  });

  it('can select distant region when distantContinents is provided', async () => {
    vi.mocked(useInstanceSnapshotPricing).mockReturnValue({
      distantContinents: new Map<string, ContinentRegion[]>([
        ['Europe', [{ label: 'Region 1', name: 'region1', enabled: true } as ContinentRegion]],
      ]),
      pricing: null,
      isPending: false,
    });

    const user = userEvent.setup();
    const { getByLabelText, getByRole } = renderWithMockedWrappers(
      <WorkflowScheduling
        step={stepUnlocked as StepState}
        onSubmit={mockOnSubmit}
        instanceId={mockInstanceId}
      />,
    );

    const distantToggle = getByLabelText(/pci_workflow_create_distant_label/);
    expect(distantToggle).toBeInTheDocument();

    await act(async () => {
      await user.click(distantToggle);
    });

    // ODS 19 combobox labels are broken so we get by role hidden instead
    const distantRegion = getByRole('combobox');
    expect(distantRegion).toBeInTheDocument();

    await act(async () => {
      await user.click(distantRegion);
    });

    // We only test if the option is here because ODS a11y doesn't work and doesn't trigger a value change
    const region1Option = getByRole('option', { name: 'Region 1', hidden: true });
    expect(region1Option).toBeInTheDocument();
  });
});
