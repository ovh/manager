import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as userApi from '@/data/api/user/user.api';
import { useGetUserS3Credentials } from './useGetUserS3Credentials.hook';
import { mockedS3CredentialsWithoutPwd } from '@/__tests__/helpers/mocks/cloudUser/user';

vi.mock('@/data/api/user/user.api', () => ({
  getUserS3Credentials: vi.fn(),
}));

describe('useGetUserS3Credentials', () => {
  it('should fetch user S3 credentials and return data', async () => {
    const projectId = 'projectId';
    const userId = 12345;

    vi.mocked(userApi.getUserS3Credentials).mockResolvedValue([
      mockedS3CredentialsWithoutPwd,
    ]);

    const { result } = renderHook(
      () => useGetUserS3Credentials(projectId, userId),
      { wrapper: QueryClientWrapper },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual([mockedS3CredentialsWithoutPwd]);
      expect(userApi.getUserS3Credentials).toHaveBeenCalledWith({
        projectId,
        userId,
      });
    });
  });
});
