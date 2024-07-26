import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import * as databaseAPI from '@/data/api/database/connectionPool.api';
import * as database from '@/types/cloud/project/database';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import {
  mockedConnectionPool,
  mockedEditConnectionPool,
} from '@/__tests__/helpers/mocks/connectionPool';
import { useEditConnectionPool } from './useEditConnectionPool.hook';

vi.mock('@/data/api/database/connectionPool.api', () => ({
  editConnectionPool: vi.fn(),
}));

describe('useEditConnectionPool', () => {
  it('should call useEditConnectionPool on mutation with data', async () => {
    const projectId = 'projectId';
    const engine = database.EngineEnum.mysql;
    const serviceId = 'serviceId';
    const onSuccess = vi.fn();
    const onError = vi.fn();

    vi.mocked(databaseAPI.editConnectionPool).mockResolvedValue(
      mockedConnectionPool,
    );
    const { result } = renderHook(
      () => useEditConnectionPool({ onError, onSuccess }),
      { wrapper: QueryClientWrapper },
    );

    const editConnectionPoolProps = {
      projectId,
      engine,
      serviceId,
      connectionPool: mockedEditConnectionPool,
    };
    result.current.editConnectionPool(editConnectionPoolProps);

    await waitFor(() => {
      expect(databaseAPI.editConnectionPool).toHaveBeenCalledWith(
        editConnectionPoolProps,
      );
      expect(onSuccess).toHaveBeenCalledWith(
        mockedConnectionPool,
        editConnectionPoolProps,
        undefined,
      );
    });
  });
});
