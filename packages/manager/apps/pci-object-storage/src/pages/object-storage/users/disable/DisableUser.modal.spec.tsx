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
import * as usersAPI from '@/data/api/user/user.api';
import {
  mockedCloudUser,
  mockedS3CredentialsWithoutPwd,
} from '@/__tests__/helpers/mocks/cloudUser/user';
import { mockedObjStoError } from '@/__tests__/helpers/apiError';
import {
  mockedUsedNavigate,
  setMockedUseParams,
} from '@/__tests__/helpers/mockRouterDomHelper';
import DeleteUser from './DisableUser.modal';

vi.mock('@/pages/object-storage/ObjectStorage.context', () => ({
  useObjectStorageData: vi.fn(() => ({
    projectId: 'projectId',
    storages: [],
    storagesQuery: { isLoading: false },
    users: [mockedCloudUser],
  })),
}));

vi.mock('@/data/api/user/user.api', () => ({
  deleteS3Credentials: vi.fn(),
  getUserS3Credentials: vi.fn(() => [mockedS3CredentialsWithoutPwd]),
}));

describe('Delete User', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockedUsedNavigate();
    setMockedUseParams({ projectId: 'projectId', userId: '12' });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders Delete User Modal', async () => {
    render(<DeleteUser />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByTestId('delete-user-modal')).toBeTruthy();
      expect(screen.getByTestId('delete-user-submit-button')).toBeTruthy();
    });
  });

  it('trigger onError on API Error', async () => {
    vi.mocked(usersAPI.deleteS3Credentials).mockImplementation(() => {
      throw mockedObjStoError;
    });

    render(<DeleteUser />, { wrapper: RouterWithQueryClientWrapper });

    act(() => {
      fireEvent.click(screen.getByTestId('delete-user-submit-button'));
    });

    await waitFor(() => {
      expect(usersAPI.deleteS3Credentials).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        description: 'The provided data is invalid',
        title: 'deleteUserToastErrorTitle',
        variant: 'critical',
      });
    });
  });

  it('trigger onSuccess on submit click', async () => {
    render(<DeleteUser />, { wrapper: RouterWithQueryClientWrapper });

    act(() => {
      fireEvent.click(screen.getByTestId('delete-user-submit-button'));
    });

    await waitFor(() => {
      expect(usersAPI.deleteS3Credentials).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'deleteUserToastSuccessTitle',
        description: 'deleteUserToastSuccessDescription',
      });
    });
  });
});
