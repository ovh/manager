import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { useToast } from '@datatr-ux/uxlib';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockedService } from '@/__tests__/helpers/mocks/services';
import DeletionProtection from './DeletionProtection.modal';
import * as serviceApi from '@/data/api/database/service.api';
import { apiErrorMock } from '@/__tests__/helpers/mocks/cdbError';

describe('Settings delete modal', () => {
  beforeEach(() => {
    vi.mock('@/pages/services/[serviceId]/Service.context', () => ({
      useServiceData: vi.fn(() => ({
        projectId: 'projectId',
        serviceId: 'serviceId',
        service: mockedService,
      })),
    }));
    vi.mock('@/data/api/database/service.api', () => ({
      getService: vi.fn(() => mockedService),
      editService: vi.fn((service) => service),
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
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render delete modal', async () => {
    render(<DeletionProtection />, {
      wrapper: RouterWithQueryClientWrapper,
    });

    await waitFor(() => {
      expect(
        screen.getByTestId('deletion-protection-modal'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('deletion-protection-submit-button'),
      ).toBeInTheDocument();
    });
  });

  it('should edit service on confimr', async () => {
    render(<DeletionProtection />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    act(() => {
      fireEvent.click(screen.getByTestId('deletion-protection-submit-button'));
    });
    await waitFor(() => {
      expect(serviceApi.editService).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'updateServiceToastSuccessTitle',
        description: 'updateServiceToastSuccessDescription',
      });
    });
  });

  it('should call onError when API fails', async () => {
    vi.mocked(serviceApi.editService).mockImplementation(() => {
      throw apiErrorMock;
    });
    render(<DeletionProtection />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    act(() => {
      fireEvent.click(screen.getByTestId('deletion-protection-submit-button'));
    });
    await waitFor(() => {
      expect(serviceApi.editService).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'updateServiceToastErrorTitle',
        description: apiErrorMock.response.data.message,
        variant: 'destructive',
      });
    });
  });
});
