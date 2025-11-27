import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as userApi from '@/data/api/user/user.api';
import { useAddUser } from './useAddUser.hook';
import { mockedUserDetail } from '@/__tests__/helpers/mocks/cloudUser/user';
import user from '@/types/User';

vi.mock('@/data/api/user/user.api', () => ({
  addUser: vi.fn(),
}));

describe('useAddUser', () => {
  it('should call addUser and trigger onSuccess', async () => {
    const onSuccess = vi.fn();
    const onError = vi.fn();

    vi.mocked(userApi.addUser).mockResolvedValue(mockedUserDetail);

    const { result } = renderHook(() => useAddUser({ onError, onSuccess }), {
      wrapper: QueryClientWrapper,
    });

    result.current.addUser({
      projectId: 'projectId',
      newUser: {
        description: 'test user',
        role: user.RoleEnum.objectstore_operator,
      },
    });

    await waitFor(() => {
      expect(userApi.addUser).toHaveBeenCalledWith({
        projectId: 'projectId',
        newUser: {
          description: 'test user',
          role: user.RoleEnum.objectstore_operator,
        },
      });
      expect(onSuccess).toHaveBeenCalledWith(mockedUserDetail);
    });
  });
});
