import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import NodePoolAntiAffinity from './NodePoolAntiAffinity.component';

describe('NodePoolAntiAffinity Component', () => {
  test('renders correctly with default props', () => {
    render(<NodePoolAntiAffinity isChecked={false} isEnabled onChange={() => {}} />);

    expect(screen.getByText('kubernetes_node_pool_anti_affinity')).toBeInTheDocument();
    expect(screen.getByText('kubernetes_node_pool_anti_affinity_description')).toBeInTheDocument();
    expect(screen.getByTestId('toggle-anti-affinity')).toBeInTheDocument();
  });

  test('disables the toggle when isEnabled is false', () => {
    render(<NodePoolAntiAffinity isChecked={false} isEnabled={false} onChange={() => {}} />);

    const toggle = screen.getByTestId('toggle-anti-affinity');
    expect(toggle).toBeDisabled();
  });

  test('enables the toggle when isEnabled is true', () => {
    render(<NodePoolAntiAffinity isChecked={false} isEnabled onChange={() => {}} />);

    const toggle = screen.getByTestId('toggle-anti-affinity');
    expect(toggle).not.toBeDisabled();
  });

  test('toggles value when clicked', async () => {
    const onChangeMock = vi.fn();
    render(<NodePoolAntiAffinity isChecked={false} isEnabled onChange={onChangeMock} />);

    const toggle = screen.getByTestId('toggle-anti-affinity');
    await userEvent.click(toggle);

    expect(onChangeMock).toHaveBeenCalledWith(true);
  });

  test('does not toggle value when disabled', async () => {
    const onChangeMock = vi.fn();
    render(<NodePoolAntiAffinity isChecked={false} isEnabled={false} onChange={onChangeMock} />);

    const toggle = screen.getByTestId('toggle-anti-affinity');
    await userEvent.click(toggle);

    expect(onChangeMock).not.toHaveBeenCalled();
  });

  test('displays the correct text when checked', () => {
    render(<NodePoolAntiAffinity isChecked isEnabled onChange={() => {}} />);

    expect(screen.getByText('kubernetes_node_pool_anti_affinity_true')).toBeInTheDocument();
  });

  test('displays the correct text when unchecked', () => {
    render(<NodePoolAntiAffinity isChecked={false} isEnabled onChange={() => {}} />);

    expect(screen.getByText('kubernetes_node_pool_anti_affinity_false')).toBeInTheDocument();
  });
});
