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
import { setMockedUseParams } from '@/__tests__/helpers/mockRouterDomHelper';
import RenameService from './RenameService.component';
import { mockedService } from '@/__tests__/helpers/mocks/services';
import { apiErrorMock } from '@/__tests__/helpers/mocks/cdbError';


vi.mock('@/data/api/database/service.api', () => ({
  editService: vi.fn((s) => s),
}));
vi.mock('@/hooks/useTracking.hook', () => ({
  useTrackAction: vi.fn(() => vi.fn()),
}));

describe('Rename service modal', () => {
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
    render(<RenameService service={mockedService} />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    await waitFor(() => {
      expect(screen.queryByTestId('rename-service-modal')).toBeInTheDocument();
    });
  });

  it('should rename the service on submit', async () => {
    render(<RenameService service={mockedService} />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    act(() => {
      fireEvent.change(screen.getByTestId('rename-service-input'), {
        target: { value: 'New Service Name' },
      });
    });
    act(() => {
      fireEvent.click(screen.getByTestId('rename-service-submit-button'));
    });
    await waitFor(() => {
      expect(serviceApi.editService).toHaveBeenCalledWith({
        serviceId: mockedService.id,
        projectId: 'projectId',
        engine: mockedService.engine,
        data: {
          description: 'New Service Name',
        },
      });
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'renameServiceToastSuccessTitle',
        description: 'renameServiceToastSuccessDescription',
      });
    });
  });

  it('should call onError when API fails', async () => {
    vi.mocked(serviceApi.editService).mockImplementation(() => {
      throw apiErrorMock;
    });
    render(<RenameService service={mockedService} />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    act(() => {
      fireEvent.change(screen.getByTestId('rename-service-input'), {
        target: { value: 'New Service Name' },
      });
    });
    act(() => {
      fireEvent.click(screen.getByTestId('rename-service-submit-button'));
    });
    await waitFor(() => {
      expect(serviceApi.editService).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'renameServiceToastErrorTitle',
        description: apiErrorMock.response.data.message,
        variant: 'critical',
      });
    });
  });
});
