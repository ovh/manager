import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import * as databaseAPI from '@/data/api/database/user.api';
import * as database from '@/types/cloud/project/database';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import { useResetUserPassword } from './useResetUserPassword.hook';
import { useDeleteUser } from './useDeleteUser.hook';
import { useEditUser } from './useEditUser.hook';
import {
  mockedDatabaseUser,
  mockedDatabaseUserEdition,
  mockedDatabaseUserWithPassword,
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
      expect(onSuccess).toHaveBeenCalledWith(
        mockedDatabaseUser,
        editUserProps,
        undefined,
      );
    });
  });
});

describe('useResetUserPassword', () => {
  it('should call useResetUserPassword on mutation with data', async () => {
    const projectId = 'projectId';
    const engine = database.EngineEnum.mysql;
    const serviceId = 'serviceId';
    const onSuccess = vi.fn();
    const onError = vi.fn();

    vi.mocked(databaseAPI.resetUserPassword).mockResolvedValue(
      mockedDatabaseUserWithPassword,
    );
    const { result } = renderHook(
      () => useResetUserPassword({ onError, onSuccess }),
      { wrapper: QueryClientWrapper },
    );

    const resetPasswordUserProps = {
      projectId,
      engine,
      serviceId,
      userId: 'userId',
    };
    result.current.resetUserPassword(resetPasswordUserProps);

    await waitFor(() => {
      expect(databaseAPI.resetUserPassword).toHaveBeenCalledWith(
        resetPasswordUserProps,
      );
      expect(onSuccess).toHaveBeenCalledWith(
        mockedDatabaseUserWithPassword,
        resetPasswordUserProps,
        undefined,
      );
    });
  });
});

describe('useDeleteUser', () => {
  it('should call useDeleteUser on mutation with data', async () => {
    const projectId = 'projectId';
    const engine = database.EngineEnum.mysql;
    const serviceId = 'serviceId';
    const onSuccess = vi.fn();
    const onError = vi.fn();

    vi.mocked(databaseAPI.deleteUser).mockResolvedValue(undefined);

    const { result } = renderHook(() => useDeleteUser({ onError, onSuccess }), {
      wrapper: QueryClientWrapper,
    });

    const deleteUserProps = {
      projectId,
      engine,
      serviceId,
      userId: 'userId',
    };
    result.current.deleteUser(deleteUserProps);

    await waitFor(() => {
      expect(databaseAPI.deleteUser).toHaveBeenCalledWith(deleteUserProps);
      expect(onSuccess).toHaveBeenCalledWith(
        undefined,
        deleteUserProps,
        undefined,
      );
    });
  });
});
