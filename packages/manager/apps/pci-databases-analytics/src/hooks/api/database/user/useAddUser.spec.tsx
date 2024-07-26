import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import * as databaseAPI from '@/data/api/database/user.api';
import * as database from '@/types/cloud/project/database';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import { useAddUser } from './useAddUser.hook';
import {
  mockedDatabaseUser,
  mockedDatabaseUserCreation,
} from '@/__tests__/helpers/mocks/databaseUser';

vi.mock('@/data/api/database/user.api', () => ({
  getUsers: vi.fn(),
  addUser: vi.fn(),
  deleteUser: vi.fn(),
  resetUserPassword: vi.fn(),
  getRoles: vi.fn(),
  editUser: vi.fn(),
}));

describe('useAddUser', () => {
  it('should call useAddUser on mutation with data', async () => {
    const projectId = 'projectId';
    const engine = database.EngineEnum.mysql;
    const serviceId = 'serviceId';
    const onSuccess = vi.fn();
    const onError = vi.fn();

    vi.mocked(databaseAPI.addUser).mockResolvedValue(mockedDatabaseUser);
    const { result } = renderHook(() => useAddUser({ onError, onSuccess }), {
      wrapper: QueryClientWrapper,
    });

    const addUserProps = {
      projectId,
      engine,
      serviceId,
      user: mockedDatabaseUserCreation,
    };
    result.current.addUser(addUserProps);

    await waitFor(() => {
      expect(databaseAPI.addUser).toHaveBeenCalledWith(addUserProps);
      expect(onSuccess).toHaveBeenCalledWith(
        mockedDatabaseUser,
        addUserProps,
        undefined,
      );
    });
  });
});
