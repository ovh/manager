import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as replicationApi from '@/data/api/replication/replication.api';
import { useUpdateReplication } from './useUpdateReplication.hook';
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
  getContainerHelper: vi.fn(() => ({
    ...mockedStorageContainer,
    replication: {
      rules: [
        { ...mockedReplicationRule, id: 'rule1', priority: 1 },
        { ...mockedReplicationRule, id: 'rule2', priority: 2 },
      ],
    },
  })),
}));

describe('useUpdateReplication', () => {
  it('should call updateReplications with updated rule', async () => {
    const onSuccess = vi.fn();
    const onError = vi.fn();

    vi.mocked(replicationApi.updateReplications).mockResolvedValue(
      mockedStorageContainer,
    );

    const { result } = renderHook(
      () => useUpdateReplication({ onSuccess, onError }),
      {
        wrapper: QueryClientWrapper,
      },
    );

    result.current.updateReplication({
      projectId: 'projectId',
      region: 'GRA',
      name: 'containerName',
      replicationRule: { ...mockedReplicationRule, id: 'rule2', priority: 99 },
    });

    await waitFor(() => {
      expect(replicationApi.updateReplications).toHaveBeenCalledWith({
        projectId: 'projectId',
        region: 'GRA',
        name: 'containerName',
        replicationRules: [
          { ...mockedReplicationRule, id: 'rule1', priority: 1 },
          { ...mockedReplicationRule, id: 'rule2', priority: 99 },
        ],
      });
      expect(onSuccess).toHaveBeenCalled();
    });
  });
});
