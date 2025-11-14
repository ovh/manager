import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as userApi from '@/data/api/user/user.api';
import { useAddS3User } from './useAddS3User.hook';
import { mockedS3Credentials } from '@/__tests__/helpers/mocks/cloudUser/user';

vi.mock('@/data/api/user/user.api', () => ({
  addS3Credentials: vi.fn(),
}));

describe('useAddS3User', () => {
  it('should call addS3Credentials and trigger onSuccess', async () => {
    const onSuccess = vi.fn();
    const onError = vi.fn();

    vi.mocked(userApi.addS3Credentials).mockResolvedValue(mockedS3Credentials);

    const { result } = renderHook(() => useAddS3User({ onError, onSuccess }), {
      wrapper: QueryClientWrapper,
    });

    result.current.addS3User({ projectId: 'projectId', userId: 12345 });

    await waitFor(() => {
      expect(userApi.addS3Credentials).toHaveBeenCalledWith({
        projectId: 'projectId',
        userId: 12345,
      });
      expect(onSuccess).toHaveBeenCalledWith(mockedS3Credentials);
    });
  });
});
