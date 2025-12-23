import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as swiftStorageApi from '@/data/api/storage/swiftStorage.api';
import { useCreateSwift } from './useCreateSwift.hook';
import { mockedSwiftContainer } from '@/__tests__/helpers/mocks/swift/swift';
import storages from '@/types/Storages';

vi.mock('@/data/api/storage/swiftStorage.api', () => ({
  createSwiftStorage: vi.fn(),
}));
describe('useCreateSwift', () => {
  it('should call useCreateSwift on mutation with data', async () => {
    const onSuccess = vi.fn();
    const onError = vi.fn();

    vi.mocked(swiftStorageApi.createSwiftStorage).mockResolvedValue(
      mockedSwiftContainer,
    );

    // Render the hook
    const { result } = renderHook(
      () => useCreateSwift({ onError, onSuccess }),
      {
        wrapper: QueryClientWrapper,
      },
    );

    result.current.createSwift({
      projectId: 'projectId',
      container: {
        containerName: 'mocked-container-name',
        region: 'BHS',
        archive: false,
      },
      containerType: storages.TypeEnum.public,
    });

    await waitFor(() => {
      expect(swiftStorageApi.createSwiftStorage).toHaveBeenCalledWith({
        projectId: 'projectId',
        container: {
          containerName: 'mocked-container-name',
          region: 'BHS',
          archive: false,
        },
        containerType: storages.TypeEnum.public,
      });
      expect(onSuccess).toHaveBeenCalledWith(mockedSwiftContainer);
    });
  });
});
