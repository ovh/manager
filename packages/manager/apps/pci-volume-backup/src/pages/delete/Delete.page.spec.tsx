import { ApiError } from '@ovh-ux/manager-core-api';
import { act, fireEvent, render } from '@testing-library/react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PciModal, DeletionModalProps } from '@ovh-ux/manager-pci-common';
import { useNotifications } from '@/hooks/notifications/useNotifications';
import { useBackups, useDeleteBackup } from '@/data/hooks/useVolumeBackup';
import { TBackup } from '@/data/api/api.types';
import DeletePage from './Delete.page';

const MOCK_BACKUP: TBackup = {
  id: 'backup-id',
  creationDate: '2024-12-17T15:51:05Z',
  name: 'Mock backup',
  size: 10,
  volumeId: 'fake-volume-id',
  region: 'AF-NORTH-LZ-RBA-A',
  status: 'ok',
};

vi.mock('@/data/hooks/useVolumeBackup', () => ({
  useBackups: vi.fn(),
  useVolume: vi.fn(),
  useDeleteBackup: vi.fn(),
}));

vi.mock('@/hooks/notifications/useNotifications', () => ({
  useNotifications: vi.fn(),
}));

vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
  useParams: vi.fn(),
  useSearchParams: vi.fn(),
}));

vi.mock('@ovh-ux/manager-pci-common', async () => {
  const mod = await vi.importActual('@ovh-ux/manager-pci-common');
  return {
    ...mod,
    DeletionModal: (props: Readonly<DeletionModalProps>) => (
      <PciModal {...props} />
    ),
  };
});

describe('DeleteBackup Modal', () => {
  const addSuccessMessage = vi.fn();
  const addErrorMessage = vi.fn();
  const mockNavigate = vi.fn();
  const mockedDeleteBackup = vi.fn();

  // Setup default mocks for each test
  const setupDefaultMocks = ({
    backupLoading = false,
    deletePending = false,
    withData = false,
  } = {}) => {
    vi.clearAllMocks();

    vi.mocked(useNotifications).mockReturnValue({
      addSuccessMessage,
      addErrorMessage,
    });

    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
    vi.mocked(useParams).mockReturnValue({
      projectId: 'project-id',
    });
    vi.mocked(useSearchParams).mockReturnValue(([
      { get: () => 'backup-id' },
    ] as unknown) as ReturnType<typeof useSearchParams>);

    vi.mocked(useBackups).mockReturnValue(({
      data: withData ? { data: [MOCK_BACKUP] } : undefined,
      isLoading: backupLoading,
      error: null,
    } as unknown) as ReturnType<typeof useBackups>);

    vi.mocked(useDeleteBackup).mockReturnValue(({
      deleteBackup: mockedDeleteBackup,
      isPending: deletePending,
    } as unknown) as ReturnType<typeof useDeleteBackup>);
  };

  beforeEach(() => {
    setupDefaultMocks();
  });

  it('should render loading state when the backup is loading', () => {
    setupDefaultMocks({ backupLoading: true });

    const { getByTestId } = render(<DeletePage />);

    const spinner = getByTestId('pciModal-spinner');
    const submitButton = getByTestId('pciModal-button_submit');

    expect(spinner).toBeVisible();
    expect(submitButton).toBeDisabled();
  });

  it('should call deleteBackup when confirm button is clicked', async () => {
    setupDefaultMocks({ withData: true });
    const { getByTestId } = render(<DeletePage />);

    const confirmButton = getByTestId('pciModal-button_submit');
    await act(() => fireEvent.click(confirmButton));

    expect(mockedDeleteBackup).toHaveBeenCalledWith(MOCK_BACKUP.id);
  });

  it('should show success notification and navigate back on successful deletion', async () => {
    let successCallback: (() => void) | undefined;

    setupDefaultMocks({ withData: true });

    // Override the delete mock to capture the success callback
    vi.mocked(useDeleteBackup).mockImplementation(({ onSuccess }) => {
      successCallback = onSuccess;
      return ({
        deleteBackup: mockedDeleteBackup,
        isPending: false,
      } as unknown) as ReturnType<typeof useDeleteBackup>;
    });

    const { getByTestId } = render(<DeletePage />);

    const confirmButton = getByTestId('pciModal-button_submit');
    fireEvent.click(confirmButton);

    expect(mockedDeleteBackup).toHaveBeenCalledWith(MOCK_BACKUP.id);

    // Call the success callback manually
    if (successCallback) {
      successCallback();
    }

    expect(addSuccessMessage).toHaveBeenCalledWith({
      i18nKey:
        'pci_projects_project_storages_volume_backup_list_delete_success',
      values: {
        volumeBackupName: MOCK_BACKUP.name,
      },
    });
    expect(mockNavigate).toHaveBeenCalledWith('..');
  });

  it('should show error notification and navigate back on deletion failure', () => {
    let errorCallback: ((error: ApiError) => void) | undefined;
    const mockError = new Error('Restoration failed') as ApiError;

    setupDefaultMocks({ withData: true });

    // Override the delete mock to capture the error callback
    vi.mocked(useDeleteBackup).mockImplementation(({ onError }) => {
      errorCallback = onError;
      return ({
        deleteBackup: mockedDeleteBackup,
        isPending: false,
      } as unknown) as ReturnType<typeof useDeleteBackup>;
    });

    const { getByTestId } = render(<DeletePage />);

    const confirmButton = getByTestId('pciModal-button_submit');
    fireEvent.click(confirmButton);

    expect(mockedDeleteBackup).toHaveBeenCalledWith(MOCK_BACKUP.id);

    // Call the error callback manually
    if (errorCallback) {
      errorCallback(mockError);
    }

    expect(addErrorMessage).toHaveBeenCalledWith({
      i18nKey: 'pci_projects_project_storages_volume_backup_list_delete_error',
      error: mockError,
      values: {
        volumeBackupName: MOCK_BACKUP.name,
      },
    });
    expect(mockNavigate).toHaveBeenCalledWith('..');
  });

  it('should disable buttons when deletion is in progress', () => {
    setupDefaultMocks({ deletePending: true });

    const { getByTestId } = render(<DeletePage />);

    const submitButton = getByTestId('pciModal-button_submit');
    expect(submitButton).toBeDisabled();
  });
});
