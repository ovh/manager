import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import * as databaseAPI from '@/data/api/database/user.api';
import * as database from '@/types/cloud/project/database';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import { useResetUserPassword } from './useResetUserPassword.hook';
import { mockedDatabaseUserWithPassword } from '@/__tests__/helpers/mocks/databaseUser';

vi.mock('@/data/api/database/user.api', () => ({
  getUsers: vi.fn(),
  addUser: vi.fn(),
  deleteUser: vi.fn(),
  resetUserPassword: vi.fn(),
  getRoles: vi.fn(),
  editUser: vi.fn(),
}));

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
