import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as replicationApi from '@/data/api/replication/replication.api';
import { useDeleteReplication } from './useDeleteReplication.hook';
import { mockedStorageContainer } from '@/__tests__/helpers/mocks/storageContainer/storageContainer';

// Mock updateReplications API
vi.mock('@/data/api/replication/replication.api', () => ({
  updateReplications: vi.fn(),
}));

vi.mock('@/data/hooks/s3-storage/getContainerHelper', () => ({
  getContainerHelper: vi.fn(() => mockedStorageContainer),
}));

describe('useDeleteReplication', () => {
  it('should call updateReplications with rule removed', async () => {
    const onSuccess = vi.fn();
    const onError = vi.fn();

    vi.mocked(replicationApi.updateReplications).mockResolvedValue(
      mockedStorageContainer,
    );

    const { result } = renderHook(
      () => useDeleteReplication({ onSuccess, onError }),
      {
        wrapper: QueryClientWrapper,
      },
    );

    result.current.deleteReplication({
      projectId: 'projectId',
      region: 'GRA',
      name: 'containerName',
      ruleId: 'rule1',
    });

    await waitFor(() => {
      expect(replicationApi.updateReplications).toHaveBeenCalledWith({
        projectId: 'projectId',
        region: 'GRA',
        name: 'containerName',
        replicationRules: [],
      });
      expect(onSuccess).toHaveBeenCalled();
    });
  });
});
