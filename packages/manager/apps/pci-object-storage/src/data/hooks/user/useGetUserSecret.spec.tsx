import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as userApi from '@/data/api/user/user.api';
import { useGetUserSecret } from './useGetUserSecret.hook';
import { mockedS3CredentialsSecretOnly } from '@/__tests__/helpers/mocks/cloudUser/user';

vi.mock('@/data/api/user/user.api', () => ({
  getUserSecretKey: vi.fn(),
}));

describe('useGetUserSecret', () => {
  it('should fetch user secret and trigger onSuccess', async () => {
    const onSuccess = vi.fn();
    const onError = vi.fn();

    vi.mocked(userApi.getUserSecretKey).mockResolvedValue(
      mockedS3CredentialsSecretOnly,
    );

    const { result } = renderHook(
      () => useGetUserSecret({ onError, onSuccess }),
      { wrapper: QueryClientWrapper },
    );

    result.current.getUserSecret({
      projectId: 'projectId',
      userId: 12345,
      accessKey: 'mock-access-key',
    });

    await waitFor(() => {
      expect(userApi.getUserSecretKey).toHaveBeenCalledWith({
        projectId: 'projectId',
        userId: 12345,
        accessKey: 'mock-access-key',
      });
      expect(onSuccess).toHaveBeenCalledWith(mockedS3CredentialsSecretOnly);
    });
  });
});
