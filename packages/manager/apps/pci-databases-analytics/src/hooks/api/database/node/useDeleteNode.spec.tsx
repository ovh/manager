import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import * as databaseAPI from '@/data/api/database/node.api';
import * as database from '@/types/cloud/project/database';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import { useDeleteNode } from './useDeleteNode.hook';

vi.mock('@/data/api/database/node.api', () => ({
  addNode: vi.fn(),
  deleteNode: vi.fn(),
}));

describe('useDeleteNode', () => {
  it('should call useDeleteNode on mutation with data', async () => {
    const projectId = 'projectId';
    const engine = database.EngineEnum.mysql;
    const serviceId = 'serviceId';
    const onSuccess = vi.fn();
    const onError = vi.fn();

    vi.mocked(databaseAPI.deleteNode).mockResolvedValue(undefined);

    const { result } = renderHook(() => useDeleteNode({ onError, onSuccess }), {
      wrapper: QueryClientWrapper,
    });

    const deleteNodeProps = {
      projectId,
      engine,
      serviceId,
      nodeId: 'nodeId',
    };
    result.current.deleteNode(deleteNodeProps);

    await waitFor(() => {
      expect(databaseAPI.deleteNode).toHaveBeenCalledWith(deleteNodeProps);
      expect(onSuccess).toHaveBeenCalledWith(
        undefined,
        deleteNodeProps,
        undefined,
      );
    });
  });
});
