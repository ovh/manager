import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { EncryptionAlgorithmEnum } from '@datatr-ux/ovhcloud-types/cloud/storage';
import { useToast } from '@datatr-ux/uxlib';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import {
  mockedUsedNavigate,
  setMockedUseParams,
} from '@/__tests__/helpers/mockRouterDomHelper';
import ActivateEncryption from './ActivateEncryption.modal';
import * as s3StorageAPI from '@/data/api/storage/s3Storage.api';
import { mockedStorageContainer } from '@/__tests__/helpers/mocks/storageContainer/storageContainer';
import { mockedObjStoError } from '@/__tests__/helpers/apiError';

vi.mock('@/hooks/useLocale', () => ({
  useLocale: () => 'fr_FR',
}));

vi.mock('@/data/api/storage/s3Storage.api', () => ({
  getS3Storage: vi.fn(() => mockedStorageContainer),
  updateS3Storage: vi.fn(() => mockedStorageContainer),
}));

describe('ActivateEncryption.modal', () => {
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

  it('renders modal', async () => {
    render(<ActivateEncryption />, { wrapper: RouterWithQueryClientWrapper });

    await waitFor(() => {
      expect(screen.getByTestId('activate-encryption-modal')).toBeTruthy();
      expect(
        screen.getByTestId('activate-encryption-confirm-button'),
      ).toBeTruthy();
    });
  });

  it('trigger onError on API Error', async () => {
    vi.mocked(s3StorageAPI.updateS3Storage).mockImplementation(() => {
      throw mockedObjStoError;
    });
    render(<ActivateEncryption />, { wrapper: RouterWithQueryClientWrapper });

    act(() => {
      fireEvent.click(screen.getByTestId('activate-encryption-confirm-button'));
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
    render(<ActivateEncryption />, { wrapper: RouterWithQueryClientWrapper });

    act(() => {
      fireEvent.click(screen.getByTestId('activate-encryption-confirm-button'));
    });

    await waitFor(() => {
      expect(s3StorageAPI.updateS3Storage).toHaveBeenCalledWith({
        projectId: 'projectId',
        region: mockedStorageContainer.region,
        name: mockedStorageContainer.name,
        data: {
          encryption: {
            sseAlgorithm: EncryptionAlgorithmEnum.AES256,
          },
        },
      });
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'toastSuccessTitle',
        description: 'activateEncryptionToastSuccessDescription',
      });
      expect(mockedUsedNavigate).toHaveBeenCalledWith('../');
    });
  });
});
