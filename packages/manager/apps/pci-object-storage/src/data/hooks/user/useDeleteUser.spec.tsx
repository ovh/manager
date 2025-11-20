import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as userApi from '@/data/api/user/user.api';
import { useDeleteUser } from './useDeleteUser.hook';

vi.mock('@/data/api/user/user.api', () => ({
  deleteS3Credentials: vi.fn(),
}));

describe('useDeleteUser', () => {
  it('should call deleteS3Credentials and trigger onDeleteSuccess', async () => {
    const onDeleteSuccess = vi.fn();
    const onError = vi.fn();

    vi.mocked(userApi.deleteS3Credentials).mockResolvedValue(undefined);

    const { result } = renderHook(
      () => useDeleteUser({ onDeleteSuccess, onError }),
      { wrapper: QueryClientWrapper },
    );

    result.current.deleteUser({
      projectId: 'projectId',
      userId: 12345,
      accessKey: 'mock-access-key',
    });

    await waitFor(() => {
      expect(userApi.deleteS3Credentials).toHaveBeenCalledWith({
        projectId: 'projectId',
        userId: 12345,
        accessKey: 'mock-access-key',
      });
      expect(onDeleteSuccess).toHaveBeenCalled();
    });
  });
});
