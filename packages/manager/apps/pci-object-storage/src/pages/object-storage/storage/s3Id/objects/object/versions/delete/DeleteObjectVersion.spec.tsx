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
import { PERMANENT_DELETE_CONFIRMATION } from '@/configuration/polling.constants';
import cloud from '@/types/Cloud';
import DeleteObjectVersionModal from './DeleteObjectVersion.modal';

const mockedS3ObjectVersion: cloud.StorageObject = {
  ...mockedS3Object,
  versionId: 'version123',
};

vi.mock('@/pages/object-storage/storage/s3Id/S3.context', () => ({
  useS3Data: vi.fn(() => ({
    projectId: 'projectId',
    s3: mockedStorageContainer,
    s3Query: { isLoading: false },
  })),
}));

vi.mock('@/data/api/storage/s3Storage.api', () => ({
  getS3ObjectVersion: vi.fn(() => mockedS3ObjectVersion),
  deleteS3ObjectVersion: vi.fn(),
}));

describe('Delete S3 Object Version', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockedUsedNavigate();
    setMockedUseParams({
      projectId: 'projectId',
      region: 'BHS',
      s3Name: 'containerName',
      versionId: 'version123',
    });
    setMockedSearchParams({
      objectKey: 'objectKey',
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders Delete Object Version Modal', async () => {
    render(<DeleteObjectVersionModal />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    await waitFor(() => {
      expect(screen.getByTestId('delete-object-version-modal')).toBeTruthy();
      expect(
        screen.getByTestId('delete-object-version-confirmation-input'),
      ).toBeTruthy();
      expect(
        screen.getByTestId('delete-object-version-submit-button'),
      ).toBeTruthy();
    });
  });

  it('trigger onError on API Error', async () => {
    vi.mocked(s3StorageAPI.deleteS3ObjectVersion).mockImplementation(() => {
      throw mockedObjStoError;
    });
    render(<DeleteObjectVersionModal />, {
      wrapper: RouterWithQueryClientWrapper,
    });

    await waitFor(() => {
      expect(screen.getByTestId('delete-object-version-modal')).toBeTruthy();
    });

    const confirmationInput = screen.getByTestId(
      'delete-object-version-confirmation-input',
    );
    act(() => {
      fireEvent.change(confirmationInput, {
        target: { value: PERMANENT_DELETE_CONFIRMATION },
      });
    });

    act(() => {
      fireEvent.click(
        screen.getByTestId('delete-object-version-submit-button'),
      );
    });

    await waitFor(() => {
      expect(s3StorageAPI.deleteS3ObjectVersion).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'objectVersionToastErrorTitle',
        description: getObjectStoreApiErrorMessage(mockedObjStoError),
        variant: 'critical',
      });
    });
  });

  it('trigger onSuccess on submit click', async () => {
    render(<DeleteObjectVersionModal />, {
      wrapper: RouterWithQueryClientWrapper,
    });

    await waitFor(() => {
      expect(screen.getByTestId('delete-object-version-modal')).toBeTruthy();
    });

    const confirmationInput = screen.getByTestId(
      'delete-object-version-confirmation-input',
    );
    act(() => {
      fireEvent.change(confirmationInput, {
        target: { value: PERMANENT_DELETE_CONFIRMATION },
      });
    });

    act(() => {
      fireEvent.click(
        screen.getByTestId('delete-object-version-submit-button'),
      );
    });

    await waitFor(() => {
      expect(s3StorageAPI.deleteS3ObjectVersion).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'objectVersionToastSuccessTitle',
        description: 'deleteObjectVersionToastSuccessDescription',
      });
    });
  });
});
