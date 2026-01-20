import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import * as s3Api from '@/data/api/storage/s3Storage.api';
import {
  mockedUsedNavigate,
  setMockedUseParams,
} from '@/__tests__/helpers/mockRouterDomHelper';
import S3Layout, { Loader, breadcrumb as Breadcrumb } from './S3.layout';
import { mockedStorageContainer } from '@/__tests__/helpers/mocks/storageContainer/storageContainer';
import { mockedCloudUser } from '@/__tests__/helpers/mocks/cloudUser/user';
import {
  mocked3AZRegion,
  mockedRegion,
} from '@/__tests__/helpers/mocks/region/region';

const loaderParam = {
  params: {
    projectId: 'projectId',
    region: 'GRA',
    s3Name: 's3name',
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

vi.mock('@/data/api/storage/s3Storage.api', () => ({
  getS3Storage: vi.fn(() => mockedStorageContainer),
}));

describe('S3.layout', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockedUsedNavigate();
    setMockedUseParams({
      projectId: 'projectId',
      region: 'GRA',
      s3Name: 's3name',
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders loader function', async () => {
    Loader(loaderParam);
    await waitFor(() => {
      expect(s3Api.getS3Storage).toHaveBeenCalled();
    });
  });

  it('renders breadcrumb', async () => {
    vi.mocked(s3Api.getS3Storage).mockResolvedValue(mockedStorageContainer);
    render(<Breadcrumb />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    await waitFor(() => {
      expect(screen.getByText('s3name')).toBeTruthy();
    });
  });

  it('renders skeleton of service Layout', async () => {
    vi.mocked(s3Api.getS3Storage).mockResolvedValue(mockedStorageContainer);
    render(<S3Layout />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    await waitFor(() => {
      expect(screen.getByText('Loading your container data')).toBeTruthy();
    });
  });
  it('renders fully service layout', async () => {
    render(<S3Layout />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    await waitFor(() => {
      expect(screen.getByTestId('s3-header-container')).toBeTruthy();
    });
  });
});
