import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as replicationApi from '@/data/api/replication/replication.api';
import { useAddReplication } from './useAddReplication.hook';
import { mockedStorageContainer } from '@/__tests__/helpers/mocks/storageContainer/storageContainer';
import { mockedReplicationRule } from '@/__tests__/helpers/mocks/storageContainer/replication';

// Mock updateReplications API
vi.mock('@/data/api/replication/replication.api', () => ({
  updateReplications: vi.fn(),
}));

vi.mock('@/data/api/storage/s3Storage.api', () => ({
  getS3Storage: vi.fn(() => mockedStorageContainer),
}));

vi.mock('@/data/hooks/s3-storage/getContainerHelper', () => ({
  getContainerHelper: vi.fn(() => mockedStorageContainer),
}));

describe('useAddReplication', () => {
  it('should call updateReplications with new rule', async () => {
    const onSuccess = vi.fn();
    const onError = vi.fn();

    vi.mocked(replicationApi.updateReplications).mockResolvedValue(
      mockedStorageContainer,
    );

    const { result } = renderHook(
      () => useAddReplication({ onSuccess, onError }),
      {
        wrapper: QueryClientWrapper,
      },
    );

    result.current.addReplication({
      projectId: 'projectId',
      region: 'GRA',
      name: 'containerName',
      replicationRule: mockedReplicationRule,
    });

    await waitFor(() => {
      expect(replicationApi.updateReplications).toHaveBeenCalledWith({
        projectId: 'projectId',
        region: 'GRA',
        name: 'containerName',
        replicationRules: [mockedReplicationRule],
      });
      expect(onSuccess).toHaveBeenCalled();
    });
  });
});
