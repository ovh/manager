import { apiClient } from '@ovh-ux/manager-core-api';
import { describe, expect, vi } from 'vitest';
import { addNode, deleteNode } from '@/data/api/database/node.api';
import * as database from '@/types/cloud/project/database';

vi.mock('@ovh-ux/manager-core-api', () => {
  const post = vi.fn(() => {
    return Promise.resolve({ data: null });
  });
  const del = vi.fn(() => {
    return Promise.resolve({ data: null });
  });
  return {
    apiClient: {
      v6: {
        post,
        delete: del,
      },
    },
  };
});

describe('nodes service functions', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should call addNode', async () => {
    expect(apiClient.v6.post).not.toHaveBeenCalled();
    await addNode({
      projectId: 'projectId',
      engine: database.EngineEnum.mongodb,
      serviceId: 'serviceId',
      node: {
        flavor: 'db1-7',
        region: 'gra',
      },
    });
    expect(apiClient.v6.post).toHaveBeenCalledWith(
      '/cloud/project/projectId/database/mongodb/serviceId/node',
      {
        flavor: 'db1-7',
        region: 'gra',
      },
    );
  });

  it('should call deleteNode', async () => {
    expect(apiClient.v6.delete).not.toHaveBeenCalled();
    await deleteNode({
      projectId: 'projectId',
      engine: database.EngineEnum.mongodb,
      serviceId: 'serviceId',
      nodeId: 'nodeId',
    });
    expect(apiClient.v6.delete).toHaveBeenCalledWith(
      '/cloud/project/projectId/database/mongodb/serviceId/node/nodeId',
    );
  });
});
