import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import ProbeForm from './ProbeForm.component';

describe('Probe form component', () => {
  const onChange = vi.fn();
  it('should display Probe Form without any activation', async () => {
    render(
      <ProbeForm
        onChange={onChange}
        probeValue={{ path: '/health', port: 8080 }}
      />,
    );
    await waitFor(() => {
      expect(screen.getByTestId('probe-swith-button')).toBeInTheDocument();
      expect(screen.queryByTestId('prob-form-input')).not.toBeInTheDocument();
    });
  });

  it('should display Probe Form and activate', async () => {
    render(<ProbeForm onChange={onChange} probeValue={{}} />);
    await waitFor(() => {
      expect(screen.getByTestId('probe-swith-button')).toBeInTheDocument();
      expect(screen.queryByTestId('prob-form-input')).not.toBeInTheDocument();
    });

    act(() => {
      fireEvent.click(screen.getByTestId('probe-swith-button'));
    });
    await waitFor(() => {
      expect(screen.getByTestId('path-input-field')).toBeInTheDocument();
      expect(screen.getByTestId('port-input-field')).toBeInTheDocument();
      expect(screen.getByTestId('probe-add-button')).toBeInTheDocument();
    });
  });

  it('should display Probe Form and trigger on change on submit', async () => {
    render(<ProbeForm onChange={onChange} probeValue={{}} />);
    act(() => {
      fireEvent.click(screen.getByTestId('probe-swith-button'));
    });
    await waitFor(() => {
      expect(screen.getByTestId('path-input-field')).toBeInTheDocument();
    });
    act(() => {
      fireEvent.change(screen.getByTestId('path-input-field'), {
        target: {
          value: '/health',
        },
      });
      fireEvent.change(screen.getByTestId('port-input-field'), {
        target: {
          value: 8080,
        },
      });
      fireEvent.click(screen.getByTestId('probe-add-button'));
    });
    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith({ path: '/health', port: 8080 });
    });
  });
});
