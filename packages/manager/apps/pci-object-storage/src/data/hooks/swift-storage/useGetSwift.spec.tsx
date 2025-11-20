import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as swiftStorageApi from '@/data/api/storage/swiftStorage.api';
import { useGetSwift } from './useGetSwift.hook';
import { mockedContainerDetail } from '@/__tests__/helpers/mocks/swift/swift';

vi.mock('@/data/api/storage/swiftStorage.api', () => ({
  getSwiftStorage: vi.fn(),
}));

describe('useGetSwift', () => {
  it('should call useGetSwift on mutation with data', async () => {
    const projectId = 'mockedProjectId';
    const containerId = 'mockedContainerId';
    const noObjects = true;

    vi.mocked(swiftStorageApi.getSwiftStorage).mockResolvedValue(
      mockedContainerDetail,
    );

    const { result } = renderHook(
      () =>
        useGetSwift({
          projectId,
          containerId,
          noObjects,
        }),
      {
        wrapper: QueryClientWrapper,
      },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual(mockedContainerDetail);
      expect(swiftStorageApi.getSwiftStorage).toHaveBeenCalledWith({
        projectId,
        containerId,
        noObjects,
      });
    });
  });
});
