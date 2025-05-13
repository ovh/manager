import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import { useGetNamespaces } from './useGetNamespaces.hook';
import * as databaseAPI from '@/data/api/database/namespace.api';
import * as database from '@/types/cloud/project/database';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import { mockedNamespaces } from '@/__tests__/helpers/mocks/namespaces';

vi.mock('@/data/api/database/namespace.api', () => ({
  getNamespaces: vi.fn(),
  addNamespace: vi.fn(),
  editNamespace: vi.fn(),
  deleteNamespace: vi.fn(),
}));

describe('useGetNamespaces', () => {
  it('should return Namespaces data', async () => {
    const projectId = 'projectId';
    const engine = database.EngineEnum.m3db;
    const serviceId = 'serviceId';

    vi.mocked(databaseAPI.getNamespaces).mockResolvedValue([mockedNamespaces]);

    const { result } = renderHook(
      () => useGetNamespaces(projectId, engine, serviceId),
      { wrapper: QueryClientWrapper },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual([mockedNamespaces]);
      expect(databaseAPI.getNamespaces).toHaveBeenCalledWith({
        projectId,
        engine,
        serviceId,
      });
    });
  });
});
