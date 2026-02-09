import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  render,
  screen,
  waitFor,
  fireEvent,
  act,
} from '@testing-library/react';
import { useToast } from '@datatr-ux/uxlib';
import { setMockedUseParams } from '@/__tests__/helpers/mockRouterDomHelper';
import { mockManagerReactShellClient } from '@/__tests__/helpers/mockShellHelper';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import RestoreServiceModal from './Restore.modal';
import { mockedService as mockedServiceOrig } from '@/__tests__/helpers/mocks/services';
import { apiErrorMock } from '@/__tests__/helpers/mocks/cdbError';
import * as backupApi from '@/data/api/database/backup.api';
import { mockedBackup as mockedBackupOrig } from '@/__tests__/helpers/mocks/backup';

const mockedBackup = {
  ...mockedBackupOrig,
  id: '4e201af3-cb92-4b9d-a788-ab3359205e28',
};
const mockedService = {
  ...mockedServiceOrig,
  id: '98054125-0189-4250-96d7-5e06cd8fd645',
};

vi.mock('@/data/api/database/backup.api', () => ({
  getServiceBackups: vi.fn(() => [mockedBackup]),
  restoreBackup: vi.fn(),
}));

vi.mock('@/pages/services/[serviceId]/Service.context', () => ({
  useServiceData: vi.fn(() => ({
    projectId: 'projectId',
    service: mockedService,
  })),
}));

describe('Restore Service Modal', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockManagerReactShellClient();
    setMockedUseParams({
      backupId: mockedBackup.id,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should open the modal', async () => {
    render(<RestoreServiceModal />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    await waitFor(() => {
      expect(screen.queryByTestId('restore-modal')).toBeInTheDocument();
    });
  });

  it('should restore the service on submit', async () => {
    render(<RestoreServiceModal />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    act(() => {
      fireEvent.click(screen.getByTestId('restore-submit-button'));
    });
    await waitFor(() => {
      expect(backupApi.restoreBackup).toHaveBeenCalledWith(
        expect.objectContaining({
          projectId: 'projectId',
          engine: mockedService.engine,
          serviceId: mockedService.id,
          backupId: mockedBackup.id,
        }),
      );
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'restoreBackupToastSuccessTitle',
        description: 'restoreBackupToastSuccessDescription',
      });
    });
  });

  it('should call onError when API fails', async () => {
    vi.mocked(backupApi.restoreBackup).mockImplementation(() => {
      throw apiErrorMock;
    });
    render(<RestoreServiceModal />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    act(() => {
      fireEvent.click(screen.getByTestId('restore-submit-button'));
    });
    await waitFor(() => {
      expect(backupApi.restoreBackup).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'restoreBackupToastErrorTitle',
        description: apiErrorMock.response.data.message,
        variant: 'critical',
      });
    });
  });
});
