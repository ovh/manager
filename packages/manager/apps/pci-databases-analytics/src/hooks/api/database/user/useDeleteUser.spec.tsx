import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import * as databaseAPI from '@/data/api/database/user.api';
import * as database from '@/types/cloud/project/database';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import { useDeleteUser } from './useDeleteUser.hook';

vi.mock('@/data/api/database/user.api', () => ({
  getUsers: vi.fn(),
  addUser: vi.fn(),
  deleteUser: vi.fn(),
  resetUserPassword: vi.fn(),
  getRoles: vi.fn(),
  editUser: vi.fn(),
}));

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
