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
import { mockedStorages } from '@/__tests__/helpers/mocks/storageContainer/storages';
import { mockedUsedNavigate } from '@/__tests__/helpers/mockRouterDomHelper';
import UsersList from './_components/UserListTable.component';
import {
  mockedCloudUser,
  mockedS3CredentialsWithoutPwd,
} from '@/__tests__/helpers/mocks/cloudUser/user';
import * as userAPI from '@/data/api/user/user.api';
import { mockedObjStoError } from '@/__tests__/helpers/apiError';

const downloadMock = vi.fn();
vi.mock('@/hooks/useDownload.hook', () => ({
  default: vi.fn(() => ({
    download: downloadMock,
  })),
}));

vi.mock('./_components/useGetUserAccess.hook', () => ({
  useGetUserAccess: vi.fn(() => ({
    isPending: false,
    access: 'mock-access-key', // ou null selon le test
  })),
}));

vi.mock('@/data/hooks/user/useGetUserS3Credentials.hook', () => ({
  useGetUserS3Credentials: vi.fn(() => ({
    data: [{ access: 'mock-access-key' }],
    isLoading: false,
    isPending: false,
    isSuccess: true,
    isError: false,
    error: null,
    refetch: vi.fn(),
    fetchStatus: 'idle',
    status: 'success',
  })),
}));

vi.mock('@/hooks/useLocale', async () => {
  const mod = await vi.importActual('@/hooks/useLocale');
  return {
    ...mod,
    useLocale: vi.fn(() => 'fr_FR'),
  };
});

vi.mock('@/data/api/storage/storages.api', () => ({
  getStorages: vi.fn(() => mockedStorages),
}));
vi.mock('@/data/api/user/user.api', () => ({
  getUsers: vi.fn(() => [mockedCloudUser]),
  getUserS3Credentials: vi.fn(() => mockedS3CredentialsWithoutPwd),
  getUserPolicy: vi.fn(() => Promise.resolve({ policy: 'mock-policy-json' })),
}));

vi.mock('../../ObjectStorage.context', () => ({
  useObjectStorageData: vi.fn(() => ({
    projectId: 'projectId',
    storages: [],
    storagesQuery: { isLoading: false },
    users: [mockedCloudUser],
  })),
}));

