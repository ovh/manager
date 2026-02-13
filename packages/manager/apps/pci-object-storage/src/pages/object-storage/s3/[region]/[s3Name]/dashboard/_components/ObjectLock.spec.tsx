import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockedStorageContainer } from '@/__tests__/helpers/mocks/storageContainer/storageContainer';
import { mockedCloudUser } from '@/__tests__/helpers/mocks/cloudUser/user';
import {
  mocked3AZRegion,
  mockedLZRegion,
  mockedRegion,
} from '@/__tests__/helpers/mocks/region/region';
import storages from '@/types/Storages';
import ObjectLock from './ObjectLock.component';

vi.mock(
  '@/pages/object-storage/ObjectStorage.context',
  () => ({
  useObjectStorageData: vi.fn(() => ({
    projectId: 'projectId',
    storages: [mockedStorageContainer],
    storagesQuery: { isLoading: false },
    users: [mockedCloudUser],
    regions: [mockedRegion, mocked3AZRegion, mockedLZRegion],
  })),
  }),
);

vi.mock(
  '@/pages/object-storage/s3/[region]/[s3Name]/S3.context',
  () => ({
  useS3Data: vi.fn(() => ({
    projectId: 'projectId',
    s3: {
      ...mockedStorageContainer,
      objectLock: {
        status: 'enabled',
        rule: { mode: storages.ObjectLockModeEnum.compliance, period: 'P1Y' },
      },
    },
    s3Query: { isLoading: false },
  })),
  }),
);

vi.mock('@/data/api/storage/s3Storage.api', () => ({
  getS3Storage: vi.fn(),
}));

describe('ObjectLock Component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders Object lock component', async () => {
    render(<ObjectLock />, { wrapper: RouterWithQueryClientWrapper });
    await waitFor(() => {
      expect(screen.getByTestId('object-lock-container')).toBeTruthy();
      expect(screen.getByTestId('object-lock-link')).toBeTruthy();
    });
  });
});
