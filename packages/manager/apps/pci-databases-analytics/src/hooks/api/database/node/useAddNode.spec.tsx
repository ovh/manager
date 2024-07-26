import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import * as databaseAPI from '@/data/api/database/node.api';
import * as database from '@/types/cloud/project/database';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import { useAddNode } from '@/hooks/api/database/node/useAddNode.hook';
import { mockedNode } from '@/__tests__/helpers/mocks/nodes';

vi.mock('@/data/api/database/node.api', () => ({
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
