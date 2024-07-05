import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import * as databaseAPI from '@/data/api/database/user.api';
import * as database from '@/types/cloud/project/database';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import { useGetRoles } from './useGetRoles.hook';

vi.mock('@/data/api/database/user.api', () => ({
  getUsers: vi.fn(),
  addUser: vi.fn(),
  deleteUser: vi.fn(),
  resetUserPassword: vi.fn(),
  getRoles: vi.fn(),
  editUser: vi.fn(),
}));

describe('useGetRoles', () => {
  it('should return roles data', async () => {
    const projectId = 'projectId';
    const engine = database.EngineEnum.mysql;
    const serviceId = 'serviceId';
    const mockedRoles = ['Roles1', 'Roles2'];
    vi.mocked(databaseAPI.getRoles).mockResolvedValue(mockedRoles);

    const { result } = renderHook(
      () => useGetRoles(projectId, engine, serviceId),
      { wrapper: QueryClientWrapper },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual(mockedRoles);
      expect(databaseAPI.getRoles).toHaveBeenCalledWith({
        projectId,
        engine,
        serviceId,
      });
    });
  });
});
