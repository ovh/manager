import { ApiError } from '@ovh-ux/manager-core-api';
import { fireEvent, render } from '@testing-library/react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TBackup } from '@/data/api/api.types';
import { useVolume } from '@/data/hooks/useVolume';
import { useBackup, useRestoreVolume } from '@/data/hooks/useVolumeBackup';
import { useNotifications } from '@/hooks/notifications/useNotifications';
import { MOCKED_VOLUME } from '@/__tests__/mocks';
import Restore from './Restore.page';

vi.mock('@/data/hooks/useVolumeBackup', () => ({
  useBackup: vi.fn(),
  useRestoreVolume: vi.fn(),
}));

vi.mock('@/data/hooks/useVolume', () => ({
  useVolume: vi.fn(),
}));

vi.mock('@/hooks/notifications/useNotifications', () => ({
  useNotifications: vi.fn(),
}));

vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
  useParams: vi.fn(),
  useSearchParams: vi.fn(),
}));

describe('RestoreVolume Page', () => {
  const addSuccessMessage = vi.fn();
  const addErrorMessage = vi.fn();
  const mockNavigate = vi.fn();
  const mockBackupData = { id: 'backup-id', name: 'TestBackup' } as TBackup;
  const mockedRestoreVolume = vi.fn();

  // Setup default mocks for each test
  const setupDefaultMocks = ({
    backupLoading = false,
    volumeLoading = false,
    restorePending = false,
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
      { get: () => 'volume-id' },
    ] as unknown) as ReturnType<typeof useSearchParams>);

    vi.mocked(useBackup).mockReturnValue({
      data: withData ? mockBackupData : undefined,
      isLoading: backupLoading,
      error: null,
    });

    vi.mocked(useVolume).mockReturnValue({
      data: withData ? MOCKED_VOLUME : undefined,
      isLoading: volumeLoading,
    } as ReturnType<typeof useVolume>);

    vi.mocked(useRestoreVolume).mockReturnValue(({
      restoreVolume: mockedRestoreVolume,
      isPending: restorePending,
    } as unknown) as ReturnType<typeof useRestoreVolume>);
  };

  beforeEach(() => {
    setupDefaultMocks();
  });

  it('should render loading state when the backup is loading', () => {
    setupDefaultMocks({ backupLoading: true });

    const { getByTestId } = render(<Restore />);

    const spinner = getByTestId('pciModal-spinner');
    const submitButton = getByTestId('pciModal-button_submit');

    expect(spinner).toBeVisible();
    expect(submitButton.getAttribute('is-disabled')).toBe('true');
  });

  it('should render loading state when the volume is loading', () => {
    setupDefaultMocks({ volumeLoading: true });

    const { getByTestId } = render(<Restore />);

    const spinner = getByTestId('pciModal-spinner');
    const submitButton = getByTestId('pciModal-button_submit');

    expect(spinner).toBeVisible();
    expect(submitButton.getAttribute('is-disabled')).toBe('true');
  });

  it('should navigate back when cancel button is clicked', () => {
    const { getByTestId } = render(<Restore />);

    const cancelButton = getByTestId('pciModal-button_cancel');
    fireEvent.click(cancelButton);

    expect(mockNavigate).toHaveBeenCalledWith('..');
  });

  it('should call restoreVolume when confirm button is clicked', async () => {
    setupDefaultMocks({ withData: true });

    const { getByTestId } = render(<Restore />);

    const confirmButton = getByTestId('pciModal-button_submit');
    fireEvent.click(confirmButton);

    expect(mockedRestoreVolume).toHaveBeenCalledWith({
      volumeId: MOCKED_VOLUME.id,
      backupId: mockBackupData.id,
    });
  });

  it('should show success notification and navigate back on successful restoration', async () => {
    let successCallback: (() => void) | undefined;

    setupDefaultMocks({ withData: true });

    // Override the restore mock to capture the success callback
    vi.mocked(useRestoreVolume).mockImplementation(({ onSuccess }) => {
      successCallback = onSuccess;
      return ({
        restoreVolume: mockedRestoreVolume,
        isPending: false,
      } as unknown) as ReturnType<typeof useRestoreVolume>;
    });

    const { getByTestId } = render(<Restore />);

    const confirmButton = getByTestId('pciModal-button_submit');
    fireEvent.click(confirmButton);

    expect(mockedRestoreVolume).toHaveBeenCalledWith({
      volumeId: MOCKED_VOLUME.id,
      backupId: mockBackupData.id,
    });

    // Call the success callback manually
    if (successCallback) {
      successCallback();
    }

    expect(addSuccessMessage).toHaveBeenCalledWith({
      i18nKey:
        'pci_projects_project_storages_volume_backup_list_restore_volume_action_request_success',
      values: {
        volumeName: `<strong>${MOCKED_VOLUME.name}</strong>`,
      },
    });
    expect(mockNavigate).toHaveBeenCalledWith('..');
  });

  it('should show error notification and navigate back on restoration failure', () => {
    let errorCallback: ((error: ApiError) => void) | undefined;
    const mockError = new Error('Restoration failed') as ApiError;

    setupDefaultMocks({ withData: true });

    // Override the restore mock to capture the error callback
    vi.mocked(useRestoreVolume).mockImplementation(({ onError }) => {
      errorCallback = onError;
      return ({
        restoreVolume: mockedRestoreVolume,
        isPending: false,
      } as unknown) as ReturnType<typeof useRestoreVolume>;
    });

    const { getByTestId } = render(<Restore />);

    const confirmButton = getByTestId('pciModal-button_submit');
    fireEvent.click(confirmButton);

    expect(mockedRestoreVolume).toHaveBeenCalledWith({
      volumeId: MOCKED_VOLUME.id,
      backupId: mockBackupData.id,
    });

    // Call the error callback manually
    if (errorCallback) {
      errorCallback(mockError);
    }

    expect(addErrorMessage).toHaveBeenCalledWith({
      i18nKey:
        'pci_projects_project_storages_volume_backup_list_restore_volume_action_request_error',
      error: mockError,
      values: {
        volumeName: `<strong>${MOCKED_VOLUME.name}</strong>`,
      },
    });
    expect(mockNavigate).toHaveBeenCalledWith('..');
  });

  it('should disable buttons when restoration is in progress', () => {
    setupDefaultMocks({ restorePending: true });

    const { getByTestId } = render(<Restore />);

    const submitButton = getByTestId('pciModal-button_submit');
    expect(submitButton.getAttribute('is-disabled')).toBe('true');
  });
});
