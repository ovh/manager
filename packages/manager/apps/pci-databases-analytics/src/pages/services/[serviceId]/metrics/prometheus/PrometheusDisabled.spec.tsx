import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { UseQueryResult } from '@tanstack/react-query';
import PrometheusDisabled from './PrometheusDisabled.component';
import { useServiceData } from '../../Service.context';
import * as database from '@/types/cloud/project/database';
import { CdbError } from '@/data/api/database';
import { mockedService } from '@/__tests__/helpers/mocks/services';

vi.mock('../../Service.context', () => ({
  useServiceData: vi.fn(),
}));

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

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('PrometheusDisabled', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render the activation description and notes', () => {
    vi.mocked(useServiceData).mockReturnValue(useServiceDataMock);

    render(
      <PrometheusDisabled
        isPending={false}
        onEnablePrometheusClicked={vi.fn()}
      />,
    );

    expect(screen.getByText('activationDescription')).toBeInTheDocument();
    expect(screen.getByText('activationDelayNote')).toBeInTheDocument();
    expect(screen.getByText('postActivationNote')).toBeInTheDocument();
  });

  it('should disable the enable button if service capability is not enabled or is pending', () => {
    const disabledServiceData = {
      ...useServiceDataMock,
      service: {
        ...mockServiceData,
        capabilities: {
          service: { update: database.service.capability.StateEnum.disabled },
        },
      },
    };
    vi.mocked(useServiceData).mockReturnValue(disabledServiceData);

    render(
      <PrometheusDisabled
        isPending={true}
        onEnablePrometheusClicked={vi.fn()}
      />,
    );

    const enableButton = screen.getByText('enableButtonLabel');
    expect(enableButton).toBeDisabled();
  });

  it('should enable the button when capability is enabled and not pending', () => {
    vi.mocked(useServiceData).mockReturnValue(useServiceDataMock);

    render(
      <PrometheusDisabled
        isPending={false}
        onEnablePrometheusClicked={vi.fn()}
      />,
    );

    const enableButton = screen.getByText('enableButtonLabel');
    expect(enableButton).not.toBeDisabled();
  });

  it('should show a loader when isPending is true', () => {
    vi.mocked(useServiceData).mockReturnValue(useServiceDataMock);

    render(
      <PrometheusDisabled
        isPending={true}
        onEnablePrometheusClicked={vi.fn()}
      />,
    );

    expect(screen.getByTestId('prometheus-button-loader')).toBeInTheDocument();
  });

  it('should call onEnablePrometheusClicked when the enable button is clicked', () => {
    const onEnableMock = vi.fn();
    vi.mocked(useServiceData).mockReturnValue(useServiceDataMock);

    render(
      <PrometheusDisabled
        isPending={false}
        onEnablePrometheusClicked={onEnableMock}
      />,
    );

    const enableButton = screen.getByText('enableButtonLabel');
    fireEvent.click(enableButton);

    expect(onEnableMock).toHaveBeenCalled();
  });
});
