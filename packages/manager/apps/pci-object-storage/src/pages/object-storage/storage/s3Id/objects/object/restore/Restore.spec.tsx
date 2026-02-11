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
import * as s3StorageAPI from '@/data/api/storage/s3Storage.api';
import { mockedStorageContainer } from '@/__tests__/helpers/mocks/storageContainer/storageContainer';
import { mockedS3Object } from '@/__tests__/helpers/mocks/s3/object';
import {
  mockedUsedNavigate,
  setMockedUseParams,
  setMockedSearchParams,
} from '@/__tests__/helpers/mockRouterDomHelper';
import { mockedObjStoError } from '@/__tests__/helpers/apiError';
import { getObjectStoreApiErrorMessage } from '@/lib/apiHelper';
import cloud from '@/types/Cloud';
import RestoreModal from './Restore.modal';

const mockedS3ObjectWithRestore: cloud.StorageObject = {
  ...mockedS3Object,
  restoreStatus: {
    inProgress: false,
    expireDate: '2026-02-20T00:00:00Z',
  },
};

vi.mock('@/hooks/useLocale', () => ({
  useLocale: vi.fn(() => 'fr_FR'),
}));

vi.mock('@/pages/object-storage/storage/s3Id/S3.context', () => ({
  useS3Data: vi.fn(() => ({
    projectId: 'projectId',
    s3: mockedStorageContainer,
    s3Query: { isLoading: false },
  })),
}));

vi.mock('@/data/api/storage/s3Storage.api', () => ({
  getS3Object: vi.fn(() => mockedS3Object),
  restoreS3Object: vi.fn(),
}));

describe('Restore S3 Object', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockedUsedNavigate();
    setMockedUseParams({
      projectId: 'projectId',
      region: 'BHS',
      s3Name: 'containerName',
    });
    setMockedSearchParams({
      objectKey: 'objectKey',
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders Restore Object Modal', async () => {
    render(<RestoreModal />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByTestId('restore-object-modal')).toBeTruthy();
      expect(screen.getByTestId('restore-object-submit-button')).toBeTruthy();
    });
  });

  it('trigger onError on API Error', async () => {
    vi.mocked(s3StorageAPI.restoreS3Object).mockImplementation(() => {
      throw mockedObjStoError;
    });
    render(<RestoreModal />, { wrapper: RouterWithQueryClientWrapper });

    await waitFor(() => {
      expect(screen.getByTestId('restore-object-modal')).toBeTruthy();
    });

    // Fill days input (default is 7)
    const daysInput = screen.getByPlaceholderText('1');
    act(() => {
      fireEvent.change(daysInput, { target: { value: '10' } });
    });

    act(() => {
      fireEvent.click(screen.getByTestId('restore-object-submit-button'));
    });

    await waitFor(() => {
      expect(s3StorageAPI.restoreS3Object).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'objectToastErrorTitle',
        description: getObjectStoreApiErrorMessage(mockedObjStoError),
        variant: 'critical',
      });
    });
  });

  it('trigger onSuccess on submit click', async () => {
    render(<RestoreModal />, { wrapper: RouterWithQueryClientWrapper });

    await waitFor(() => {
      expect(screen.getByTestId('restore-object-modal')).toBeTruthy();
    });

    // Fill days input
    const daysInput = screen.getByPlaceholderText('1');
    act(() => {
      fireEvent.change(daysInput, { target: { value: '10' } });
    });

    act(() => {
      fireEvent.click(screen.getByTestId('restore-object-submit-button'));
    });

    await waitFor(() => {
      expect(s3StorageAPI.restoreS3Object).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'objectToastSuccessTitle',
        description: 'restoreObjectToastSuccessDescription',
      });
    });
  });

  describe('when extending restore', () => {
    beforeEach(() => {
      vi.mocked(s3StorageAPI.getS3Object).mockResolvedValue(
        mockedS3ObjectWithRestore,
      );
    });

    it('renders alert with current expire date', async () => {
      render(<RestoreModal />, { wrapper: RouterWithQueryClientWrapper });

      await waitFor(() => {
        expect(screen.getByTestId('restore-object-modal')).toBeTruthy();
        expect(screen.getByRole('alert')).toBeTruthy();
      });
    });

    it('trigger onError on API Error when extending', async () => {
      vi.mocked(s3StorageAPI.restoreS3Object).mockImplementation(() => {
        throw mockedObjStoError;
      });
      render(<RestoreModal />, { wrapper: RouterWithQueryClientWrapper });

      await waitFor(() => {
        expect(screen.getByTestId('restore-object-modal')).toBeTruthy();
      });

      // The minimum days will be calculated based on expireDate
      const daysInput = screen.getByRole('spinbutton');
      act(() => {
        fireEvent.change(daysInput, { target: { value: '15' } });
      });

      act(() => {
        fireEvent.click(screen.getByTestId('restore-object-submit-button'));
      });

      await waitFor(() => {
        expect(s3StorageAPI.restoreS3Object).toHaveBeenCalled();
        expect(useToast().toast).toHaveBeenCalledWith({
          title: 'objectToastErrorTitle',
          description: getObjectStoreApiErrorMessage(mockedObjStoError),
          variant: 'critical',
        });
      });
    });

    it('trigger onSuccess when extending restore', async () => {
      render(<RestoreModal />, { wrapper: RouterWithQueryClientWrapper });

      await waitFor(() => {
        expect(screen.getByTestId('restore-object-modal')).toBeTruthy();
      });

      // Fill days input
      const daysInput = screen.getByRole('spinbutton');
      act(() => {
        fireEvent.change(daysInput, { target: { value: '15' } });
      });

      act(() => {
        fireEvent.click(screen.getByTestId('restore-object-submit-button'));
      });

      await waitFor(() => {
        expect(s3StorageAPI.restoreS3Object).toHaveBeenCalled();
        expect(useToast().toast).toHaveBeenCalledWith({
          title: 'objectToastSuccessTitle',
          description: 'extendRestoreObjectToastSuccessDescription',
        });
      });
    });
  });
});
