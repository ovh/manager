import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import {
  mockedUsedNavigate,
  setMockedUseParams,
} from '@/__tests__/helpers/mockRouterDomHelper';
import { openButtonInMenu } from '@/__tests__/helpers/unitTestHelper';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockedUser } from '@/__tests__/helpers/mocks/user';
import { mockedStorageContainer } from '@/__tests__/helpers/mocks/storageContainer/storageContainer';
import { mockedS3Object } from '@/__tests__/helpers/mocks/s3/object';
import {
  mockedRegion,
  mocked3AZRegion,
  mockedLZRegion,
} from '@/__tests__/helpers/mocks/region/region';
import { mockedCloudUser } from '@/__tests__/helpers/mocks/cloudUser/user';
import { breadcrumb as Breadcrumb } from './Objects.layout';
import Objects from './Objects.page';
import cloud from '@/types/Cloud';
import { useS3Data } from '../S3.context';
import { UseQueryResult } from '@tanstack/react-query';
import * as s3StorageApi from '@/data/api/storage/s3Storage.api';
import { useToast } from '@datatr-ux/uxlib';
import { mockedObjStoError } from '@/__tests__/helpers/apiError';
import { getObjectStoreApiErrorMessage } from '@/lib/apiHelper';

const successQueryMock: UseQueryResult<cloud.StorageContainer, Error> = {
  data: mockedStorageContainer,
  error: null,
  isLoading: false,
  isPending: false,
  isFetching: false,
  isSuccess: true,
  isError: false,
  isPlaceholderData: false,
  isStale: false,
  status: 'success',
  fetchStatus: 'idle',
  dataUpdatedAt: Date.now(),
  errorUpdatedAt: 0,
  isPaused: false,
  refetch: vi.fn(),
  failureCount: 0,
  isFetched: true,
  isFetchedAfterMount: true,
  isLoadingError: false,
  isRefetchError: false,
  failureReason: undefined,
  errorUpdateCount: 0,
  isInitialLoading: false,
  isRefetching: false,
  isEnabled: true,
  promise: Promise.resolve(mockedStorageContainer),
};

vi.mock('@/hooks/useUser', () => ({
  useUser: () => mockedUser,
}));

vi.mock('@/hooks/useLocale', () => ({
  useLocale: () => 'fr_FR',
}));

vi.mock('@/pages/object-storage/storage/s3Id/S3.context', () => ({
  useS3Data: vi.fn(),
}));

vi.mock('@/data/api/storage/s3Storage.api', () => ({
  getPresignUrlS3: vi.fn(),
}));

vi.mock('@/pages/object-storage/ObjectStorage.context', () => ({
  useObjectStorageData: vi.fn(() => ({
    projectId: 'projectId',
    storages: [mockedStorageContainer],
    storagesQuery: { isLoading: false },
    users: [mockedCloudUser],
    regions: [mockedRegion, mocked3AZRegion, mockedLZRegion],
  })),
}));

vi.mock('@/data/hooks/s3-storage/useS3ObjectsBrowser.hook', () => ({
  useS3ObjectsBrowser: vi.fn(() => ({
    items: [
      {
        type: 'file',
        ...mockedS3Object,
        name: 'objectKey',
      },
      {
        type: 'file',
        ...mockedS3Object,
        name: 'objectKeyBis',
        key: 'objectKeyBis',
        storageClass: cloud.storage.StorageClassEnum.DEEP_ARCHIVE,
      },
      {
        type: 'file',
        ...mockedS3Object,
        name: 'objectKeyTer',
        key: 'objectKeyTer',
        storageClass: cloud.storage.StorageClassEnum.DEEP_ARCHIVE,
        restoreStatus: {
          inProgress: false,
          expireDate: new Date('2026-02-10'),
        },
      },
      {
        type: 'folder',
        name: 'folderKey',
        key: 'folderKey',
      },
      {
        type: 'parent',
      },
    ],
    fetchNextPage: vi.fn(),
    hasNextPage: false,
    isFetchingNextPage: false,
    isLoading: false,
    refetch: vi.fn(),
    isFetching: false,
  })),
}));

vi.mock('@tanstack/react-virtual', () => ({
  useVirtualizer: vi.fn(({ count }) => {
    // Create mock virtual items for all items
    const virtualItems = Array.from({ length: count }, (_, index) => ({
      key: `virtual-item-${index}`,
      index,
      start: index * 44, // DEFAULT_ROW_HEIGHT from constants
      size: 44,
      end: (index + 1) * 44,
    }));

    return {
      getVirtualItems: () => virtualItems,
      getTotalSize: () => count * 44,
      scrollToIndex: vi.fn(),
    };
  }),
}));