describe('Users List page', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockedUsedNavigate();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the UsersList table', async () => {
    render(<UsersList users={[mockedCloudUser]} />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    await waitFor(() => {
      expect(screen.getByTestId('create-user-button')).toBeTruthy();
      expect(screen.getByText(mockedCloudUser.username)).toBeTruthy();
    });
  });

  it('Check users actions button in table', async () => {
    render(<UsersList users={[mockedCloudUser]} />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    await waitFor(() => {
      expect(screen.getByText(mockedCloudUser.username)).toBeTruthy();
    });
    act(() => {
      const trigger = screen.getByTestId('users-action-trigger');
      fireEvent.focus(trigger);
      fireEvent.keyDown(trigger, {
        key: 'Enter',
        code: 'Enter',
        keyCode: 13,
        charCode: 13,
      });
    });
    await waitFor(() => {
      expect(screen.getByTestId('user-enable-s3-button')).toBeTruthy();
      expect(screen.getByTestId('user-import-user-access-button')).toBeTruthy();
      expect(
        screen.getByTestId('user-download-user-access-button'),
      ).toBeTruthy();
      expect(screen.getByTestId('user-download-rclone-button')).toBeTruthy();
      expect(screen.getByTestId('user-show-secret-key-button')).toBeTruthy();
      expect(screen.getByTestId('user-action-delete-button')).toBeTruthy();
    });
  });

  it('Check enable S3 users actions button in table', async () => {
    render(<UsersList users={[mockedCloudUser]} />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    await waitFor(() => {
      expect(screen.getByText(mockedCloudUser.username)).toBeTruthy();
    });
    act(() => {
      const trigger = screen.getByTestId('users-action-trigger');
      fireEvent.focus(trigger);
      fireEvent.keyDown(trigger, {
        key: 'Enter',
        code: 'Enter',
        keyCode: 13,
        charCode: 13,
      });
    });
    await waitFor(() => {
      expect(screen.getByTestId('user-enable-s3-button')).toBeTruthy();
      act(() => {
        fireEvent.click(screen.getByTestId('user-enable-s3-button'));
      });
    });

    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith(
        `./enable/${mockedCloudUser.id}`,
      );
    });
  });

  it('Check import users access button actions button in table', async () => {
    render(<UsersList users={[mockedCloudUser]} />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    await waitFor(() => {
      expect(screen.getByText(mockedCloudUser.username)).toBeTruthy();
    });
    act(() => {
      const trigger = screen.getByTestId('users-action-trigger');
      fireEvent.focus(trigger);
      fireEvent.keyDown(trigger, {
        key: 'Enter',
        code: 'Enter',
        keyCode: 13,
        charCode: 13,
      });
    });
    await waitFor(() => {
      expect(screen.getByTestId('user-import-user-access-button')).toBeTruthy();
      act(() => {
        fireEvent.click(screen.getByTestId('user-import-user-access-button'));
      });
    });

    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith(
        `./import-policy/${mockedCloudUser.id}`,
      );
    });
  });

  it('Check download Rclone actions button in table', async () => {
    render(<UsersList users={[mockedCloudUser]} />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    await waitFor(() => {
      expect(screen.getByText(mockedCloudUser.username)).toBeTruthy();
    });
    act(() => {
      const trigger = screen.getByTestId('users-action-trigger');
      fireEvent.focus(trigger);
      fireEvent.keyDown(trigger, {
        key: 'Enter',
        code: 'Enter',
        keyCode: 13,
        charCode: 13,
      });
    });
    await waitFor(() => {
      expect(screen.getByTestId('user-download-rclone-button')).toBeTruthy();
      act(() => {
        fireEvent.click(screen.getByTestId('user-download-rclone-button'));
      });
    });

    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith(
        `./rclone/${mockedCloudUser.id}`,
      );
    });
  });

  it('Check show secret actions button in table', async () => {
    render(<UsersList users={[mockedCloudUser]} />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    await waitFor(() => {
      expect(screen.getByText(mockedCloudUser.username)).toBeTruthy();
    });
    act(() => {
      const trigger = screen.getByTestId('users-action-trigger');
      fireEvent.focus(trigger);
      fireEvent.keyDown(trigger, {
        key: 'Enter',
        code: 'Enter',
        keyCode: 13,
        charCode: 13,
      });
    });
    await waitFor(() => {
      expect(screen.getByTestId('user-show-secret-key-button')).toBeTruthy();
      act(() => {
        fireEvent.click(screen.getByTestId('user-show-secret-key-button'));
      });
    });

    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith(
        `./user-secret/${mockedCloudUser.id}`,
      );
    });
  });

  it('Check delete user actions button in table', async () => {
    render(<UsersList users={[mockedCloudUser]} />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    await waitFor(() => {
      expect(screen.getByText(mockedCloudUser.username)).toBeTruthy();
    });
    act(() => {
      const trigger = screen.getByTestId('users-action-trigger');
      fireEvent.focus(trigger);
      fireEvent.keyDown(trigger, {
        key: 'Enter',
        code: 'Enter',
        keyCode: 13,
        charCode: 13,
      });
    });
    await waitFor(() => {
      expect(screen.getByTestId('user-action-delete-button')).toBeTruthy();
      act(() => {
        fireEvent.click(screen.getByTestId('user-action-delete-button'));
      });
    });

    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith(
        `./disable/${mockedCloudUser.id}`,
      );
    });
  });

  it('Check download user access actions button in table (error)', async () => {
    vi.mocked(userAPI.getUserPolicy).mockRejectedValueOnce(mockedObjStoError);

    render(<UsersList users={[mockedCloudUser]} />, {
      wrapper: RouterWithQueryClientWrapper,
    });

    act(() => {
      const trigger = screen.getByTestId('users-action-trigger');
      fireEvent.focus(trigger);
      fireEvent.keyDown(trigger, {
        key: 'Enter',
        code: 'Enter',
        keyCode: 13,
        charCode: 13,
      });
    });
    await waitFor(() => {
      expect(
        screen.getByTestId('user-download-user-access-button'),
      ).toBeTruthy();
      act(() => {
        fireEvent.click(screen.getByTestId('user-download-user-access-button'));
      });
    });

    await waitFor(() => {
      expect(userAPI.getUserPolicy).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'userPolicyDownloadFailed',
        variant: 'critical',
      });
    });
  });

  it('Check download user access actions button in table (success)', async () => {
    render(<UsersList users={[mockedCloudUser]} />, {
      wrapper: RouterWithQueryClientWrapper,
    });

    act(() => {
      const trigger = screen.getByTestId('users-action-trigger');
      fireEvent.focus(trigger);
      fireEvent.keyDown(trigger, {
        key: 'Enter',
        code: 'Enter',
        keyCode: 13,
        charCode: 13,
      });
    });
    await waitFor(() => {
      expect(
        screen.getByTestId('user-download-user-access-button'),
      ).toBeTruthy();
      act(() => {
        fireEvent.click(screen.getByTestId('user-download-user-access-button'));
      });
    });

    await waitFor(() => {
      expect(userAPI.getUserPolicy).toHaveBeenCalledWith({
        projectId: 'projectId',
        userId: mockedCloudUser.id,
      });
      expect(downloadMock).toHaveBeenCalledWith(
        { type: 'raw', data: 'mock-policy-json' },
        'userPolicy.json',
      );
    });
  });

  it('Click on create user button', async () => {
    render(<UsersList users={[mockedCloudUser]} />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    await waitFor(() => {
      expect(screen.getByText(mockedCloudUser.username)).toBeTruthy();
    });

    act(() => {
      fireEvent.click(screen.getByTestId('create-user-button'));
    });

    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith('./create');
    });
  });
});
