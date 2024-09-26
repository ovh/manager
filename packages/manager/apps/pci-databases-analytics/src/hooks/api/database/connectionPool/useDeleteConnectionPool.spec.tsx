import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import * as databaseAPI from '@/data/api/database/connectionPool.api';
import * as database from '@/types/cloud/project/database';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import { useDeleteConnectionPool } from './useDeleteConnectionPool.hook';

vi.mock('@/data/api/database/connectionPool.api', () => ({
  deleteConnectionPool: vi.fn(),
}));

describe('useDeleteConnectionPool', () => {
  it('should call useDeleteConnectionPool on mutation with data', async () => {
    const projectId = 'projectId';
    const engine = database.EngineEnum.mysql;
    const serviceId = 'serviceId';
    const onSuccess = vi.fn();
    const onError = vi.fn();

    vi.mocked(databaseAPI.deleteConnectionPool).mockResolvedValue(undefined);

    const { result } = renderHook(
      () => useDeleteConnectionPool({ onError, onSuccess }),
      { wrapper: QueryClientWrapper },
    );

    const deleteConnectionPoolProps = {
      projectId,
      engine,
      serviceId,
      connectionPoolId: 'connectionPoolId',
    };
    result.current.deleteConnectionPool(deleteConnectionPoolProps);

    await waitFor(() => {
      expect(databaseAPI.deleteConnectionPool).toHaveBeenCalledWith(
        deleteConnectionPoolProps,
      );
      expect(onSuccess).toHaveBeenCalledWith(
        undefined,
        deleteConnectionPoolProps,
        undefined,
      );
    });
  });
});
