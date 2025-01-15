import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
  act,
} from '@testing-library/react';
import PrometheusTargets from './PrometheusTargets.component';
import { PrometheusData } from '@/data/api/database/prometheus.api';

const mockPrometheusData: PrometheusData = {
  username: 'test-user',
  targets: [
    { host: 'host1.example.com', port: 9090 },
    { host: 'host2.example.com', port: 9091 },
  ],
};

describe('PrometheusTargets', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render the select dropdown when multiple targets are available', () => {
    render(<PrometheusTargets prometheusData={mockPrometheusData} />);

    expect(
      screen.getByTestId('prometheus-target-selector'),
    ).toBeInTheDocument();
  });

  it('should default to the first target when none is selected', async () => {
    render(<PrometheusTargets prometheusData={mockPrometheusData} />);

    // Ensure the dropdown shows the default selected host
    const selectTrigger = screen.getByTestId('prometheus-target-selector');
    await waitFor(() => {
      expect(
        within(selectTrigger).getByText('host1.example.com'),
      ).toBeInTheDocument();
    });

    // Verify the table displays the correct host and port
    const table = screen.getByTestId('prometheus-data-table');
    expect(within(table).getByText('host1.example.com')).toBeInTheDocument();
    expect(within(table).getByText('9090')).toBeInTheDocument();
  });

  it('should update target details when a different host is selected', async () => {
    render(<PrometheusTargets prometheusData={mockPrometheusData} />);

    // open target select
    act(() => {
      const trigger = screen.getByTestId('prometheus-target-selector');
      fireEvent.focus(trigger);
      fireEvent.keyDown(trigger, { key: 'Enter', code: 13 });
    });
    // select second option
    act(() => {
      const options = screen.getAllByRole('option');
      fireEvent.keyDown(options[1], { key: 'Enter', code: 13 });
    });

    await waitFor(() => {
      const table = screen.getByTestId('prometheus-data-table');
      expect(within(table).getByText('host2.example.com')).toBeInTheDocument();
      expect(within(table).getByText('9091')).toBeInTheDocument();
    });
  });

  it('should display correct table rows for username, host, and port', () => {
    render(<PrometheusTargets prometheusData={mockPrometheusData} />);

    const table = screen.getByTestId('prometheus-data-table');
    expect(within(table).getByText('usernameLabel')).toBeInTheDocument();
    expect(within(table).getByText('test-user')).toBeInTheDocument();
    expect(within(table).getByText('hostLabel')).toBeInTheDocument();
    expect(within(table).getByText('host1.example.com')).toBeInTheDocument();
    expect(within(table).getByText('portLabel')).toBeInTheDocument();
    expect(within(table).getByText('9090')).toBeInTheDocument();
  });
});
