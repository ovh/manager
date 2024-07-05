import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import {
  useGetConnectionPools,
  useAddConnectionPool,
  useDeleteConnectionPool,
  useEditConnectionPool,
} from '@/hooks/api/connectionPool.api.hooks';

import * as databaseAPI from '@/api/databases/connectionPool';
import { database } from '@/models/database';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import {
  mockedAddConnectionPool,
  mockedConnectionPool,
  mockedEditConnectionPool,
} from '@/__tests__/helpers/mocks/connectionPool';

vi.mock('@/api/databases/connectionPool', () => ({
  getConnectionPools: vi.fn(),
  addConnectionPool: vi.fn(),
  editConnectionPool: vi.fn(),
  deleteConnectionPool: vi.fn(),
}));

describe('useGetConnectionPool', () => {
  it('should return connectionPool data', async () => {
    const projectId = 'projectId';
    const engine = database.EngineEnum.mysql;
    const serviceId = 'serviceId';

    vi.mocked(databaseAPI.getConnectionPools).mockResolvedValue([
      mockedConnectionPool,
    ]);

    const { result } = renderHook(
      () => useGetConnectionPools(projectId, engine, serviceId),
      { wrapper: QueryClientWrapper },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual([mockedConnectionPool]);
      expect(databaseAPI.getConnectionPools).toHaveBeenCalledWith({
        projectId,
        engine,
        serviceId,
      });
    });
  });
});

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
