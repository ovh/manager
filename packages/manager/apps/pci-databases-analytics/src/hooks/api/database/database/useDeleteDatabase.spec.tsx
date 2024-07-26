import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import * as databaseAPI from '@/data/api/database/database.api';
import * as database from '@/types/cloud/project/database';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import { useDeleteDatabase } from './useDeleteDatabase.hook';

vi.mock('@/data/api/database/database.api', () => ({
  getServiceDatabases: vi.fn(),
  addDatabase: vi.fn(),
  deleteDatabase: vi.fn(),
}));

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
