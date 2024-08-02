import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import {
  useGetDatabases,
  useAddDatabase,
  useDeleteDatabase,
} from '@/hooks/api/databases.api.hook';

import * as databaseAPI from '@/api/databases/databases';
import { database } from '@/models/database';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import { mockedDatabase } from '@/__tests__/helpers/mocks/databases';

vi.mock('@/api/databases/databases', () => ({
  getServiceDatabases: vi.fn(),
  addDatabase: vi.fn(),
  deleteDatabase: vi.fn(),
}));

describe('useGetServiceDatabases', () => {
  it('should return service databases data', async () => {
    const projectId = 'projectId';
    const engine = database.EngineEnum.mysql;
    const serviceId = 'serviceId';

    vi.mocked(databaseAPI.getServiceDatabases).mockResolvedValue([
      mockedDatabase,
    ]);

    const { result } = renderHook(
      () => useGetDatabases(projectId, engine, serviceId),
      { wrapper: QueryClientWrapper },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual([mockedDatabase]);
      expect(databaseAPI.getServiceDatabases).toHaveBeenCalledWith({
        projectId,
        engine,
        serviceId,
      });
    });
  });
});

describe('useAddDatabase', () => {
  it('should call useAddDatabase on mutation with data', async () => {
    const projectId = 'projectId';
    const engine = database.EngineEnum.mysql;
    const serviceId = 'serviceId';
    const onSuccess = vi.fn();
    const onError = vi.fn();

    vi.mocked(databaseAPI.addDatabase).mockResolvedValue(mockedDatabase);
    const { result } = renderHook(
      () => useAddDatabase({ onError, onSuccess }),
      { wrapper: QueryClientWrapper },
    );

    const addDatabaseProps = {
      projectId,
      engine,
      serviceId,
      name: 'databaseName',
    };
    result.current.addDatabase(addDatabaseProps);

    await waitFor(() => {
      expect(databaseAPI.addDatabase).toHaveBeenCalledWith(addDatabaseProps);
      expect(onSuccess).toHaveBeenCalledWith(
        mockedDatabase,
        addDatabaseProps,
        undefined,
      );
    });
  });
});

describe('useDeleteDatabase', () => {
  it('should call useDeleteConnectionPool on mutation with data', async () => {
    const projectId = 'projectId';
    const engine = database.EngineEnum.mysql;
    const serviceId = 'serviceId';
    const onSuccess = vi.fn();
    const onError = vi.fn();

    vi.mocked(databaseAPI.deleteDatabase).mockResolvedValue(undefined);

    const { result } = renderHook(
      () => useDeleteDatabase({ onError, onSuccess }),
      { wrapper: QueryClientWrapper },
    );

    const deleteDatabaseProps = {
      projectId,
      engine,
      serviceId,
      databaseId: 'databaseId',
    };
    result.current.deleteDatabase(deleteDatabaseProps);

    await waitFor(() => {
      expect(databaseAPI.deleteDatabase).toHaveBeenCalledWith(
        deleteDatabaseProps,
      );
      expect(onSuccess).toHaveBeenCalledWith(
        undefined,
        deleteDatabaseProps,
        undefined,
      );
    });
  });
});
