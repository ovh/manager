import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as userApi from '@/data/api/user/user.api';
import { mockedUser } from '@/__tests__/helpers/mocks/user';
import { useGetUsers } from './useGetUsers.hook';

vi.mock('@/data/api/user/user.api', () => ({
  getUsers: vi.fn(),
}));

describe('useGetUsers', () => {
  it('should return Users', async () => {
    const projectId = 'projectId';

    vi.mocked(userApi.getUsers).mockResolvedValue([mockedUser]);

    const { result } = renderHook(() => useGetUsers(projectId), {
      wrapper: QueryClientWrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual([mockedUser]);
      expect(userApi.getUsers).toHaveBeenCalledWith({
        projectId,
      });
    });
  });
});
