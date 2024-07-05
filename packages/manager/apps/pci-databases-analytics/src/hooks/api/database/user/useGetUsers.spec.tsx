import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import * as databaseAPI from '@/data/api/database/user.api';
import * as database from '@/types/cloud/project/database';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import { useGetUsers } from '@/hooks/api/database/user/useGetUsers.hook';
import { mockedDatabaseUser } from '@/__tests__/helpers/mocks/databaseUser';

vi.mock('@/data/api/database/user.api', () => ({
  getUsers: vi.fn(),
  addUser: vi.fn(),
  deleteUser: vi.fn(),
  resetUserPassword: vi.fn(),
  getRoles: vi.fn(),
  editUser: vi.fn(),
}));

describe('useGetUsers', () => {
  it('should return users data', async () => {
    const projectId = 'projectId';
    const engine = database.EngineEnum.mysql;
    const serviceId = 'serviceId';

    vi.mocked(databaseAPI.getUsers).mockResolvedValue([mockedDatabaseUser]);

    const { result } = renderHook(
      () => useGetUsers(projectId, engine, serviceId),
      { wrapper: QueryClientWrapper },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual([mockedDatabaseUser]);
      expect(databaseAPI.getUsers).toHaveBeenCalledWith({
        projectId,
        engine,
        serviceId,
      });
    });
  });
});
