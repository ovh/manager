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
import * as s3storageAPI from '@/data/api/storage/s3Storage.api';
import { mockedCloudUser } from '@/__tests__/helpers/mocks/cloudUser/user';
import { mockedStorageContainer } from '@/__tests__/helpers/mocks/storageContainer/storageContainer';
import {
  mockedUsedNavigate,
  setMockedUseParams,
} from '@/__tests__/helpers/mockRouterDomHelper';
import AddUserS3Modal from './AddUserS3.modal';
import { mockedObjStoError } from '@/__tests__/helpers/apiError';

vi.mock(
  '@/pages/object-storage/ObjectStorage.context',
  () => ({
  useObjectStorageData: vi.fn(() => ({
    projectId: 'projectId',
    storages: [],
    storagesQuery: { isLoading: false },
    users: [mockedCloudUser],
  })),
  }),
);

vi.mock('@/data/hooks/s3-storage/useGetS3.hook', () => ({
  useGetS3: vi.fn(() => ({
    data: mockedStorageContainer,
    isLoading: false,
    isSuccess: true,
    isError: false,
    error: null,
    refetch: vi.fn(),
  })),
}));

vi.mock('@/data/api/storage/s3Storage.api', () => ({
  addS3UserPolicy: vi.fn((policy) => policy),
}));

describe('Add S3 User', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockedUsedNavigate();
    setMockedUseParams({
      projectId: 'projectId',
      storageId: 'storageId',
      region: 'region',
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders Add User S3 Modal', async () => {
    render(<AddUserS3Modal />, { wrapper: RouterWithQueryClientWrapper });
    expect(screen.getByTestId('s3-policy-modal')).toBeTruthy();
    expect(screen.getByTestId('s3-policy-submit-button')).toBeTruthy();
  });

  it('trigger onError on API Error', async () => {
    vi.mocked(s3storageAPI.addS3UserPolicy).mockImplementation(() => {
      throw mockedObjStoError;
    });
    render(<AddUserS3Modal />, { wrapper: RouterWithQueryClientWrapper });
    act(() => {
      fireEvent.click(screen.getByTestId('s3-policy-submit-button'));
    });
    await waitFor(() => {
      expect(s3storageAPI.addS3UserPolicy).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        description: 'The provided data is invalid',
        title: 'updateS3PolicyToastErrorTitle',
        variant: 'critical',
      });
    });
  });

  it('trigger onSuccess on submit click', async () => {
    render(<AddUserS3Modal />, { wrapper: RouterWithQueryClientWrapper });
    act(() => {
      fireEvent.click(screen.getByTestId('s3-policy-submit-button'));
    });
    await waitFor(() => {
      expect(s3storageAPI.addS3UserPolicy).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'updateS3PolicyToastSuccessTitle',
        description: 'updateS3PolicyToastSuccessDescription',
      });
    });
  });
});
