import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { wrapper } from '@/wrapperRenders';

import PublicConnectivity from './PublicConnectivity.component';

describe('PublicConnectivity', () => {
  const mockOnChange = vi.fn();

  const defaultProps = {
    disabled: false,
    checked: false,
    onChange: mockOnChange,
    price: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the component', () => {
    render(<PublicConnectivity {...defaultProps} />, { wrapper });

    expect(screen.getByText('kube_common_node_pool_public_connetivity_title')).toBeInTheDocument();
    expect(screen.getByText('kube_common_node_pool_public_connetivity_toggle')).toBeInTheDocument();
  });

  it('should render toggle with correct checked state', () => {
    const { container } = render(<PublicConnectivity {...defaultProps} checked={true} />, {
      wrapper,
    });

    const toggle = container.querySelector('[data-ods="toggle-control"]');
    expect(toggle).toHaveAttribute('data-state', 'checked');
  });

  it('should render toggle with unchecked state', () => {
    const { container } = render(<PublicConnectivity {...defaultProps} checked={false} />, {
      wrapper,
    });

    const toggle = container.querySelector('[data-ods="toggle-control"]');
    expect(toggle).not.toBeChecked();
  });

  it('should disable toggle when disabled prop is true', () => {
    const { container } = render(<PublicConnectivity {...defaultProps} disabled={true} />, {
      wrapper,
    });

    const toggle = container.querySelector('[data-ods="toggle-control"]');
    expect(toggle).toHaveAttribute('data-state', 'unchecked');
  });

  it('should not disable toggle when disabled prop is false', () => {
    const { container } = render(<PublicConnectivity {...defaultProps} disabled={false} />, {
      wrapper,
    });

    const toggle = container.querySelector('[data-ods="toggle-control"]');
    expect(toggle).not.toBeDisabled();
  });

  it('should display price when provided', () => {
    const price = {
      hourFormatted: '0.5 €/hour',
      monthFormatted: '5 €/month',
    };

    render(<PublicConnectivity {...defaultProps} price={price} />, { wrapper });

    expect(screen.getByText(/0.5 €\/hour/)).toBeInTheDocument();
    expect(screen.getByText(/kube_common_node_pool_node/)).toBeInTheDocument();
  });

  it('should not display price when price is null', () => {
    render(<PublicConnectivity {...defaultProps} price={null} />, { wrapper });

    expect(screen.queryByText(/€\/hour/)).not.toBeInTheDocument();
  });

  it('should render popover content with documentation', () => {
    render(<PublicConnectivity {...defaultProps} />, { wrapper });

    expect(
      screen.getByText(/kube_common_node_pool_deploy_floating_ip_content1/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/kube_common_node_pool_deploy_floating_ip_content2/),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/kube_common_node_pool_deploy_floating_ip_content4/),
    ).toBeInTheDocument();
  });

  it('should render warning section in popover', () => {
    render(<PublicConnectivity {...defaultProps} />, { wrapper });

    expect(
      screen.getByText(/kube_common_node_pool_public_connectivity_warning_title/),
    ).toBeInTheDocument();
  });

  it.skip('should toggle from unchecked to checked', () => {
    // TODO ODS 19 - fix toggle
    const { rerender, container } = render(
      <PublicConnectivity {...defaultProps} checked={false} />,
      {
        wrapper,
      },
    );

    let toggle = container.querySelector('[data-ods="toggle-control"]');
    expect(toggle).toHaveAttribute('data-state', 'unchecked');

    fireEvent.click(toggle as Element);
    expect(mockOnChange).toHaveBeenCalledWith(true);

    rerender(<PublicConnectivity {...defaultProps} checked={false} />);

    toggle = container.querySelector('[data-ods="toggle-control"]');
    expect(toggle).toHaveAttribute('data-state', 'checked');
  });

  it.skip('should toggle from checked to unchecked', () => {
    // TODO ODS 19 - fix toggle
    const onChange = vi.fn();
    const props = { ...defaultProps, onChange };
    const { rerender, container } = render(<PublicConnectivity {...props} checked={false} />, {
      wrapper,
    });

    let toggle = container.querySelector('[data-ods="toggle-control"]');
    expect(toggle).toHaveAttribute('data-state', 'unchecked');

    fireEvent.click(toggle as Element);
    expect(mockOnChange).toHaveBeenCalledWith(false);

    rerender(<PublicConnectivity {...defaultProps} checked={false} />);

    toggle = container.querySelector('[data-ods="toggle-control"]');
    expect(toggle).toHaveAttribute('data-state', 'checked');
  });

  it('should display formatted price with node text', () => {
    const price = {
      hourFormatted: '1.5 €/hour',
      monthFormatted: '15 €/month',
    };

    render(<PublicConnectivity {...defaultProps} price={price} />, { wrapper });

    const priceText = screen.getByText(/1.5 €\/hour/);
    expect(priceText).toBeInTheDocument();

    const nodeText = screen.getByText(/kube_common_node_pool_node/);
    expect(nodeText).toBeInTheDocument();
  });

  it('should not call onChange when toggle is disabled', () => {
    const { container } = render(<PublicConnectivity {...defaultProps} checked={false} />, {
      wrapper,
    });

    const toggle = container.querySelector('[data-ods="toggle-control"]');
    fireEvent.click(toggle as Element);

    expect(mockOnChange).not.toHaveBeenCalled();
  });
});
