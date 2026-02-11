import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import * as s3Api from '@/data/api/storage/s3Storage.api';
import {
  mockedUsedNavigate,
  setMockedUseParams,
  setMockedSearchParams,
} from '@/__tests__/helpers/mockRouterDomHelper';
import ObjectLayout, { breadcrumb as Breadcrumb } from './Object.layout';
import { mockedStorageContainer } from '@/__tests__/helpers/mocks/storageContainer/storageContainer';
import {
  mockedS3Object,
  mockedS3ObjectVersions,
} from '@/__tests__/helpers/mocks/s3/object';
import { mockedObjStoError } from '@/__tests__/helpers/apiError';

vi.mock('@/pages/object-storage/storage/s3Id/S3.context', () => ({
  useS3Data: vi.fn(() => ({
    projectId: 'projectId',
    s3: mockedStorageContainer,
    s3Query: { data: mockedStorageContainer, isLoading: false },
  })),
}));

vi.mock('@/data/api/storage/s3Storage.api', () => ({
  getS3Object: vi.fn(),
  getS3ObjectVersions: vi.fn(),
}));

describe('Object.layout', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockedUsedNavigate();
    setMockedUseParams({
      projectId: 'projectId',
      region: 'GRA',
      s3Name: 's3name',
    });
    setMockedSearchParams({
      objectKey: 'objectKey',
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders breadcrumb', () => {
    render(<Breadcrumb />, {
      wrapper: RouterWithQueryClientWrapper,
    });
    expect(screen.getByText('objectKey')).toBeTruthy();
  });

  it('renders skeleton of object layout', () => {
    vi.mocked(s3Api.getS3Object).mockResolvedValue(mockedS3Object);
    vi.mocked(s3Api.getS3ObjectVersions).mockResolvedValue([
      mockedS3ObjectVersions,
    ]);
    render(<ObjectLayout />, {
      wrapper: RouterWithQueryClientWrapper,
    });

    expect(screen.getByTestId('skeleton-container')).toBeTruthy();
  });

  it('renders fully object layout', async () => {
    vi.mocked(s3Api.getS3Object).mockResolvedValue(mockedS3Object);
    vi.mocked(s3Api.getS3ObjectVersions).mockResolvedValue([
      mockedS3ObjectVersions,
    ]);

    render(<ObjectLayout />, {
      wrapper: RouterWithQueryClientWrapper,
    });

    await waitFor(() => {
      expect(screen.getByTestId('object-header-container')).toBeTruthy();
    });
    expect(screen.getByTestId('tab-container')).toBeTruthy();
  });

  it('redirects to objects list when object is not found (404)', async () => {
    const error404 = {
      ...mockedObjStoError,
      response: { status: 404 },
    };

    vi.mocked(s3Api.getS3Object).mockRejectedValue(error404);
    vi.mocked(s3Api.getS3ObjectVersions).mockResolvedValue([
      mockedS3ObjectVersions,
    ]);

    render(<ObjectLayout />, {
      wrapper: RouterWithQueryClientWrapper,
    });

    await waitFor(() => {
      expect(
        mockedUsedNavigate,
      ).toHaveBeenCalledWith(
        '/pci/projects/projectId/storages/objects/s3/BHS/containerName/objects',
        { replace: true },
      );
    });
  });
});
