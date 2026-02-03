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
import { mockedStorageContainer } from '@/__tests__/helpers/mocks/storageContainer/storageContainer';
import {
  mockedUsedNavigate,
  setMockedUseParams,
} from '@/__tests__/helpers/mockRouterDomHelper';
import storages from '@/types/Storages';
import { mockManagerReactShellClient } from '@/__tests__/helpers/mockShellHelper';
import ObjectLockOptions from './ObjectLockOptions.sheet';
import cloud from '@/types/Cloud';
import * as s3Api from '@/data/api/storage/s3Storage.api';
import { mockedObjStoError } from '@/__tests__/helpers/apiError';

vi.mock('react-i18next', async (importOriginal) => {
  const mod = await importOriginal<typeof import('react-i18next')>();
  return {
    ...mod,
    useTranslation: () => ({
      t: (key: string) => key,
    }),
  };
});

const mockedStorageContainerBis: cloud.StorageContainer = {
  ...mockedStorageContainer,
  objectLock: {
    status: storages.ObjectLockStatusEnum.disabled,
  },
};
vi.mock('@/data/api/storage/s3Storage.api', () => ({
  getS3Storage: vi.fn(() => mockedStorageContainerBis),
  updateS3Storage: vi.fn(() => mockedStorageContainerBis),
}));

describe('ObjectLockOptions Sheet', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockManagerReactShellClient();
    mockedUsedNavigate();
    setMockedUseParams({
      projectId: 'projectId',
      region: 'region',
      s3Name: 's3Name',
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders Object lock options sheet with disabled retention mode', async () => {
    render(<ObjectLockOptions />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByTestId('edit-object-lock-sheet')).toBeTruthy();
      expect(
        screen.getByTestId('edit-object-lock-confirm-button'),
      ).toBeTruthy();
      expect(screen.getByTestId('retention-mode-radio-group')).toBeTruthy();
      expect(screen.getByTestId('retention-mode-radio-group')).toHaveAttribute(
        'data-disabled',
      );
    });
  });

  it('Render sheet, enabled retention mode and throw api error', async () => {
    vi.mocked(s3Api.updateS3Storage).mockImplementation(() => {
      throw mockedObjStoError;
    });
    render(<ObjectLockOptions />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByTestId('edit-object-lock-sheet')).toBeTruthy();
      expect(
        screen.getByTestId('edit-object-lock-confirm-button'),
      ).toBeTruthy();

      expect(screen.getByTestId('retention-mode-radio-group')).toBeTruthy();
      expect(screen.getByTestId('retention-mode-radio-group')).toHaveAttribute(
        'data-disabled',
      );
    });

    act(() => {
      fireEvent.click(
        screen.getByTestId('object-lock-retention-enabled-option'),
      );
    });

    await waitFor(() => {
      expect(
        screen.getByTestId('retention-mode-radio-group'),
      ).not.toHaveAttribute('data-disabled');
    });

    act(() => {
      fireEvent.click(screen.getByTestId('edit-object-lock-confirm-button'));
    });

    await waitFor(() => {
      expect(s3Api.updateS3Storage).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'toastErrorTitle',
        variant: 'critical',
        description: 'The provided data is invalid',
      });
    });
  });

  it('Render sheet, enabled retention mode and call on Success', async () => {
    render(<ObjectLockOptions />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByTestId('edit-object-lock-sheet')).toBeTruthy();
    });

    act(() => {
      fireEvent.click(
        screen.getByTestId('object-lock-retention-enabled-option'),
      );
    });

    await waitFor(() => {
      expect(
        screen.getByTestId('retention-mode-radio-group'),
      ).not.toHaveAttribute('data-disabled');
    });

    act(() => {
      fireEvent.click(screen.getByTestId('object-lock-mode-compliance-option'));
      fireEvent.click(screen.getByTestId('edit-object-lock-confirm-button'));
    });

    await waitFor(() => {
      expect(s3Api.updateS3Storage).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'toastSuccessTitle',
        description: 'editObjectLockToastSuccessDescription',
      });
    });
  });
});
