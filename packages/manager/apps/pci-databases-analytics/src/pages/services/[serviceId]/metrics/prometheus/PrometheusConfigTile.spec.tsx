import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';
import { UseQueryResult } from '@tanstack/react-query';
import { useToast } from '@datatr-ux/uxlib';
import PrometheusConfigTile from './PrometheusConfigTile.component';
import { useServiceData } from '../../Service.context';
import * as database from '@/types/cloud/project/database';
import { mockedService } from '@/__tests__/helpers/mocks/services';
import { CdbError } from '@/data/api/database';
import * as serviceApi from '@/data/api/database/service.api';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { apiErrorMock } from '@/__tests__/helpers/mocks/cdbError';

const mockPrometheusData = {
  username: 'test-user',
  targets: [{ host: 'host1.example.com', port: 9090 }],
};

vi.mock('../../Service.context', () => ({
  useServiceData: vi.fn(),
}));

vi.mock('@/data/api/database/prometheus.api', () => ({
  getPrometheus: vi.fn(() => [mockPrometheusData]),
  resetPrometheusUserPassword: vi.fn(() => {}),
}));
vi.mock('@/data/api/database/service.api', () => ({
  editService: vi.fn((s) => s),
}));
vi.mock('@datatr-ux/uxlib', async () => {
  const mod = await vi.importActual('@datatr-ux/uxlib');
  const toastMock = vi.fn();
  return {
    ...mod,
    useToast: vi.fn(() => ({
      toast: toastMock,
    })),
  };
});

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('PrometheusConfigTile', () => {
  afterEach(() => {
    vi.clearAllMocks();
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

  it('should render the tile with disabled state initially', () => {
    vi.mocked(useServiceData).mockReturnValue(useServiceDataMock);
    render(<PrometheusConfigTile />, { wrapper: RouterWithQueryClientWrapper });

    expect(screen.getByText('disabledBadgeLabel')).toBeInTheDocument();
    expect(screen.getByText('title')).toBeInTheDocument();
  });

  it('should enable Prometheus when the enable button is clicked', async () => {
    vi.mocked(useServiceData).mockReturnValue(useServiceDataMock);

    render(<PrometheusConfigTile />, { wrapper: RouterWithQueryClientWrapper });

    act(() => {
      const trigger = screen.getByTestId('prometheus-accordion-trigger');
      fireEvent.click(trigger);
    });
    await waitFor(() => {
      expect(screen.getByText('enableButtonLabel')).toBeInTheDocument();
    });
    act(() => {
      const enableButton = screen.getByText('enableButtonLabel');
      fireEvent.click(enableButton);
    });

    await waitFor(() => {
      expect(serviceApi.editService).toHaveBeenCalledWith({
        engine: 'mongodb',
        projectId: 'projectId',
        serviceId: 'serviceId',
        data: { enablePrometheus: true },
      });
    });
  });

  it('should display PrometheusEnabled component when Prometheus is enabled', async () => {
    vi.mocked(useServiceData).mockReturnValue({
      ...useServiceDataMock,
      service: { ...mockServiceData, enablePrometheus: true },
    });

    render(<PrometheusConfigTile />, { wrapper: RouterWithQueryClientWrapper });

    act(() => {
      const trigger = screen.getByTestId('prometheus-accordion-trigger');
      fireEvent.click(trigger);
    });

    await waitFor(() => {
      expect(screen.getByText('srvDomainLabel')).toBeInTheDocument();
    });
  });

  it('should display a confirm dialog when disabling Prometheus', async () => {
    vi.mocked(useServiceData).mockReturnValue({
      ...useServiceDataMock,
      service: { ...mockServiceData, enablePrometheus: true },
    });
    render(<PrometheusConfigTile />, { wrapper: RouterWithQueryClientWrapper });

    act(() => {
      const trigger = screen.getByTestId('prometheus-accordion-trigger');
      fireEvent.click(trigger);
    });
    await waitFor(() => {
      expect(screen.getByText('disableButtonLabel')).toBeInTheDocument();
    });
    act(() => {
      const disableButton = screen.getByText('disableButtonLabel');
      fireEvent.click(disableButton);
    });

    await waitFor(() => {
      expect(
        screen.getByTestId('prometheus-disable-confirm-dialog'),
      ).toBeInTheDocument();
    });
  });

  it('should display a toast on error when enabling or disabling Prometheus fails', async () => {
    vi.mocked(serviceApi.editService).mockImplementation(() => {
      throw apiErrorMock;
    });

    vi.mocked(useServiceData).mockReturnValue(useServiceDataMock);

    render(<PrometheusConfigTile />, { wrapper: RouterWithQueryClientWrapper });

    act(() => {
      const trigger = screen.getByTestId('prometheus-accordion-trigger');
      fireEvent.click(trigger);
    });
    act(() => {
      const enableButton = screen.getByText('enableButtonLabel');
      fireEvent.click(enableButton);
    });

    await waitFor(() => {
      expect(serviceApi.editService).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'errorToastTitle',
        description: apiErrorMock.response.data.message,
        variant: 'destructive',
      });
    });
  });
});
