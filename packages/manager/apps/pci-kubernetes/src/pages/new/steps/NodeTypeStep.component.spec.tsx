import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { NodeTypeStep } from './NodeTypeStep.component';
import { StepState } from '../useStep';
import { wrapper } from '@/wrapperRenders';

const mockOnSubmit = vi.fn();
const mockStep = { isLocked: false } as StepState;

vi.mock('@ovh-ux/manager-pci-common', () => ({
  FlavorSelector: ({ onSelect }: { onSelect: (flavor: string) => void }) => (
    <button onClick={() => onSelect('mock-flavor')}>Flavor</button>
  ),
}));

describe('NodeTypeStep', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('displays the next button', () => {
    render(
      <NodeTypeStep
        projectId="123"
        region="EU"
        onSubmit={mockOnSubmit}
        step={mockStep}
      />,
      { wrapper },
    );
    expect(
      screen.getByText('common_stepper_next_button_label'),
    ).toBeInTheDocument();
  });

  it('disables the next button when no flavor is selected', () => {
    render(
      <NodeTypeStep
        projectId="123"
        region="EU"
        onSubmit={mockOnSubmit}
        step={mockStep}
      />,
      { wrapper },
    );
    expect(screen.getByText('common_stepper_next_button_label')).toBeDisabled();
  });

  it('enables the next button when a flavor is selected', async () => {
    render(
      <NodeTypeStep
        projectId="123"
        region="EU"
        onSubmit={mockOnSubmit}
        step={mockStep}
      />,
      { wrapper },
    );

    // Simulate flavor selection
    fireEvent.click(screen.getByText(/flavor/i));

    expect(screen.getByText('common_stepper_next_button_label')).toBeEnabled();
  });

  it('disables the selector when the toggle is turned off', () => {
    render(
      <NodeTypeStep
        projectId="123"
        region="EU"
        onSubmit={mockOnSubmit}
        step={mockStep}
      />,
      { wrapper },
    );
    fireEvent.click(screen.getByText('kube_common_node_pool_configure_true'));
    expect(screen.queryByText(/flavor/i)).not.toBeInTheDocument();
  });

  it('calls onSubmit with the selected flavor', () => {
    render(
      <NodeTypeStep
        projectId="123"
        region="EU"
        onSubmit={mockOnSubmit}
        step={mockStep}
      />,
      { wrapper },
    );

    // Simulate flavor selection and clicking next
    fireEvent.click(screen.getByText(/flavor/i));
    fireEvent.click(screen.getByText('common_stepper_next_button_label'));
    expect(mockOnSubmit).toHaveBeenCalledWith('mock-flavor');
  });
});
