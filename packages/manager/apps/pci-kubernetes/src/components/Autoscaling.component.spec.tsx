import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { wrapper } from '@/wrapperRenders';

import { Autoscaling } from './Autoscaling.component';

vi.mock('@ovh-ux/manager-pci-common', () => ({
  QuantitySelector: ({
    value,
    onValueChange,
  }: {
    value: number;
    onValueChange: (val: number) => void;
  }) => (
    <input type="number" value={value} onChange={(e) => onValueChange(Number(e.target.value))} />
  ),
}));

describe('Autoscaling', () => {
  const mockOnChange = vi.fn();
  const defaultProps = {
    initialScaling: { min: 1, max: 5, desired: 3 },
    isAutoscale: false,
    isAntiAffinity: false,
    onChange: mockOnChange,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the component with default values', () => {
    render(<Autoscaling {...defaultProps} />, { wrapper });
    expect(screen.getByText('kubernetes_node_pool_autoscaling_description')).toBeInTheDocument();
  });

  // TODO Regression ODS 17 to ODS 19
  it.skip('should toggle autoscale on click', () => {
    render(<Autoscaling {...defaultProps} />, { wrapper });
    const toggleButton = screen.getByText(
      'kubernetes_node_pool_autoscaling_autoscale_toggle_false',
    );
    fireEvent.click(toggleButton);
    expect(
      screen.getByText('kubernetes_node_pool_autoscaling_autoscale_toggle_true'),
    ).toBeInTheDocument();
  });

  // TODO Regression ODS 17 to ODS 19
  it.skip('should update the desired quantity', () => {
    render(<Autoscaling {...defaultProps} />, { wrapper });
    const input = screen.getByDisplayValue('3');
    fireEvent.change(input, { target: { value: '4' } });
    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({
        quantity: expect.objectContaining({ desired: 4 }),
      }),
    );
  });
  it('should disable autoScaling if antiAffinity is on', () => {
    render(<Autoscaling {...{ ...defaultProps, isAntiAffinity: true }} />, {
      wrapper,
    });
    const off = screen.getByText('kubernetes_node_pool_autoscaling_autoscale_toggle_false');
    fireEvent.click(off);
    expect(off).toBeInTheDocument();
  });
});
