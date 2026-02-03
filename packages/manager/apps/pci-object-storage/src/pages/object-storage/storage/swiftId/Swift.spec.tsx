import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import * as swiftApi from '@/data/api/storage/swiftStorage.api';
import {
  mockedUsedNavigate,
  setMockedUseParams,
} from '@/__tests__/helpers/mockRouterDomHelper';
import { mockedStorageContainer } from '@/__tests__/helpers/mocks/storageContainer/storageContainer';
import { mockedCloudUser } from '@/__tests__/helpers/mocks/cloudUser/user';
import {
  mocked3AZRegion,
  mockedRegion,
} from '@/__tests__/helpers/mocks/region/region';
import SwiftLayout, { Loader, breadcrumb as Breadcrumb } from './Swift.layout';
import { mockedContainerDetail } from '@/__tests__/helpers/mocks/swift/swift';

const loaderParam = {
  params: {
    projectId: 'projectId',
    swiftId: 'swift-id',
  },
  request: new Request('https://my-api.com/endpoint'),
};

vi.mock('@/pages/object-storage/ObjectStorage.context', () => ({
  useObjectStorageData: vi.fn(() => ({
    projectId: 'projectId',
    storages: [mockedStorageContainer],
    storagesQuery: { isLoading: false },
    users: [mockedCloudUser],
    regions: [mockedRegion, mocked3AZRegion],
  })),
}));

vi.mock('@/data/api/storage/swiftStorage.api', () => ({
  getSwiftStorage: vi.fn(() => mockedContainerDetail),
}));

describe('Swift.layout', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockedUsedNavigate();
    setMockedUseParams({
      projectId: 'projectId',
      swiftId: 'swift-id',
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders loader function', async () => {
    Loader(loaderParam);
    await waitFor(() => {
      expect(swiftApi.getSwiftStorage).toHaveBeenCalled();
    });
  });

  it('renders breadcrumb', async () => {
    vi.mocked(swiftApi.getSwiftStorage).mockResolvedValue(
      mockedContainerDetail,
    );
    render(<Breadcrumb />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    await waitFor(() => {
      expect(screen.getByText(mockedContainerDetail.name)).toBeTruthy();
    });
  });

  it('renders skeleton of service Layout', async () => {
    vi.mocked(swiftApi.getSwiftStorage).mockResolvedValue(
      mockedContainerDetail,
    );
    render(<SwiftLayout />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    await waitFor(() => {
      expect(screen.getByTestId('swift-header-skeleton-title')).toBeTruthy();
    });
  });
  it('renders fully service layout', async () => {
    render(<SwiftLayout />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    await waitFor(() => {
      expect(screen.getByTestId('swift-header-container')).toBeTruthy();
    });
  });
});
