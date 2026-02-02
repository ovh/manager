import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { UseQueryResult } from '@tanstack/react-query';
import { useToast } from '@datatr-ux/uxlib';
import {
  mockedUsedNavigate,
  setMockedUseParams,
} from '@/__tests__/helpers/mockRouterDomHelper';
import storages from '@/types/Storages';
import * as swiftApi from '@/data/api/storage/swiftStorage.api';
import SwiftObjectsPage, { breadcrumb as Breadcrumb } from './Objects.page';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockedContainerDetail } from '@/__tests__/helpers/mocks/swift/swift';
import { useSwiftData } from '../Swift.context';
import { mockedUser } from '@/__tests__/helpers/mocks/user';
import { openButtonInMenu } from '@/__tests__/helpers/unitTestHelper';
import { mockContainerObject } from '@/__tests__/helpers/mocks/s3/object';
import { mockedObjStoError } from '@/__tests__/helpers/apiError';
import { mockedObjectTempUrl } from '@/__tests__/helpers/mocks/storageContainer/presignUrl';

const successQueryMock: UseQueryResult<storages.ContainerDetail, Error> = {
  data: mockedContainerDetail,
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
  promise: Promise.resolve(mockedContainerDetail),
};

const loadingQueryMock: UseQueryResult<storages.ContainerDetail, Error> = {
  ...successQueryMock,
  data: undefined,
  isSuccess: false,
  isPending: true,
  isFetching: true,
  isLoading: true,
  status: 'pending',
};

vi.mock('@/pages/object-storage/storage/swiftId/Swift.context');

vi.mock('@/data/api/user/user.api', () => ({
  getUsers: vi.fn(() => [mockedUser]),
}));

vi.mock('@/data/api/storage/swiftStorage.api', () => ({
  downloadObject: vi.fn(() => mockedObjectTempUrl),
}));

vi.mock('@/hooks/useUser', () => {
  return {
    useUser: vi.fn(() => mockedUser),
  };
});

vi.mock('@/hooks/useLocale', () => ({
  useLocale: () => 'fr_FR',
}));

describe('SwiftObjectsPage', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockedUsedNavigate();
    setMockedUseParams({ projectId: 'projectId', swiftId: 'test-swift-id' });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders breadcrumb', async () => {
    render(<Breadcrumb />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    await waitFor(() => {
      expect(screen.getByText('objectsTab')).toBeTruthy();
    });
  });

  it('should show skeleton when loading', () => {
    vi.mocked(useSwiftData).mockReturnValue({
      projectId: 'projectId',
      swift: mockedContainerDetail,
      swiftQuery: loadingQueryMock,
    });

    render(<SwiftObjectsPage />, { wrapper: RouterWithQueryClientWrapper });

    expect(screen.queryByText('objectTitle')).not.toBeInTheDocument();
  });

  it('should show content when loaded', () => {
    vi.mocked(useSwiftData).mockReturnValue({
      projectId: 'projectId',
      swift: mockedContainerDetail,
      swiftQuery: successQueryMock,
    });

    render(<SwiftObjectsPage />, { wrapper: RouterWithQueryClientWrapper });

    expect(screen.getByText('objectTitle')).toBeInTheDocument();
    expect(screen.getByText('addNewObject')).toBeInTheDocument();
  });

  it('should navigate to add-object route when clicking add button', () => {
    vi.mocked(useSwiftData).mockReturnValue({
      projectId: 'projectId',
      swift: mockedContainerDetail,
      swiftQuery: successQueryMock,
    });

    render(<SwiftObjectsPage />, { wrapper: RouterWithQueryClientWrapper });

    fireEvent.click(screen.getByText('addNewObject'));

    expect(mockedUsedNavigate).toHaveBeenCalledWith('./add-object');
  });

  it('should handle undefined objects gracefully', () => {
    const swiftWithNoObjects: storages.ContainerDetail = {
      ...mockedContainerDetail,
      objects: [],
    };
    vi.mocked(useSwiftData).mockReturnValue({
      projectId: 'projectId',
      swift: swiftWithNoObjects,
      swiftQuery: { ...successQueryMock, data: swiftWithNoObjects },
    });

    render(<SwiftObjectsPage />, { wrapper: RouterWithQueryClientWrapper });

    expect(screen.getByText('objectTitle')).toBeInTheDocument();
  });

  it('call On Error on Download button with API Error', async () => {
    vi.mocked(useSwiftData).mockReturnValue({
      projectId: 'projectId',
      swift: mockedContainerDetail,
      swiftQuery: successQueryMock,
    });
    render(<SwiftObjectsPage />, { wrapper: RouterWithQueryClientWrapper });

    openButtonInMenu(
      'swift-objects-action-trigger',
      'swift-objects-action-delete',
    );

    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith(
        `./delete-object?objectName=${mockContainerObject.name}`,
      );
    });
  });

  it('call useNavigate on Delete button', async () => {
    vi.mocked(useSwiftData).mockReturnValue({
      projectId: 'projectId',
      swift: mockedContainerDetail,
      swiftQuery: successQueryMock,
    });
    render(<SwiftObjectsPage />, { wrapper: RouterWithQueryClientWrapper });

    openButtonInMenu(
      'swift-objects-action-trigger',
      'swift-objects-action-delete',
    );

    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith(
        `./delete-object?objectName=${mockContainerObject.name}`,
      );
    });
  });

  it('call useNavigate on Details button', async () => {
    vi.mocked(useSwiftData).mockReturnValue({
      projectId: 'projectId',
      swift: mockedContainerDetail,
      swiftQuery: successQueryMock,
    });
    render(<SwiftObjectsPage />, { wrapper: RouterWithQueryClientWrapper });

    openButtonInMenu(
      'swift-objects-action-trigger',
      'swift-objects-action-details',
    );

    await waitFor(() => {
      expect(mockedUsedNavigate).toHaveBeenCalledWith(
        `./object?objectName=${mockContainerObject.name}`,
      );
    });
  });

  it('call On Error on Download button with API Error', async () => {
    vi.mocked(useSwiftData).mockReturnValue({
      projectId: 'projectId',
      swift: mockedContainerDetail,
      swiftQuery: successQueryMock,
    });

    vi.mocked(swiftApi.downloadObject).mockImplementation(() => {
      throw mockedObjStoError;
    });
    render(<SwiftObjectsPage />, { wrapper: RouterWithQueryClientWrapper });

    openButtonInMenu(
      'swift-objects-action-trigger',
      'swift-objects-action-download',
    );

    await waitFor(() => {
      expect(swiftApi.downloadObject).toHaveBeenCalled();
      expect(useToast().toast).toHaveBeenCalledWith({
        title: 'objectToastErrorTitle',
        variant: 'critical',
        description: 'The provided data is invalid',
      });
    });
  });

  it('call onSuccess on Download button', async () => {
    vi.mocked(useSwiftData).mockReturnValue({
      projectId: 'projectId',
      swift: mockedContainerDetail,
      swiftQuery: successQueryMock,
    });
    render(<SwiftObjectsPage />, { wrapper: RouterWithQueryClientWrapper });

    openButtonInMenu(
      'swift-objects-action-trigger',
      'swift-objects-action-download',
    );

    await waitFor(() => {
      expect(swiftApi.downloadObject).toHaveBeenCalled();
    });
  });
});
