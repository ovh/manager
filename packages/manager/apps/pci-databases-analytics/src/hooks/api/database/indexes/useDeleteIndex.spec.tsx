import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import { useDeleteIndex } from './useDeleteIndex.hook';
import * as indexesApi from '@/data/api/database/indexes.api';
import * as database from '@/types/cloud/project/database';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';

vi.mock('@/data/api/database/indexes.api', () => ({
  deleteIndex: vi.fn(),
}));

describe('useDeleteIndex', () => {
  it('should call useDeleteIndex on mutation with data', async () => {
    const projectId = 'projectId';
    const engine = database.EngineEnum.m3db;
    const serviceId = 'serviceId';
    const onSuccess = vi.fn();
    const onError = vi.fn();

    vi.mocked(indexesApi.deleteIndex).mockResolvedValue(undefined);

    const { result } = renderHook(
      () => useDeleteIndex({ onError, onSuccess }),
      { wrapper: QueryClientWrapper },
    );

    const deleteIndexProps = {
      projectId,
      engine,
      serviceId,
      indexId: 'indexId',
    };
    result.current.deleteIndex(deleteIndexProps);

    await waitFor(() => {
      expect(indexesApi.deleteIndex).toHaveBeenCalledWith(deleteIndexProps);
      expect(onSuccess).toHaveBeenCalledWith(
        undefined,
        deleteIndexProps,
        undefined,
      );
    });
  });
});
