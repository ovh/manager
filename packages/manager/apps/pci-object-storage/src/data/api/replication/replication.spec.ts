import { describe, it, expect, vi, afterEach } from 'vitest';
import { apiClient } from '@ovh-ux/manager-core-api';
import { updateReplications } from './replication.api';
import { mockedReplicationRule } from '@/__tests__/helpers/mocks/storageContainer/replication';

describe('Replication API functions', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should call updateReplications with correct params', async () => {
    expect(apiClient.v6.put).not.toHaveBeenCalled();

    const params = {
      projectId: 'projectId',
      region: 'GRA',
      name: 'containerName',
      replicationRules: [mockedReplicationRule],
    };

    await updateReplications(params);

    expect(apiClient.v6.put).toHaveBeenCalledWith(
      '/cloud/project/projectId/region/GRA/storage/containerName',
      {
        replication: {
          rules: params.replicationRules,
        },
      },
      undefined,
    );
  });
});
