import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { UseQueryResult } from '@tanstack/react-query';
import { mockManagerReactShellClient } from '@/__tests__/helpers/mockShellHelper';
import { useS3Data } from '@/pages/object-storage/storage/s3Id/S3.context';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import {
  mockedS3WithReplication,
  mockedStorageContainer,
} from '@/__tests__/helpers/mocks/storageContainer/storageContainer';
import { mockedStorages } from '@/__tests__/helpers/mocks/storageContainer/storages';
import { mockedUser } from '@/__tests__/helpers/mocks/user';
import { mockedRegion } from '@/__tests__/helpers/mocks/region/region';
import * as storageAPI from '@/data/api/storage/storages.api';
import { mockedUsedNavigate } from '@/__tests__/helpers/mockRouterDomHelper';
import { breadcrumb as Breadcrumb } from './Replication.page';
import Replication from './list/List.page';
import cloud from '@/types/Cloud';
import { mockedReplicationRule } from '@/__tests__/helpers/mocks/storageContainer/replication';
import { openButtonInMenu } from '@/__tests__/helpers/unitTestHelper';

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

const loadingQueryMock: UseQueryResult<cloud.StorageContainer, Error> = {
  ...successQueryMock,
  data: undefined,
  isSuccess: false,
  isPending: true,
  isFetching: true,
  isLoading: true,
  status: 'pending',
};

vi.mock('@/pages/object-storage/storage/s3Id/S3.context', () => ({
  useS3Data: vi.fn(),
}));

vi.mock('@/data/api/storage/storages.api', () => ({
  getStorages: vi.fn(() => mockedStorages),
}));
vi.mock('@/data/api/user/user.api', () => ({
  getUsers: vi.fn(() => [mockedUser]),
}));
vi.mock('@/data/api/region/region.api', () => ({
  getRegions: vi.fn(() => [mockedRegion]),
}));

describe('Replication Page without destination and versionning', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedUsedNavigate();
    mockManagerReactShellClient();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders breadcrumb', async () => {
    render(<Breadcrumb />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    await waitFor(() => {
      expect(screen.getByText('replicationTab')).toBeTruthy();
    });
  });

  it('renders skeleton while loading', () => {
    vi.mocked(useS3Data).mockReturnValue({
      projectId: 'projectId',
      s3: mockedStorageContainer,
      s3Query: loadingQueryMock,
    });

    render(<Replication />, {
      wrapper: RouterWithQueryClientWrapper,
    });

    expect(screen.getByTestId('replication-list-table-skeleton')).toBeTruthy();
  });

  it('renders alert when no destination storage and no versionning', async () => {
    vi.mocked(storageAPI.getStorages).mockResolvedValueOnce({
      errors: [],
      resources: [],
    });

    vi.mocked(useS3Data).mockReturnValue({
      projectId: 'projectId',
      s3: mockedStorageContainer,
      s3Query: successQueryMock,
    });

    render(<Replication />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    await waitFor(() => {
      expect(
        screen.getByTestId('no-available-destinations-alert'),
      ).toBeTruthy();
      expect(
        screen.getByTestId('replication-requires-versioning-alert'),
      ).toBeTruthy();
    });
  });

  it('renders replication rules tables', async () => {
    vi.mocked(useS3Data).mockReturnValue({
      projectId: 'projectId',
      s3: mockedS3WithReplication,
      s3Query: successQueryMock,
    });
    render(<Replication />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    await waitFor(() => {
      expect(
        screen.queryByTestId('no-available-destinations-alert'),
      ).toBeFalsy();
      expect(
        screen.queryByTestId('replication-requires-versioning-alert'),
      ).toBeFalsy();
      expect(screen.getByTestId('create-replication-button')).toBeTruthy();
      expect(screen.getByText(mockedReplicationRule.id)).toBeTruthy();
    });
  });

  it('trigger useNavigate on create replication button', async () => {
    vi.mocked(useS3Data).mockReturnValue({
      projectId: 'projectId',
      s3: mockedS3WithReplication,
      s3Query: successQueryMock,
    });
    render(<Replication />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    await waitFor(() => {
      expect(screen.getByTestId('create-replication-button')).toBeTruthy();
    });
    act(() => {
      fireEvent.click(screen.getByTestId('create-replication-button'));
    });
    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith('./new');
    });
  });

  it('trigger edit table action', async () => {
    vi.mocked(useS3Data).mockReturnValue({
      projectId: 'projectId',
      s3: mockedS3WithReplication,
      s3Query: successQueryMock,
    });
    render(<Replication />, {
      wrapper: RouterWithQueryClientWrapper,
    });

    await openButtonInMenu(
      'replication-actions-menu-trigger',
      'replication-action-edit-button',
    );
    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith(
        `./edit/${mockedReplicationRule.id}`,
      );
    });
  });

  it('trigger delete table action', async () => {
    vi.mocked(useS3Data).mockReturnValue({
      projectId: 'projectId',
      s3: mockedS3WithReplication,
      s3Query: successQueryMock,
    });
    render(<Replication />, {
      wrapper: RouterWithQueryClientWrapper,
    });

    await openButtonInMenu(
      'replication-actions-menu-trigger',
      'replication-action-delete-button',
    );
    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith(
        `./delete/${mockedReplicationRule.id}`,
      );
    });
  });
});
