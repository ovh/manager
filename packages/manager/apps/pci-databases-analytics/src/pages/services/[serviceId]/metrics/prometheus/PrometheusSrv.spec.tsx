import { describe, it, expect, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import PrometheusSrv from './PrometheusSrv.component';
import { PrometheusData } from '@/data/api/database/prometheus.api';

const mockPrometheusData: PrometheusData = {
  username: 'srv-user',
  srvDomain: 'srv.example.com',
};

describe('PrometheusSrv', () => {
  afterEach(() => {
    // Clear any residual DOM or mocks after each test
    document.body.innerHTML = '';
  });

  it('should render table rows with correct username and srvDomain', () => {
    render(<PrometheusSrv prometheusData={mockPrometheusData} />);

    // Verify username row
    expect(screen.getByText('usernameLabel')).toBeInTheDocument();
    expect(screen.getByText('srv-user')).toBeInTheDocument();

    // Verify srvDomain row
    expect(screen.getByText('srvDomainLabel')).toBeInTheDocument();
    expect(screen.getByText('srv.example.com')).toBeInTheDocument();
  });

  it('should not render additional unexpected rows', () => {
    render(<PrometheusSrv prometheusData={mockPrometheusData} />);

    // Verify there are no unexpected rows
    expect(screen.queryByText('unexpectedLabel')).not.toBeInTheDocument();
    expect(screen.queryByText('unexpectedValue')).not.toBeInTheDocument();
  });
});
