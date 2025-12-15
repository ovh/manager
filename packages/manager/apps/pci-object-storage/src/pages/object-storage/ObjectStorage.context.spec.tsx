import { vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { mockedUsedNavigate } from '@/__tests__/helpers/mockRouterDomHelper';
import { RouterWithQueryClientWrapper } from '@/__tests__/helpers/wrappers/RouterWithQueryClientWrapper';
import { mockedStorages } from '@/__tests__/helpers/mocks/storageContainer/storages';
import { mockedRegion } from '@/__tests__/helpers/mocks/region/region';
import { useObjectStorageData } from './ObjectStorage.context';
import { mockedCloudUser } from '@/__tests__/helpers/mocks/cloudUser/user';

describe('ObjectStorage context', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockedUsedNavigate();

    vi.mock('@/data/api/storage/storages.api', () => ({
      getStorages: vi.fn(() => mockedStorages),
    }));
    vi.mock('@/data/api/user/user.api', () => ({
      getUsers: vi.fn(() => [mockedCloudUser]),
    }));
    vi.mock('@/data/api/region/region.api', () => ({
      getRegions: vi.fn(() => [mockedRegion]),
    }));
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return object Storage data when projectId in params', async () => {
    const { result } = renderHook(() => useObjectStorageData(), {
      wrapper: RouterWithQueryClientWrapper,
    });
    expect(result.current.projectId).toBe('projectId');
  });
});
