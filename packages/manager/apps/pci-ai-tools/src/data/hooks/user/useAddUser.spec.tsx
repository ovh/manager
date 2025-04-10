import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as userApi from '@/data/api/user/user.api';
import {
  mockedUserCreation,
  mockedUserDetails,
} from '@/__tests__/helpers/mocks/user';
import { useAddUser } from './useAddUser.hook';

vi.mock('@/data/api/user/user.api', () => ({
  addUser: vi.fn(),
}));

describe('useAddUSer', () => {
  it('should call useAddUser on mutation with data', async () => {
    const projectId = 'projectId';
    const onAddSuccess = vi.fn();
    const onError = vi.fn();

    vi.mocked(userApi.addUser).mockResolvedValue(mockedUserDetails);
    const { result } = renderHook(() => useAddUser({ onError, onAddSuccess }), {
      wrapper: QueryClientWrapper,
    });

    const addUserProps = {
      projectId,
      newUser: mockedUserCreation,
    };
    result.current.addUser(addUserProps);

    await waitFor(() => {
      expect(userApi.addUser).toHaveBeenCalledWith(addUserProps);
      expect(onAddSuccess).toHaveBeenCalledWith(mockedUserDetails);
    });
  });
});
