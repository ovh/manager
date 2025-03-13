import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import NodePoolType from './NodePoolType.component';
import { wrapper } from '@/wrapperRenders';

vi.mock('@ovh-ux/manager-pci-common', () => ({
  FlavorSelector: ({ onSelect }: { onSelect: (flavor: string) => void }) => (
    <button onClick={() => onSelect('mock-flavor')}>Flavor</button>
  ),
}));

describe('NodePoolType', () => {
  const mockOnFlavorChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the component with correct text', () => {
    render(
      <NodePoolType
        projectId="test-project"
        region="test-region"
        onSelect={mockOnFlavorChange}
      />,
      { wrapper },
    );

    expect(
      screen.getByText('kube_common_node_pool_model_type_selector'),
    ).toBeInTheDocument();
  });

  it('should call onFlavorChange when a flavor is selected', () => {
    render(
      <NodePoolType
        projectId="test-project"
        region="test-region"
        onSelect={mockOnFlavorChange}
      />,
      { wrapper },
    );

    const flavorButton = screen.getByText('Flavor');
    fireEvent.click(flavorButton);

    expect(mockOnFlavorChange).toHaveBeenCalledWith('mock-flavor');
  });
});
