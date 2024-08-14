import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import * as databaseAPI from '@/api/databases/nodes';
import { database } from '@/models/database';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import { useAddNode, useDeleteNode } from '@/hooks/api/nodes.api.hooks';
import { mockedNode } from '@/__tests__/helpers/mocks/nodes';

vi.mock('@/api/databases/nodes', () => ({
  addNode: vi.fn(),
  deleteNode: vi.fn(),
}));

describe('useAddNode', () => {
  it('should call useAddNode on mutation with data', async () => {
    const projectId = 'projectId';
    const engine = database.EngineEnum.mysql;
    const serviceId = 'serviceId';
    const onSuccess = vi.fn();
    const onError = vi.fn();

    vi.mocked(databaseAPI.addNode).mockResolvedValue(mockedNode);
    const { result } = renderHook(() => useAddNode({ onError, onSuccess }), {
      wrapper: QueryClientWrapper,
    });

    const addNodeProps = {
      projectId,
      engine,
      serviceId,
      node: mockedNode,
    };
    result.current.addNode(addNodeProps);

    await waitFor(() => {
      expect(databaseAPI.addNode).toHaveBeenCalledWith(addNodeProps);
      expect(onSuccess).toHaveBeenCalledWith(
        mockedNode,
        addNodeProps,
        undefined,
      );
    });
  });
});

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
