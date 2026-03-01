import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import * as databaseAPI from '@/data/api/database/user.api';
import * as database from '@/types/cloud/project/database';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import { useEditUser } from './useEditUser.hook';
import {
  mockedDatabaseUser,
  mockedDatabaseUserEdition,
} from '@/__tests__/helpers/mocks/databaseUser';

vi.mock('@/data/api/database/user.api', () => ({
  getUsers: vi.fn(),
  addUser: vi.fn(),
  deleteUser: vi.fn(),
  resetUserPassword: vi.fn(),
  getRoles: vi.fn(),
  editUser: vi.fn(),
}));

describe('useEditUser', () => {
  it('should call useEditUser on mutation with data', async () => {
    const projectId = 'projectId';
    const engine = database.EngineEnum.mysql;
    const serviceId = 'serviceId';
    const onSuccess = vi.fn();
    const onError = vi.fn();

    vi.mocked(databaseAPI.editUser).mockResolvedValue(mockedDatabaseUser);
    const { result } = renderHook(() => useEditUser({ onError, onSuccess }), {
      wrapper: QueryClientWrapper,
    });

    const editUserProps = {
      projectId,
      engine,
      serviceId,
      user: mockedDatabaseUserEdition,
    };
    result.current.editUser(editUserProps);

    await waitFor(() => {
      expect(databaseAPI.editUser).toHaveBeenCalledWith(editUserProps);
      expect(onSuccess).toHaveBeenCalledWith(mockedDatabaseUser);
    });
  });
});
