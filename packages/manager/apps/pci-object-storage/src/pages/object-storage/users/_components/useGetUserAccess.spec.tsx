import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as userApi from '@/data/api/user/user.api';
import { mockedS3Credentials } from '@/__tests__/helpers/mocks/cloudUser/user';
import { mockedUsedNavigate } from '@/__tests__/helpers/mockRouterDomHelper';
import { useGetUserAccess } from './useGetUserAccess.hook';

vi.mock('@/data/api/user/user.api', () => ({
  getUserS3Credentials: vi.fn(() => [mockedS3Credentials]),
}));

describe('useGetUserAccess', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockedUsedNavigate();
  });

  it('should fetch user and return data', async () => {
    const projectId = 'projectId';
    const userId = 33;
    vi.mocked(userApi.getUserS3Credentials).mockResolvedValue([
      mockedS3Credentials,
    ]);

    const { result } = renderHook(() => useGetUserAccess(userId), {
      wrapper: QueryClientWrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual([mockedS3Credentials]);
      expect(userApi.getUserS3Credentials).toHaveBeenCalledWith({
        projectId,
        userId,
      });
    });
  });
});
