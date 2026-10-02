import { describe, it, expect, vi, afterEach } from 'vitest';
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
import UnshelveService from './Unshelve.modal';
import * as serviceApi from '@/data/api/database/service.api';
import { apiErrorMock } from '@/__tests__/helpers/mocks/cdbError';

vi.mock('@/data/api/database/service.api', () => ({
  getService: vi.fn(() => mockedService),
  unshelveService: vi.fn(() => mockedService),
}));

describe('Settings unshelve modal', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render unshelve modal', async () => {
    render(<UnshelveService />, {
      wrapper: RouterWithQueryClientWrapper,
    });

    await waitFor(() => {
      expect(screen.getByTestId('unshelve-service-modal')).toBeInTheDocument();
      expect(
        screen.getByTestId('unshelve-service-submit-button'),
      ).toBeInTheDocument();
    });
  });

  it('should unshelve service on confirm', async () => {
    render(<UnshelveService />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    await waitFor(() => {
      expect(
        screen.getByTestId('unshelve-service-submit-button'),
      ).toBeInTheDocument();
    });
    act(() => {
      fireEvent.click(screen.getByTestId('unshelve-service-submit-button'));
    });
    await waitFor(() => {
      expect(serviceApi.unshelveService).toHaveBeenCalledWith(
        expect.objectContaining({
          engine: mockedService.engine,
          serviceId: mockedService.id,
        }),
      );
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'unshelveServiceToastSuccessTitle',
        description: 'unshelveServiceToastSuccessDescription',
      });
    });
  });

  it('should display an error toast when API fails', async () => {
    vi.mocked(serviceApi.unshelveService).mockImplementation(() => {
      throw apiErrorMock;
    });
    render(<UnshelveService />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    await waitFor(() => {
      expect(
        screen.getByTestId('unshelve-service-submit-button'),
      ).toBeInTheDocument();
    });
    act(() => {
      fireEvent.click(screen.getByTestId('unshelve-service-submit-button'));
    });
    await waitFor(() => {
      expect(serviceApi.unshelveService).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'unshelveServiceToastErrorTitle',
        description: apiErrorMock.response.data.message,
        variant: 'critical',
      });
    });
  });
});
