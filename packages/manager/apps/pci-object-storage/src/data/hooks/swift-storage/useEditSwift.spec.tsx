import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as swiftStorageApi from '@/data/api/storage/swiftStorage.api';
import { useEditSwift } from './useEditSwift.hook';
import storages from '@/types/Storages';

vi.mock('@/data/api/storage/swiftStorage.api', () => ({
  editSwiftStorage: vi.fn(),
}));

describe('useEditSwift', () => {
  it('should call useEditSwift on mutation with data', async () => {
    const onSuccess = vi.fn();
    const onError = vi.fn();

    vi.mocked(swiftStorageApi.editSwiftStorage).mockResolvedValue('');

    const { result } = renderHook(() => useEditSwift({ onError, onSuccess }), {
      wrapper: QueryClientWrapper,
    });

    result.current.editSwift({
      projectId: 'mockedProjectId',
      containerId: 'mockedContainerId',
      data: { containerType: storages.TypeEnum.public },
    });

    await waitFor(() => {
      expect(swiftStorageApi.editSwiftStorage).toHaveBeenCalledWith({
        projectId: 'mockedProjectId',
        containerId: 'mockedContainerId',
        data: { containerType: 'public' },
      });
      expect(onSuccess).toHaveBeenCalledWith();
    });
  });
});
