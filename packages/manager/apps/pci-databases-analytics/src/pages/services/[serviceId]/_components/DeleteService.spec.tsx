import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  render,
  screen,
  waitFor,
  fireEvent,
  act,
} from '@testing-library/react';
import { useToast } from '@datatr-ux/uxlib';
import * as serviceApi from '@/data/api/database/service.api';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockedService } from '@/__tests__/helpers/mocks/services';
import { apiErrorMock } from '@/__tests__/helpers/mocks/cdbError';
import { TERMINATE_CONFIRMATION } from '@/configuration/polling.constants';
import { mockedIntegrations } from '@/__tests__/helpers/mocks/integrations';
import { StateEnum } from '@/types/cloud/project/database/service/capability';
import { setMockedUseParams } from '@/__tests__/helpers/mockRouterDomHelper';
import DeleteService from './DeleteService.component';

vi.mock('@/data/api/database/service.api', () => ({
  getServices: vi.fn(() => [
    mockedService,
    {
      ...mockedService,
      id: mockedIntegrations.destinationServiceId,
      description: 'destinationService',
    },
  ]),
  deleteService: vi.fn(),
}));
vi.mock('@/data/api/database/integration.api', () => ({
  getServiceIntegrations: vi.fn(() => [mockedIntegrations]),
}));

describe('Delete service modal', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    setMockedUseParams({
      projectId: 'projectId',
    });
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should open the modal', async () => {
    render(<DeleteService service={mockedService} />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    await waitFor(() => {
      expect(screen.queryByTestId('delete-service-modal')).toBeInTheDocument();
    });
  });

  it('should delete the service on submit', async () => {
    render(<DeleteService service={mockedService} />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    act(() => {
      fireEvent.change(
        screen.getByTestId('delete-service-confirmation-input'),
        {
          target: { value: TERMINATE_CONFIRMATION },
        },
      );
    });
    act(() => {
      fireEvent.click(screen.getByTestId('delete-service-submit-button'));
    });
    await waitFor(() => {
      expect(serviceApi.deleteService).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'deleteServiceToastSuccessTitle',
        description: 'deleteServiceToastSuccessDescription',
      });
    });
  });

  it('should call onError when API fails', async () => {
    vi.mocked(serviceApi.deleteService).mockImplementation(() => {
      throw apiErrorMock;
    });
    render(<DeleteService service={mockedService} />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    act(() => {
      fireEvent.change(
        screen.getByTestId('delete-service-confirmation-input'),
        {
          target: { value: TERMINATE_CONFIRMATION },
        },
      );
    });
    act(() => {
      fireEvent.click(screen.getByTestId('delete-service-submit-button'));
    });
    await waitFor(() => {
      expect(serviceApi.deleteService).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'deleteServiceToastErrorTitle',
        description: apiErrorMock.response.data.message,
        variant: 'critical',
      });
    });
  });

  it('should disable the submit button if confirmation input is incorrect', async () => {
    render(<DeleteService service={mockedService} />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    act(() => {
      fireEvent.change(
        screen.getByTestId('delete-service-confirmation-input'),
        {
          target: { value: 'WRONG_CONFIRMATION' },
        },
      );
    });
    expect(screen.getByTestId('delete-service-submit-button')).toBeDisabled();
  });

  it('should display integrations if they exist', async () => {
    render(
      <DeleteService
        service={{
          ...mockedService,
          capabilities: {
            ...mockedService.capabilities,
            integrations: {
              read: StateEnum.enabled,
            },
          },
        }}
      />,
      {
        wrapper: RouterWithQueryClientWrapper,
      },
    );

    await waitFor(() => {
      expect(
        screen.getByText('deleteServiceIntegrationDescription'),
      ).toBeInTheDocument();
    });
  });
});
