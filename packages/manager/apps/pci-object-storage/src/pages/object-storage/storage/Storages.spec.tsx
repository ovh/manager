import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import {
  mockedFormattedStorage,
  mockedStorages,
} from '@/__tests__/helpers/mocks/storageContainer/storages';
import {
  mockedCloudUser,
  mockedS3CredentialsWithoutPwd,
} from '@/__tests__/helpers/mocks/cloudUser/user';
import { openButtonInMenu } from '@/__tests__/helpers/unitTestHelper';
import { mockedUsedNavigate } from '@/__tests__/helpers/mockRouterDomHelper';
import StoragesList from './_components/StorageListTable.component';
import { FormattedStorage, ObjectStorageTypeEnum } from '@/types/Storages';

const mockedSwitftStorage: FormattedStorage = {
  ...mockedFormattedStorage,
  storageType: ObjectStorageTypeEnum.swift,
};

describe('Storage List page', () => {
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
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the StoragesList table', async () => {
    render(<StoragesList storages={[mockedFormattedStorage]} />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    await waitFor(() => {
      expect(screen.getByTestId('create-storage-button')).toBeTruthy();
      expect(screen.getByText(mockedFormattedStorage.name)).toBeTruthy();
    });
  });

  it('Check S3 actions button in table', async () => {
    render(<StoragesList storages={[mockedFormattedStorage]} />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    await waitFor(() => {
      expect(screen.getByText(mockedFormattedStorage.name)).toBeTruthy();
    });

    act(() => {
      const trigger = screen.getByTestId('storages-action-trigger');
      fireEvent.focus(trigger);
      fireEvent.keyDown(trigger, {
        key: 'Enter',
        code: 'Enter',
        keyCode: 13,
        charCode: 13,
      });
    });
    await waitFor(() => {
      expect(screen.getByTestId('storage-action-manage-button')).toBeTruthy();
      expect(screen.getByTestId('storage-action-add-user-button')).toBeTruthy();
      expect(screen.getByTestId('storage-action-delete-button')).toBeTruthy();
      expect(screen.queryByTestId('storage-action-switch-button')).toBeFalsy();
    });
  });

  it('Check Swift actions button in table', async () => {
    render(<StoragesList storages={[mockedSwitftStorage]} />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    await waitFor(() => {
      expect(screen.getByText(mockedSwitftStorage.name)).toBeTruthy();
    });
    act(() => {
      const trigger = screen.getByTestId('storages-action-trigger');
      fireEvent.focus(trigger);
      fireEvent.keyDown(trigger, {
        key: 'Enter',
        code: 'Enter',
        keyCode: 13,
        charCode: 13,
      });
    });
    await waitFor(() => {
      expect(screen.getByTestId('storage-action-manage-button')).toBeTruthy();
      expect(
        screen.queryByTestId('storage-action-add-user-button'),
      ).toBeFalsy();
      expect(screen.getByTestId('storage-action-delete-button')).toBeTruthy();
      expect(screen.getByTestId('storage-action-switch-button')).toBeTruthy();
    });
  });

  it('navigate to S3 dashboard from action table button', async () => {
    render(<StoragesList storages={[mockedFormattedStorage]} />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    await waitFor(() => {
      expect(screen.getByText(mockedFormattedStorage.name)).toBeTruthy();
    });
    await openButtonInMenu(
      'storages-action-trigger',
      'storage-action-manage-button',
    );
    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith(
        `./s3/${mockedFormattedStorage.region}/${mockedFormattedStorage.name}`,
      );
    });
  });

  it('navigate to Swift dashboard from action table button', async () => {
    render(<StoragesList storages={[mockedSwitftStorage]} />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    await waitFor(() => {
      expect(screen.getByText(mockedSwitftStorage.name)).toBeTruthy();
    });
    await openButtonInMenu(
      'storages-action-trigger',
      'storage-action-manage-button',
    );
    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith(
        `./swift/${mockedSwitftStorage.id}`,
      );
    });
  });

  it('navigate to Switch Type Swift modal from action table button', async () => {
    render(<StoragesList storages={[mockedSwitftStorage]} />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    await waitFor(() => {
      expect(screen.getByText(mockedSwitftStorage.name)).toBeTruthy();
    });
    await openButtonInMenu(
      'storages-action-trigger',
      'storage-action-switch-button',
    );
    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith(
        `./switch-type/${mockedSwitftStorage.id}`,
      );
    });
  });

  it('navigate to add S3 User modal from action table button', async () => {
    render(<StoragesList storages={[mockedFormattedStorage]} />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    await waitFor(() => {
      expect(screen.getByText(mockedFormattedStorage.name)).toBeTruthy();
    });
    await openButtonInMenu(
      'storages-action-trigger',
      'storage-action-add-user-button',
    );
    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith(
        `./add-s3-user/s3/${mockedFormattedStorage.name}/${mockedFormattedStorage.region}`,
      );
    });
  });

  it('navigate to Delete S3 modal from action table button', async () => {
    render(<StoragesList storages={[mockedFormattedStorage]} />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    await waitFor(() => {
      expect(screen.getByText(mockedFormattedStorage.name)).toBeTruthy();
    });
    await openButtonInMenu(
      'storages-action-trigger',
      'storage-action-delete-button',
    );
    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith(
        `./delete/${mockedFormattedStorage.name}/${mockedFormattedStorage.region}`,
      );
    });
  });
});
