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
import { mockedPresignUrl } from '@/__tests__/helpers/mocks/storageContainer/presignUrl';
import {
  mockedUsedNavigate,
  setMockedUseParams,
} from '@/__tests__/helpers/mockRouterDomHelper';
import { mockedObjStoError } from '@/__tests__/helpers/apiError';
import { getObjectStoreApiErrorMessage } from '@/lib/apiHelper';
import AddObjectModal from './Add.modal';

vi.mock('@/pages/object-storage/storage/s3Id/S3.context', () => ({
  useS3Data: vi.fn(() => ({
    projectId: 'projectId',
    s3: mockedStorageContainer,
    s3Query: { isLoading: false },
  })),
}));

vi.mock('@/hooks/useAvailableStorageClasses.hook', () => ({
  useAvailableStorageClasses: vi.fn(() => ({
    availableStorageClasses: ['STANDARD', 'STANDARD_IA', 'HIGH_PERF'],
    isPending: false,
  })),
}));

vi.mock('@/data/api/storage/s3Storage.api', () => ({
  getPresignUrlS3: vi.fn(() => mockedPresignUrl),
  addS3Object: vi.fn(),
}));

describe('Add S3 Object', () => {
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

  it('renders Add Object Modal', async () => {
    render(<AddObjectModal />, { wrapper: RouterWithQueryClientWrapper });
    expect(screen.getByTestId('add-object-modal')).toBeTruthy();
    expect(screen.getByTestId('add-object-submit-button')).toBeTruthy();
  });

  it('trigger onError on presign API Error', async () => {
    vi.mocked(s3StorageAPI.getPresignUrlS3).mockImplementation(() => {
      throw mockedObjStoError;
    });

    render(<AddObjectModal />, { wrapper: RouterWithQueryClientWrapper });

    // Create a mock file
    const file = new File(['test content'], 'test.txt', { type: 'text/plain' });

    // Find the file input and upload file
    const fileInput = screen.getByTestId('file-input');
    act(() => {
      fireEvent.change(fileInput, { target: { files: [file] } });
    });

    await waitFor(() => {
      expect(screen.getByText('test.txt')).toBeTruthy();
    });

    act(() => {
      fireEvent.click(screen.getByTestId('add-object-submit-button'));
    });

    await waitFor(() => {
      expect(s3StorageAPI.getPresignUrlS3).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'objectToastErrorTitle',
        description: getObjectStoreApiErrorMessage(mockedObjStoError),
        variant: 'critical',
      });
    });
  });

  it('trigger onError on upload API Error', async () => {
    vi.mocked(s3StorageAPI.addS3Object).mockImplementation(() => {
      throw mockedObjStoError;
    });

    render(<AddObjectModal />, { wrapper: RouterWithQueryClientWrapper });

    // Create a mock file
    const file = new File(['test content'], 'test.txt', { type: 'text/plain' });

    // Find the file input and upload file
    const fileInput = screen.getByTestId('file-input');
    act(() => {
      fireEvent.change(fileInput, { target: { files: [file] } });
    });

    await waitFor(() => {
      expect(screen.getByText('test.txt')).toBeTruthy();
    });

    act(() => {
      fireEvent.click(screen.getByTestId('add-object-submit-button'));
    });

    await waitFor(() => {
      expect(s3StorageAPI.getPresignUrlS3).toHaveBeenCalled();
      expect(s3StorageAPI.addS3Object).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'objectToastErrorTitle',
        description: getObjectStoreApiErrorMessage(mockedObjStoError),
        variant: 'critical',
      });
    });
  });

  it('trigger onSuccess on submit click', async () => {
    render(<AddObjectModal />, { wrapper: RouterWithQueryClientWrapper });

    // Create a mock file
    const file = new File(['test content'], 'test.txt', { type: 'text/plain' });

    // Find the file input and upload file
    const fileInput = screen.getByTestId('file-input');
    act(() => {
      fireEvent.change(fileInput, { target: { files: [file] } });
    });

    await waitFor(() => {
      expect(screen.getByText('test.txt')).toBeTruthy();
    });

    act(() => {
      fireEvent.click(screen.getByTestId('add-object-submit-button'));
    });

    await waitFor(() => {
      expect(s3StorageAPI.getPresignUrlS3).toHaveBeenCalled();
      expect(s3StorageAPI.addS3Object).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'objectToastSuccessTitle',
        description: 'addObjectToastSuccessDescription',
      });
    });
  });
});
