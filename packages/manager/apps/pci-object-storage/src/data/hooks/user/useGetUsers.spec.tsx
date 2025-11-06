import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as userApi from '@/data/api/user/user.api';
import { useGetUsers } from './useGetUsers.hook';
import { mockedCloudUser } from '@/__tests__/helpers/mocks/cloudUser/user';

vi.mock('@/data/api/user/user.api', () => ({
  getUsers: vi.fn(),
}));

describe('useGetUsers', () => {
  it('should fetch users and return data', async () => {
    const projectId = 'projectId';

    vi.mocked(userApi.getUsers).mockResolvedValue([mockedCloudUser]);

    const { result } = renderHook(() => useGetUsers(projectId), {
      wrapper: QueryClientWrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual([mockedCloudUser]);
      expect(userApi.getUsers).toHaveBeenCalledWith({ projectId });
    });
  });
});
