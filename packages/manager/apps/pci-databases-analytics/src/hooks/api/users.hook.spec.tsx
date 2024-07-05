import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import * as databaseAPI from '@/api/databases/users';
import { database } from '@/models/database';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import {
  useGetUsers,
  useAddUser,
  useEditUser,
  useGetRoles,
  useResetUserPassword,
  useDeleteUser,
} from '@/hooks/api/users.api.hooks';
import {
  mockedDatabaseUser,
  mockedDatabaseUserCreation,
  mockedDatabaseUserEdition,
  mockedDatabaseUserWithPassword,
} from '@/__tests__/helpers/mocks/databaseUser';

vi.mock('@/api/databases/users', () => ({
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
