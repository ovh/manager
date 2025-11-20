import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as userApi from '@/data/api/user/user.api';
import { useGetUser } from './useGetUser.hook';
import { mockedCloudUser } from '@/__tests__/helpers/mocks/cloudUser/user';

vi.mock('@/data/api/user/user.api', () => ({
  getUser: vi.fn(),
}));

describe('useGetUser', () => {
  it('should fetch user and return data', async () => {
    const projectId = 'projectId';
    const userId = 12345;

    vi.mocked(userApi.getUser).mockResolvedValue(mockedCloudUser);

    const { result } = renderHook(() => useGetUser(projectId, userId), {
      wrapper: QueryClientWrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual(mockedCloudUser);
      expect(userApi.getUser).toHaveBeenCalledWith({ projectId, userId });
    });
  });
});
