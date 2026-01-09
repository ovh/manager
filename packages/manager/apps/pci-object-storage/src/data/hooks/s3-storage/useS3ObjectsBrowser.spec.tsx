import { renderHook, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import { apiClient } from '@/data/api/api.client';
import {
  useS3ObjectsBrowser,
  mapToBrowserItem,
  getFolderName,
} from './useS3ObjectsBrowser.hook';

vi.mock('@/data/api/api.client', () => ({
  apiClient: {
    v6: {
      get: vi.fn(),
    },
  },
}));

describe('useS3ObjectsBrowser', () => {
  const defaultParams = {
    projectId: 'test-project',
    region: 'GRA',
    storageName: 'test-bucket',
    prefix: '',
    withVersions: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch objects successfully', async () => {
    const mockObjects = [
      { key: 'file1.txt', size: 100, isCommonPrefix: false },
      { key: 'folder/', size: 0, isCommonPrefix: true },
    ];

    vi.mocked(apiClient.v6.get).mockResolvedValue(mockObjects);

    const { result } = renderHook(() => useS3ObjectsBrowser(defaultParams), {
      wrapper: QueryClientWrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.items).toHaveLength(2);
    expect(apiClient.v6.get).toHaveBeenCalledWith(
      `/cloud/project/${defaultParams.projectId}/region/${defaultParams.region}/storage/${defaultParams.storageName}/object`,
      expect.objectContaining({
        params: expect.objectContaining({
          prefix: '',
          delimiter: '/',
          withVersions: false,
        }),
      }),
    );
  });

  it('should add parent item when prefix is set and showParent is true', async () => {
    const mockObjects = [
      { key: 'folder/file.txt', size: 100, isCommonPrefix: false },
    ];
    vi.mocked(apiClient.v6.get).mockResolvedValue(mockObjects);

    const { result } = renderHook(
      () =>
        useS3ObjectsBrowser({
          ...defaultParams,
          prefix: 'folder/',
          showParent: true,
        }),
      { wrapper: QueryClientWrapper },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.items[0]).toEqual({ type: 'parent' });
    expect(result.current.items).toHaveLength(2);
  });

  it('should not add parent item when showParent is false', async () => {
    const mockObjects = [
      { key: 'folder/file.txt', size: 100, isCommonPrefix: false },
    ];
    vi.mocked(apiClient.v6.get).mockResolvedValue(mockObjects);

    const { result } = renderHook(
      () =>
        useS3ObjectsBrowser({
          ...defaultParams,
          prefix: 'folder/',
          showParent: false,
        }),
      { wrapper: QueryClientWrapper },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.items[0]).not.toEqual({ type: 'parent' });
  });
});

describe('mapToBrowserItem', () => {
  it('should map a file object correctly', () => {
    const storageObject = {
      key: 'photos/vacation.jpg',
      size: 1024,
      isCommonPrefix: false,
      lastModified: '2024-01-01',
    };

    const result = mapToBrowserItem(storageObject as any);

    expect(result).toEqual({
      type: 'file',
      key: 'photos/vacation.jpg',
      size: 1024,
      isCommonPrefix: false,
      lastModified: '2024-01-01',
      name: 'vacation.jpg',
    });
  });

  it('should map a folder object correctly', () => {
    const storageObject = {
      key: 'photos/2024/',
      isCommonPrefix: true,
    };

    const result = mapToBrowserItem(storageObject as any);

    expect(result).toEqual({
      type: 'folder',
      key: 'photos/2024/',
      name: '2024',
    });
  });

  it('should extract folder name from root folder', () => {
    const storageObject = {
      key: 'documents/',
      isCommonPrefix: true,
    };

    const result = mapToBrowserItem(storageObject as any);

    expect(result).toEqual({
      type: 'folder',
      key: 'documents/',
      name: 'documents',
    });
  });

  it('should handle file at root level', () => {
    const storageObject = {
      key: 'readme.txt',
      size: 256,
      isCommonPrefix: false,
    };

    const result = mapToBrowserItem(storageObject as any);

    expect(result).toEqual({
      type: 'file',
      key: 'readme.txt',
      size: 256,
      isCommonPrefix: false,
      name: 'readme.txt',
    });
  });
});

describe('getFolderName', () => {
  it('should extract folder name from root folder', () => {
    expect(getFolderName('photos/')).toBe('photos');
  });

  it('should extract folder name from nested path', () => {
    expect(getFolderName('photos/2024/')).toBe('2024');
  });

  it('should extract folder name from deeply nested path', () => {
    expect(getFolderName('photos/2024/vacation/summer/')).toBe('summer');
  });

  it('should handle folder with spaces in name', () => {
    expect(getFolderName('my folder/')).toBe('my folder');
  });

  it('should handle folder with special characters', () => {
    expect(getFolderName('photos/été-2024/')).toBe('été-2024');
  });

  it('should handle key without trailing slash', () => {
    expect(getFolderName('photos')).toBe('photos');
  });

  it('should handle nested key without trailing slash', () => {
    expect(getFolderName('photos/2024')).toBe('2024');
  });
});
