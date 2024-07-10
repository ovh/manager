import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as userApi from '@/data/api/apiUser';
import { mockedUser, mockedUserCreation } from '@/__tests__/helpers/mocks/user';
import { useAddUser } from './useAddUser';

vi.mock('@/data/api/apiUser', () => ({
  addUser: vi.fn(),
}));

describe('useAddUSer', () => {
  it('should call useAddUser on mutation with data', async () => {
    const projectId = 'projectId';
    const onSuccess = vi.fn();
    const onError = vi.fn();

    vi.mocked(userApi.addUser).mockResolvedValue(mockedUser);
    const { result } = renderHook(() => useAddUser({ onError, onSuccess }), {
      wrapper: QueryClientWrapper,
    });

    const addUserProps = {
      projectId,
      newUser: mockedUserCreation,
    };
    result.current.addUser(addUserProps);

    await waitFor(() => {
      expect(userApi.addUser).toHaveBeenCalledWith(addUserProps);
      expect(onSuccess).toHaveBeenCalledWith(
        mockedUser,
        addUserProps,
        undefined,
      );
    });
  });
});
