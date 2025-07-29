import { ApiError } from '@ovh-ux/manager-core-api';
import { TInstance, TVolume, useInstance } from '@ovh-ux/manager-pci-common';
import { UseQueryResult } from '@tanstack/react-query';
import { fireEvent, render } from '@testing-library/react';
import { useNavigate, useParams } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MOCKED_VOLUME } from '@/__tests__/mocks';
import { useNotifications } from '@/hooks/notifications/useNotifications';
import { useDetachVolume, useVolume } from '@/data/hooks/useVolume';
import DetachVolume from './DetachVolume.page';

vi.mock('@ovh-ux/manager-pci-common', async () => {
  const mod = await vi.importActual('@ovh-ux/manager-pci-common');
  return {
    ...mod,
    useInstance: vi.fn(),
  };
});

vi.mock('@/data/hooks/useVolume', () => ({
  useVolume: vi.fn(),
  useDetachVolume: vi.fn(),
}));

vi.mock('@/hooks/notifications/useNotifications', () => ({
  useNotifications: vi.fn(),
}));

vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
  useParams: vi.fn(),
  useSearchParams: () => [
    new URLSearchParams({ volumeId: 'volume-id', instanceId: 'instance-id' }),
  ],
}));

describe('DetachVolume Page', () => {
  const addSuccessMessage = vi.fn();
  const addErrorMessage = vi.fn();
  const mockNavigate = vi.fn();
  const mockInstance = { id: 'instance-id', name: 'TestInstance' } as TInstance;
  const mockedDetachVolume = vi.fn();

  const setupDefaultMocks = ({
    instanceLoading = false,
    volumeLoading = false,
    detachPending = false,
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
      volumeId: 'volume-id',
    });

    vi.mocked(useInstance).mockReturnValue({
      data: withData ? mockInstance : undefined,
      isLoading: instanceLoading,
      error: null,
    } as UseQueryResult<TInstance, Error>);

    vi.mocked(useVolume).mockReturnValue({
      data: withData ? MOCKED_VOLUME : undefined,
      isLoading: volumeLoading,
    } as ReturnType<typeof useVolume>);

    vi.mocked(useDetachVolume).mockReturnValue(({
      detachVolume: mockedDetachVolume,
      isPending: detachPending,
    } as unknown) as ReturnType<typeof useDetachVolume>);
  };

  beforeEach(() => {
    setupDefaultMocks();
  });

  it('should render loading state when the instance is loading', () => {
    setupDefaultMocks({ instanceLoading: true });

    const { getByTestId } = render(<DetachVolume />);

    const spinner = getByTestId('pciModal-spinner');
    const submitButton = getByTestId('pciModal-button_submit');

    expect(spinner).toBeVisible();
    expect(submitButton).toBeDisabled();
  });

  it('should render loading state when the volume is loading', () => {
    setupDefaultMocks({ volumeLoading: true });

    const { getByTestId } = render(<DetachVolume />);

    const spinner = getByTestId('pciModal-spinner');
    const submitButton = getByTestId('pciModal-button_submit');

    expect(spinner).toBeVisible();
    expect(submitButton).toBeDisabled();
  });

  it('should navigate back when cancel button is clicked', () => {
    const { getByTestId } = render(<DetachVolume />);

    const cancelButton = getByTestId('pciModal-button_cancel');
    fireEvent.click(cancelButton);

    expect(mockNavigate).toHaveBeenCalledWith('..');
  });

  it('should show success notification and navigate back on successful restoration', async () => {
    let successCallback: ((volume: TVolume) => void) | undefined;

    setupDefaultMocks({ withData: true });

    vi.mocked(useDetachVolume).mockImplementation(({ onSuccess }) => {
      successCallback = onSuccess;
      return ({
        detachVolume: mockedDetachVolume,
        isPending: false,
      } as unknown) as ReturnType<typeof useDetachVolume>;
    });

    const { getByTestId } = render(<DetachVolume />);

    const confirmButton = getByTestId('pciModal-button_submit');
    fireEvent.click(confirmButton);

    expect(mockedDetachVolume).toHaveBeenCalled();

    if (successCallback) {
      successCallback(MOCKED_VOLUME);
    }

    expect(addSuccessMessage).toHaveBeenCalledWith({
      i18nKey:
        'pci_projects_project_storages_volume_backup_create_detach_volume_action_success',
      values: {
        instanceName: 'TestInstance',
        volumeName: 'volume-name',
      },
    });
    expect(mockNavigate).toHaveBeenCalledWith('..');
  });

  it('should show error notification and navigate back on detach failure', () => {
    let errorCallback: ((error: ApiError) => void) | undefined;
    const mockError = new Error('Detach failed') as ApiError;

    setupDefaultMocks({ withData: true });

    vi.mocked(useDetachVolume).mockImplementation(({ onError }) => {
      errorCallback = onError;
      return ({
        detachVolume: mockedDetachVolume,
        isPending: false,
      } as unknown) as ReturnType<typeof useDetachVolume>;
    });

    const { getByTestId } = render(<DetachVolume />);

    const confirmButton = getByTestId('pciModal-button_submit');
    fireEvent.click(confirmButton);

    expect(mockedDetachVolume).toHaveBeenCalled();

    if (errorCallback) {
      errorCallback(mockError);
    }

    expect(addErrorMessage).toHaveBeenCalledWith({
      i18nKey:
        'pci_projects_project_storages_volume_backup_create_detach_volume_action_fail',
      error: mockError,
    });
    expect(mockNavigate).toHaveBeenCalledWith('..');
  });

  it('should disable buttons when restoration is in progress', () => {
    setupDefaultMocks({ detachPending: true });

    const { getByTestId } = render(<DetachVolume />);

    const submitButton = getByTestId('pciModal-button_submit');
    expect(submitButton).toBeDisabled();
  });
});
