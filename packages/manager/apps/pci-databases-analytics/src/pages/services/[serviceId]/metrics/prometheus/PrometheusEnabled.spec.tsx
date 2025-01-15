import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { UseQueryResult } from '@tanstack/react-query';
import PrometheusEnabled from './PrometheusEnabled.component';
import { PrometheusData } from '@/data/api/database/prometheus.api';
import { useServiceData } from '../../Service.context';
import { mockedService } from '@/__tests__/helpers/mocks/services';
import * as database from '@/types/cloud/project/database';
import { CdbError } from '@/data/api/database';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';

vi.mock('../../Service.context', () => ({
  useServiceData: vi.fn(),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

const mockedUsedNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const mod = await vi.importActual('react-router-dom');
  return {
    ...mod,
    useNavigate: () => mockedUsedNavigate,
  };
});

const mockServiceData = {
  ...mockedService,
  capabilities: {
    prometheusCredentialsReset: {
      create: database.service.capability.StateEnum.enabled,
    },
    service: {
      update: database.service.capability.StateEnum.enabled,
    },
  },
};
const useServiceDataMock = {
  projectId: 'projectId',
  service: mockServiceData,
  category: 'operational',
  serviceQuery: {} as UseQueryResult<database.Service, CdbError>,
};

const mockPrometheusTargetsData: PrometheusData = {
  username: 'test-user',
  targets: [{ host: 'host1.example.com', port: 9090 }],
};

const mockPrometheusSrvData: PrometheusData = {
  username: 'srv-user',
  srvDomain: 'srv.example.com',
};

describe('PrometheusEnabled', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render PrometheusTargets if prometheusData contains targets', () => {
    vi.mocked(useServiceData).mockReturnValue(useServiceDataMock);
    render(
      <Router>
        <PrometheusEnabled
          prometheusData={mockPrometheusTargetsData}
          isPending={false}
          onDisablePrometheusClicked={vi.fn()}
        />
      </Router>,
    );

    expect(screen.getByTestId('prometheus-data-table')).toBeInTheDocument();
  });

  it('should render PrometheusSrv if prometheusData does not contain targets', () => {
    vi.mocked(useServiceData).mockReturnValue(useServiceDataMock);
    render(
      <PrometheusEnabled
        prometheusData={mockPrometheusSrvData}
        isPending={false}
        onDisablePrometheusClicked={vi.fn()}
      />,
      { wrapper: RouterWithQueryClientWrapper },
    );

    expect(screen.getByText('srvDomainLabel')).toBeInTheDocument();
  });

  it('should disable reset password button if capability is not enabled or pending', () => {
    vi.mocked(useServiceData).mockReturnValue(useServiceDataMock);

    render(
      <PrometheusEnabled
        prometheusData={mockPrometheusTargetsData}
        isPending={true}
        onDisablePrometheusClicked={vi.fn()}
      />,
      { wrapper: RouterWithQueryClientWrapper },
    );

    const resetButton = screen.getByText('resetPasswordButtonLabel');
    expect(resetButton).toBeDisabled();
  });

  it('should call onDisablePrometheusClicked when disable button is clicked', () => {
    const onDisableMock = vi.fn();
    vi.mocked(useServiceData).mockReturnValue(useServiceDataMock);

    render(
      <PrometheusEnabled
        prometheusData={mockPrometheusTargetsData}
        isPending={false}
        onDisablePrometheusClicked={onDisableMock}
      />,
      { wrapper: RouterWithQueryClientWrapper },
    );

    const disableButton = screen.getByText('disableButtonLabel');
    fireEvent.click(disableButton);

    expect(onDisableMock).toHaveBeenCalled();
  });

  it('should show a loader if prometheusData is not provided', () => {
    vi.mocked(useServiceData).mockReturnValue(useServiceDataMock);

    render(
      <PrometheusEnabled
        prometheusData={null}
        isPending={false}
        onDisablePrometheusClicked={vi.fn()}
      />,
      { wrapper: RouterWithQueryClientWrapper },
    );

    expect(screen.getByTestId('prometheus-loader')).toBeInTheDocument();
  });
});
