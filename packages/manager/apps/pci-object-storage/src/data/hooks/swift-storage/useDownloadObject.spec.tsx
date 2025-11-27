import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import * as swiftStorageApi from '@/data/api/storage/swiftStorage.api';
import { useDownloadSwiftObject } from './useDownloadObject.hook';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import { mockedObjectTempUrl } from '@/__tests__/helpers/mocks/storageContainer/presignUrl';

vi.mock('@/data/api/storage/swiftStorage.api', () => ({
  downloadObject: vi.fn(),
}));

describe('useDownloadObject', () => {
  it('should call useDownloadObject on mutation with data', async () => {
    const onSuccess = vi.fn();
    const onError = vi.fn();

    vi.mocked(swiftStorageApi.downloadObject).mockResolvedValue(
      mockedObjectTempUrl,
    );

    const { result } = renderHook(
      () => useDownloadSwiftObject({ onError, onSuccess }),
      {
        wrapper: QueryClientWrapper,
      },
    );

    result.current.downloadSwiftObject({
      projectId: 'myProjectId',
      containerId: 'myContainerId',
      data: {
        expirationDate: '2024-12-31T23:59:59Z',
        objectName: 'myObject.txt',
      },
    });

    await waitFor(() => {
      expect(swiftStorageApi.downloadObject).toHaveBeenCalledWith({
        projectId: 'myProjectId',
        containerId: 'myContainerId',
        data: {
          expirationDate: '2024-12-31T23:59:59Z',
          objectName: 'myObject.txt',
        },
      });
      expect(onSuccess).toHaveBeenCalledWith(mockedObjectTempUrl);
    });
  });
});