describe('Objects Page', () => {
  beforeEach(() => {
    setMockedUseParams({
      projectId: 'projectId',
      region: 'BHS',
      s3Name: 's3Name',
    });
    mockedUsedNavigate();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders breadcrumb', async () => {
    render(<Breadcrumb />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    await waitFor(() => {
      expect(screen.getByText('Objects')).toBeTruthy();
    });
  });

  describe('S3 1AZ / 3AZ Objects Page', () => {
    beforeEach(() => {
      vi.mocked(useS3Data).mockReturnValue({
        projectId: 'projectId',
        s3: {
          ...mockedStorageContainer,
          objects: [mockedS3Object, { ...mockedS3Object, key: 'objectKeyBis' }],
        },
        s3Query: successQueryMock,
      });
    });
    it('display Objects Pages with table and buttons', async () => {
      render(<Objects />, { wrapper: RouterWithQueryClientWrapper });

      expect(screen.getByTestId('containers-guides-container')).toBeTruthy();
      expect(screen.getByTestId('object-button-container')).toBeTruthy();
      const span = screen.getByTitle(mockedS3Object.key);
      expect(span).toBeTruthy();
    });

    it('should navigate to add-object route when clicking the add button', async () => {
      render(<Objects />, { wrapper: RouterWithQueryClientWrapper });

      await waitFor(() => {
        expect(screen.getByTestId('add-object-button')).toBeTruthy();
      });
      act(() => {
        fireEvent.click(screen.getByTestId('add-object-button'));
      });
      expect(mockedUsedNavigate).toHaveBeenCalledWith('./add-object');
    });

    it('should display the version switch when region is not a local zone', async () => {
      render(<Objects />, { wrapper: RouterWithQueryClientWrapper });

      await waitFor(() => {
        expect(screen.getByText('seeVersionsSwitchLabel')).toBeTruthy();
      });
    });

    it('should display the bulk delete button when all objects are selected and navigate to modal page', async () => {
      render(<Objects />, { wrapper: RouterWithQueryClientWrapper });

      await waitFor(() => {
        expect(screen.getByTestId('select-all-checkbox')).toBeTruthy();
      });

      act(() => {
        const checkbox = screen.getByTestId('select-all-checkbox');
        fireEvent.click(checkbox);
      });

      await waitFor(() => {
        expect(screen.getByTestId('bulk-delete-button')).toBeTruthy();
      });

      act(() => {
        fireEvent.click(screen.getByTestId('bulk-delete-button'));
      });
      expect(mockedUsedNavigate).toHaveBeenCalledWith('./bulk-delete');
    });

    it('should display the restore button and navigate to modal page', async () => {
      render(<Objects />, { wrapper: RouterWithQueryClientWrapper });

      await waitFor(() => {
        expect(screen.getByTestId('restore-object-button')).toBeTruthy();
      });
      act(() => {
        fireEvent.click(screen.getByTestId('restore-object-button'));
      });
      expect(mockedUsedNavigate).toHaveBeenCalledWith(
        './restore-object?objectKey=objectKeyTer',
      );
    });

    it('Should navigate to details object on details actions menu in 3AZ', async () => {
      render(<Objects />, { wrapper: RouterWithQueryClientWrapper });
      await waitFor(() => {
        expect(
          screen.getByTestId(`s3-action-trigger-${mockedS3Object.key}`),
        ).toBeTruthy();
      });

      await openButtonInMenu(
        `s3-action-trigger-${mockedS3Object.key}`,
        'details',
      );

      expect(mockedUsedNavigate).toHaveBeenCalledWith(
        './object?objectKey=objectKey',
      );
    });

    it('Should navigate to delete object on delete actions menu in 3AZ', async () => {
      render(<Objects />, { wrapper: RouterWithQueryClientWrapper });
      await waitFor(() => {
        expect(
          screen.getByTestId(`s3-action-trigger-${mockedS3Object.key}`),
        ).toBeTruthy();
      });

      await openButtonInMenu(
        `s3-action-trigger-${mockedS3Object.key}`,
        'delete',
      );

      expect(mockedUsedNavigate).toHaveBeenCalledWith(
        './delete-object?objectKey=objectKey',
      );
    });

    it('Throw toast errors on download actions menu in 3AZ', async () => {
      vi.mocked(s3StorageApi.getPresignUrlS3).mockImplementation(() => {
        throw mockedObjStoError;
      });
      render(<Objects />, { wrapper: RouterWithQueryClientWrapper });

      await waitFor(() => {
        expect(
          screen.getByTestId(`s3-action-trigger-${mockedS3Object.key}`),
        ).toBeTruthy();
      });

      await openButtonInMenu(
        `s3-action-trigger-${mockedS3Object.key}`,
        'download',
      );

      await waitFor(() => {
        expect(s3StorageApi.getPresignUrlS3).toHaveBeenCalled();
        expect(useToast().toast).toHaveBeenCalledWith({
          title: 'objectToastErrorTitle',
          description: 'The provided data is invalid',
          variant: 'critical',
        });
      });
    });

    it('Should navigate to restore object on restore actions menu in 3AZ', async () => {
      render(<Objects />, { wrapper: RouterWithQueryClientWrapper });
      await waitFor(() => {
        expect(
          screen.getByTestId('s3-action-trigger-objectKeyBis'),
        ).toBeTruthy();
      });

      await openButtonInMenu('s3-action-trigger-objectKeyBis', 'download');

      expect(mockedUsedNavigate).toHaveBeenCalledWith(
        './restore-object?objectKey=objectKeyBis',
      );
    });
  });

  it('Download actions on Success menu in LZ', async () => {
    render(<Objects />, { wrapper: RouterWithQueryClientWrapper });

    await waitFor(() => {
      expect(
        screen.getByTestId(`s3-action-trigger-${mockedS3Object.key}`),
      ).toBeTruthy();
    });

    await openButtonInMenu(
      `s3-action-trigger-${mockedS3Object.key}`,
      'download',
    );

    await waitFor(() => {
      expect(s3StorageApi.getPresignUrlS3).toHaveBeenCalled();
    });
  });

  describe('S3 LZ Objects Page', () => {
    beforeEach(() => {
      vi.mocked(useS3Data).mockReturnValue({
        projectId: 'projectId',
        s3: {
          ...mockedStorageContainer,
          region: 'RBX',
          objects: [mockedS3Object],
        },
        s3Query: successQueryMock,
      });
    });

    it('should NOT display the version switch in a local zone', async () => {
      render(<Objects />, { wrapper: RouterWithQueryClientWrapper });

      await waitFor(() => {
        expect(screen.getByTestId('object-button-container')).toBeTruthy();
      });
      expect(screen.queryByText('seeVersionsSwitchLabel')).toBeFalsy();
    });

    it('Check delete actions menu in LZ', async () => {
      render(<Objects />, { wrapper: RouterWithQueryClientWrapper });

      await waitFor(() => {
        expect(
          screen.getByTestId(`storages-action-trigger-${mockedS3Object.key}`),
        ).toBeTruthy();
      });

      await openButtonInMenu(
        `storages-action-trigger-${mockedS3Object.key}`,
        'delete',
      );

      expect(mockedUsedNavigate).toHaveBeenCalledWith(
        './delete-object?objectKey=objectKey',
      );
    });

    it('Throw toast errors on download actions menu in LZ', async () => {
      vi.mocked(s3StorageApi.getPresignUrlS3).mockImplementation(() => {
        throw mockedObjStoError;
      });
      render(<Objects />, { wrapper: RouterWithQueryClientWrapper });

      await waitFor(() => {
        expect(
          screen.getByTestId(`storages-action-trigger-${mockedS3Object.key}`),
        ).toBeTruthy();
      });

      await openButtonInMenu(
        `storages-action-trigger-${mockedS3Object.key}`,
        'download',
      );

      await waitFor(() => {
        expect(s3StorageApi.getPresignUrlS3).toHaveBeenCalled();
        expect(useToast().toast).toHaveBeenCalledWith({
          title: 'objectToastErrorTitle',
          description: 'The provided data is invalid',
          variant: 'critical',
        });
      });
    });
  });

  it('Download actions on Success menu in LZ', async () => {
    render(<Objects />, { wrapper: RouterWithQueryClientWrapper });

    await waitFor(() => {
      expect(
        screen.getByTestId(`storages-action-trigger-${mockedS3Object.key}`),
      ).toBeTruthy();
    });

    await openButtonInMenu(
      `storages-action-trigger-${mockedS3Object.key}`,
      'download',
    );

    await waitFor(() => {
      expect(s3StorageApi.getPresignUrlS3).toHaveBeenCalled();
    });
  });
});
