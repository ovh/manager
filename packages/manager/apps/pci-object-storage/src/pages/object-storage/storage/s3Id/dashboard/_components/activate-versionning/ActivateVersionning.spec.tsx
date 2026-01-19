import React from 'react';
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
import cloud from '@/types/Cloud';
import * as s3StorageAPI from '@/data/api/storage/s3Storage.api';
import { mockedStorageContainer } from '@/__tests__/helpers/mocks/storageContainer/storageContainer';
import { mockedObjStoError } from '@/__tests__/helpers/apiError';
import {
  mockedUsedNavigate,
  setMockedUseParams,
} from '@/__tests__/helpers/mockRouterDomHelper';
import ActivateVersionning from './ActivateVersionning.modal';

vi.mock('@/hooks/useLocale', () => ({
  useLocale: () => 'fr_FR',
}));

vi.mock('@/data/api/storage/s3Storage.api', () => ({
  getS3Storage: vi.fn(() => mockedStorageContainer),
  updateS3Storage: vi.fn(() => mockedStorageContainer),
}));

describe('ActivateVersionning.modal', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockedUsedNavigate();
    setMockedUseParams({
      projectId: 'projectId',
      region: 'BHS',
      s3Name: 'containerName',
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders Versionning modal', async () => {
    render(<ActivateVersionning />, { wrapper: RouterWithQueryClientWrapper });

    await waitFor(() => {
      expect(screen.getByTestId('activate-versionning-modal')).toBeTruthy();
      expect(
        screen.getByTestId('activate-versionning-confirm-button'),
      ).toBeTruthy();
    });
  });

  it('trigger onError on API Error', async () => {
    vi.mocked(s3StorageAPI.updateS3Storage).mockImplementation(() => {
      throw mockedObjStoError;
    });
    render(<ActivateVersionning />, { wrapper: RouterWithQueryClientWrapper });

    act(() => {
      fireEvent.click(
        screen.getByTestId('activate-versionning-confirm-button'),
      );
    });

    await waitFor(() => {
      expect(s3StorageAPI.updateS3Storage).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'toastErrorTitle',
        variant: 'critical',
        description: 'The provided data is invalid',
      });
    });
  });

  it('trigger onSuccess on confirm click', async () => {
    render(<ActivateVersionning />, { wrapper: RouterWithQueryClientWrapper });

    act(() => {
      fireEvent.click(
        screen.getByTestId('activate-versionning-confirm-button'),
      );
    });

    await waitFor(() => {
      expect(s3StorageAPI.updateS3Storage).toHaveBeenCalledWith({
        projectId: 'projectId',
        region: mockedStorageContainer.region,
        name: mockedStorageContainer.name,
        data: {
          versioning: {
            status: cloud.storage.VersioningStatusEnum.enabled,
          },
        },
      });
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'toastSuccessTitle',
        description: 'activateVersionningToastSuccessDescription',
      });
      expect(mockedUsedNavigate).toHaveBeenCalledWith('../');
    });
  });
});
