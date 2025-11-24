import { act } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, it, vi } from 'vitest';

import { renderWithMockedWrappers } from '@/__tests__/renderWithMockedWrappers';
import { buildInstanceSelectedResource } from '@/api/hooks/instance/selector/instances.selector';
import { ContinentRegion, useInstanceSnapshotPricing } from '@/api/hooks/order/order';
import { WorkflowType } from '@/api/hooks/workflows';
import { StepState } from '@/pages/new/hooks/useStep';

import { WorkflowScheduling } from './WorkflowScheduling.component';

vi.mock('@/api/hooks/order/order', () => ({
  useInstanceSnapshotPricing: vi.fn(),
}));

vi.mock('@ovh-ux/manager-react-components', () => ({
  convertHourlyPriceToMonthly: vi.fn(),
  useCatalogPrice: vi.fn().mockReturnValue({
    getFormattedCatalogPrice: (input: number) => `${input}`,
  }),
}));

describe('WorkflowScheduling Component', () => {
  const mockOnSubmit = vi.fn();
  const mockInstanceId = buildInstanceSelectedResource('instance1', 'region1');
  const stepUnlocked = { isLocked: false };
  const stepLocked = { isLocked: true };
  const user = userEvent.setup();

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
        selectedWorkflowType={WorkflowType.INSTANCE_BACKUP}
        resource={mockInstanceId}
        onSubmit={mockOnSubmit}
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
        selectedWorkflowType={WorkflowType.INSTANCE_BACKUP}
        resource={mockInstanceId}
        onSubmit={mockOnSubmit}
      />,
    );

    // Assuming ROTATE_7 is the default selected schedule
    expect(getByText(/pci_workflow_create_schedule_rotate7_title/i)).toBeInTheDocument();
  });

  it('submits selected schedule when next button is clicked', async () => {
    const { getByText } = renderWithMockedWrappers(
      <WorkflowScheduling
        step={stepUnlocked as StepState}
        selectedWorkflowType={WorkflowType.INSTANCE_BACKUP}
        resource={mockInstanceId}
        onSubmit={mockOnSubmit}
      />,
    );

    await user.click(getByText('pci_workflow_create'));

    expect(mockOnSubmit).toHaveBeenCalled();
  });

  it('allows changing to custom schedule when custom option is clicked', async () => {
    const { getByText } = renderWithMockedWrappers(
      <WorkflowScheduling
        step={stepUnlocked as StepState}
        selectedWorkflowType={WorkflowType.INSTANCE_BACKUP}
        resource={mockInstanceId}
        onSubmit={mockOnSubmit}
      />,
    );

    await user.click(getByText('pci_workflow_create_schedule_custom_title'));

    expect(getByText('pci_workflow_create_cron_title')).toBeInTheDocument();
  });

  it('should not display distant region when no distantContinents is provided', () => {
    const { queryByLabelText } = renderWithMockedWrappers(
      <WorkflowScheduling
        step={stepUnlocked as StepState}
        selectedWorkflowType={WorkflowType.INSTANCE_BACKUP}
        resource={mockInstanceId}
        onSubmit={mockOnSubmit}
      />,
    );

    expect(queryByLabelText('pci_workflow_create_distant_label')).not.toBeInTheDocument();
  });

  it('can select distant region when distantContinents is provided', async () => {
    vi.mocked(useInstanceSnapshotPricing).mockReturnValue({
      distantContinents: new Map<string, ContinentRegion[]>([
        [
          'Europe',
          [
            {
              label: 'Region 1',
              name: 'region1',
              enabled: true,
              price: 1500,
            } as ContinentRegion,
          ],
        ],
      ]),
      pricing: null,
      isPending: false,
    });

    const { getByLabelText, getByRole, findByText } = renderWithMockedWrappers(
      <WorkflowScheduling
        step={stepUnlocked as StepState}
        selectedWorkflowType={WorkflowType.INSTANCE_BACKUP}
        resource={mockInstanceId}
        onSubmit={mockOnSubmit}
      />,
    );

    const distantToggle = getByLabelText(/pci_workflow_create_distant_label/);
    expect(distantToggle).toBeVisible();

    await act(async () => {
      await user.click(distantToggle);
    });

    // ODS 19 combobox labels are broken so we get by role hidden instead
    const distantRegion = getByRole('combobox');
    expect(distantRegion).toBeVisible();

    await act(async () => {
      await user.click(distantRegion);
    });

    // We only test if the option is here because ODS a11y doesn't work and doesn't trigger a value change
    const region1Option = getByRole('option', { name: 'Region 1' });
    expect(region1Option).toBeVisible();

    // It would have been better to use user.click on the element but it doesn't work
    act(() => region1Option.click());

    expect(await findByText('pci_workflow_create_price_monthly')).toBeVisible();
  });
});
