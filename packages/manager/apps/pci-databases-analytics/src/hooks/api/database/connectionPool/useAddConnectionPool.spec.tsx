import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import * as databaseAPI from '@/data/api/database/connectionPool.api';
import * as database from '@/types/cloud/project/database';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import {
  mockedAddConnectionPool,
  mockedConnectionPool,
} from '@/__tests__/helpers/mocks/connectionPool';
import { useAddConnectionPool } from './useAddConnectionPool.hook';

vi.mock('@/data/api/database/connectionPool.api', () => ({
  addConnectionPool: vi.fn(),
}));

describe('useAddConnectionPool', () => {
  it('should call useAddConnectionPool on mutation with data', async () => {
    const projectId = 'projectId';
    const engine = database.EngineEnum.mysql;
    const serviceId = 'serviceId';
    const onSuccess = vi.fn();
    const onError = vi.fn();

    vi.mocked(databaseAPI.addConnectionPool).mockResolvedValue(
      mockedConnectionPool,
    );
    const { result } = renderHook(
      () => useAddConnectionPool({ onError, onSuccess }),
      { wrapper: QueryClientWrapper },
    );

    const addConnectionPoolProps = {
      projectId,
      engine,
      serviceId,
      connectionPool: mockedAddConnectionPool,
    };
    result.current.addConnectionPool(addConnectionPoolProps);

    await waitFor(() => {
      expect(databaseAPI.addConnectionPool).toHaveBeenCalledWith(
        addConnectionPoolProps,
      );
      expect(onSuccess).toHaveBeenCalledWith(
        mockedConnectionPool,
        addConnectionPoolProps,
        undefined,
      );
    });
  });
});
