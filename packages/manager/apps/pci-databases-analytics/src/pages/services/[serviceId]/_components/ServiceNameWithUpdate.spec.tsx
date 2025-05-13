import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  render,
  screen,
  waitFor,
  fireEvent,
  act,
} from '@testing-library/react';
import { useToast } from '@datatr-ux/uxlib';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import ServiceNameWithUpdate from './ServiceNameWithUpdate.component';
import { mockedService } from '@/__tests__/helpers/mocks/services';
import { apiErrorMock } from '@/__tests__/helpers/mocks/cdbError';
import * as serviceApi from '@/data/api/database/service.api';

describe('ServiceNameWithUpdate', () => {
  beforeEach(() => {
    vi.mock('react-router-dom', async () => {
      const mod = await vi.importActual('react-router-dom');
      return {
        ...mod,
        useParams: () => ({
          projectId: 'projectId',
        }),
      };
    });

    vi.mock('react-i18next', () => ({
      useTranslation: () => ({
        t: (key: string) => key,
      }),
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

    vi.mock('@/data/api/database/service.api', () => ({
      editService: vi.fn((s) => s),
    }));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should display the service name', () => {
    render(<ServiceNameWithUpdate service={mockedService} />, {
      wrapper: RouterWithQueryClientWrapper,
    });

    expect(screen.getByText(mockedService.description)).toBeInTheDocument();
  });

  it('should switch to edit mode on clicking the edit button', () => {
    render(<ServiceNameWithUpdate service={mockedService} />, {
      wrapper: RouterWithQueryClientWrapper,
    });

    act(() => {
      fireEvent.click(screen.getByTestId('edit-button'));
    });

    expect(screen.getByTestId('rename-service-input')).toBeInTheDocument();
  });

  it('should submit the new name and show success toast', async () => {
    render(<ServiceNameWithUpdate service={mockedService} />, {
      wrapper: RouterWithQueryClientWrapper,
    });

    act(() => {
      fireEvent.click(screen.getByTestId('edit-button'));
    });

    act(() => {
      fireEvent.change(screen.getByTestId('rename-service-input'), {
        target: { value: 'NewServiceName' },
      });
    });

    act(() => {
      fireEvent.click(screen.getByTestId('validate-button'));
    });

    await waitFor(() => {
      expect(serviceApi.editService).toHaveBeenCalledWith({
        serviceId: mockedService.id,
        projectId: 'projectId',
        engine: mockedService.engine,
        data: {
          description: 'NewServiceName',
        },
      });
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'renameServiceToastSuccessTitle',
        description: 'renameServiceToastSuccessDescription',
      });
    });
  });

  it('should show error toast on API failure', async () => {
    vi.mocked(serviceApi.editService).mockImplementation(() => {
      throw apiErrorMock;
    });

    render(<ServiceNameWithUpdate service={mockedService} />, {
      wrapper: RouterWithQueryClientWrapper,
    });

    act(() => {
      fireEvent.click(screen.getByTestId('edit-button'));
    });

    act(() => {
      fireEvent.change(screen.getByTestId('rename-service-input'), {
        target: { value: 'NewServiceName' },
      });
    });

    act(() => {
      fireEvent.click(screen.getByTestId('validate-button'));
    });

    await waitFor(() => {
      expect(serviceApi.editService).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'renameServiceToastErrorTitle',
        description: apiErrorMock.response.data.message,
        variant: 'destructive',
      });
    });
  });

  it('should exit edit mode on cancel button click', () => {
    render(<ServiceNameWithUpdate service={mockedService} />, {
      wrapper: RouterWithQueryClientWrapper,
    });

    act(() => {
      fireEvent.click(screen.getByTestId('edit-button'));
    });

    expect(screen.getByTestId('rename-service-input')).toBeInTheDocument();

    act(() => {
      fireEvent.click(screen.getByTestId('cancel-button'));
    });

    expect(
      screen.queryByTestId('rename-service-input'),
    ).not.toBeInTheDocument();
    expect(screen.getByText(mockedService.description)).toBeInTheDocument();
  });
});
