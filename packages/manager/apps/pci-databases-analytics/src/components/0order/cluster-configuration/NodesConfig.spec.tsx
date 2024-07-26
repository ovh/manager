import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import NodesConfig from '@/components/order/cluster-configuration/NodesConfig.component';

describe('NodesConfig component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });
  it('should display the Label and Input', async () => {
    const onChange = vi.fn();
    render(
      <NodesConfig maximum={3} minimum={1} onChange={onChange} value={1} />,
    );
    await waitFor(() => {
      expect(
        screen.getByTestId('nodes-configuration-label'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('nodes-configuration-input'),
      ).toBeInTheDocument();
    });
  });

  it('should not be displayed', async () => {
    const onChange = vi.fn();
    render(
      <NodesConfig maximum={1} minimum={1} onChange={onChange} value={1} />,
    );
    await waitFor(() => {
      expect(screen.queryByTestId('nodes-configuration-label')).toBeNull();
      expect(screen.queryByTestId('nodes-configuration-input')).toBeNull();
    });
  });

  it('should trigger callback when input change', async () => {
    const onChange = vi.fn();
    render(
      <NodesConfig maximum={3} minimum={1} onChange={onChange} value={1} />,
    );
    act(() => {
      fireEvent.change(screen.getByTestId('nodes-configuration-input'), {
        target: { value: '2' },
      });
    });
    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith(2);
    });
  });
});
