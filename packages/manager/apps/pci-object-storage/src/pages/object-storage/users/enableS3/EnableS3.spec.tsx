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
import {
  mockedCloudUser,
  mockedS3Credentials,
} from '@/__tests__/helpers/mocks/cloudUser/user';
import { mockedObjStoError } from '@/__tests__/helpers/apiError';
import {
  mockedUsedNavigate,
  setMockedUseParams,
} from '@/__tests__/helpers/mockRouterDomHelper';
import EnableUser from './EnableS3.modal';
import * as userAPI from '@/data/api/user/user.api';

vi.mock('@/pages/object-storage/ObjectStorage.context', () => ({
  useObjectStorageData: vi.fn(() => ({
    projectId: 'projectId',
    storages: [],
    storagesQuery: { isLoading: false },
    users: [mockedCloudUser],
  })),
}));

vi.mock('@/data/api/user/user.api', () => ({
  addS3Credentials: vi.fn(() => mockedS3Credentials),
}));

describe('Enable S3 User', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockedUsedNavigate();
    setMockedUseParams({
      projectId: 'projectId',
      userId: String(mockedCloudUser.id),
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders Enable S3 Modal', async () => {
    render(<EnableUser />, { wrapper: RouterWithQueryClientWrapper });
    expect(screen.getByTestId('enable-user-s3-modal')).toBeTruthy();
    expect(screen.getByTestId('enable-s3-submit-button')).toBeTruthy();
  });

  it('trigger onError on API Error', async () => {
    vi.mocked(userAPI.addS3Credentials).mockImplementation(() => {
      throw mockedObjStoError;
    });
    render(<EnableUser />, { wrapper: RouterWithQueryClientWrapper });

    act(() => {
      fireEvent.click(screen.getByTestId('enable-s3-submit-button'));
    });

    await waitFor(() => {
      expect(userAPI.addS3Credentials).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'enableUserToastErrorTitle',
        variant: 'critical',
        description: 'The provided data is invalid',
      });
    });
  });

  it('trigger onSuccess on submit click and close modal', async () => {
    render(<EnableUser />, { wrapper: RouterWithQueryClientWrapper });
    act(() => {
      fireEvent.click(screen.getByTestId('enable-s3-submit-button'));
    });

    await waitFor(() => {
      expect(userAPI.addS3Credentials).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'enableUserToastSuccessTitle',
        description: 'enableUserToastSuccessDescription',
      });
      expect(screen.getByTestId('enable-user-close-button')).toBeTruthy();
      expect(screen.getByText(mockedS3Credentials.access)).toBeTruthy();
    });

    act(() => {
      fireEvent.click(screen.getByTestId('enable-user-close-button'));
    });

    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalled();
      expect(screen.queryByTestId('enable-user-s3-modal')).toBeFalsy();
    });
  });
});
