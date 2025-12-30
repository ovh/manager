import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import DashboardLayout, {
  Loader,
} from '@/pages/object-storage/ObjectStorage.layout';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import * as storagesAPI from '@/data/api/storage/storages.api';
import { mockedStorages } from '@/__tests__/helpers/mocks/storageContainer/storages';
import UsersList from './_components/UserListTable.component';
import {
  mockedCloudUser,
  mockedS3CredentialsWithoutPwd,
} from '@/__tests__/helpers/mocks/cloudUser/user';
import { mockManagerReactShellClient } from '@/__tests__/helpers/mockShellHelper';
import { openButtonInMenu } from '@/__tests__/helpers/unitTestHelper';
import { mockedUsedNavigate } from '@/__tests__/helpers/mockRouterDomHelper';

vi.mock('./_components/useGetUserAccess.hook', () => ({
  useGetUserAccess: vi.fn(() => ({
    isPending: false,
    access: 'mock-access-key', // ou null selon le test
  })),
}));

describe('Users List page', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockedUsedNavigate();
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
    }));

    vi.mock('../../ObjectStorage.context', () => ({
      useObjectStorageData: vi.fn(() => ({
        projectId: 'projectId',
        storages: [],
        storagesQuery: { isLoading: false },
        users: [mockedCloudUser],
      })),
    }));
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
});
