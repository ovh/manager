import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as userApi from '@/data/api/user/user.api';
import { useGetUserRclone } from './useGetUserRclone.hook';
import { mockedRclone } from '@/__tests__/helpers/mocks/cloudUser/user';

vi.mock('@/data/api/user/user.api', () => ({
  getUserRclone: vi.fn(),
}));

describe('useGetUserRclone', () => {
  it('should fetch user rclone config and return data', async () => {
    const projectId = 'projectId';
    const userId = 12345;
    const region = 'GRA';

    vi.mocked(userApi.getUserRclone).mockResolvedValue(mockedRclone);

    const { result } = renderHook(
      () => useGetUserRclone(projectId, userId, region),
      { wrapper: QueryClientWrapper },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual(mockedRclone);
      expect(userApi.getUserRclone).toHaveBeenCalledWith({
        projectId,
        userId,
        region,
      });
    });
  });
});
