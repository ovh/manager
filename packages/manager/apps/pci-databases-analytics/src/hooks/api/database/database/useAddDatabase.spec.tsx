import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import * as databaseAPI from '@/data/api/database/database.api';
import * as database from '@/types/cloud/project/database';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import { mockedDatabase } from '@/__tests__/helpers/mocks/databases';
import { useAddDatabase } from './useAddDatabase.hook';

vi.mock('@/data/api/database/database.api', () => ({
  getServiceDatabases: vi.fn(),
  addDatabase: vi.fn(),
  deleteDatabase: vi.fn(),
}));

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
