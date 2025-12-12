import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as userApi from '@/data/api/user/user.api';
import { useAddUserPolicy } from './useAddUserPolicy.hook';

vi.mock('@/data/api/user/user.api', () => ({
  addUserPolicy: vi.fn(),
}));

describe('useAddUserPolicy', () => {
  it('should call addUserPolicy and trigger onSuccess', async () => {
    const onSuccess = vi.fn();
    const onError = vi.fn();

    vi.mocked(userApi.addUserPolicy).mockResolvedValue(undefined);

    const { result } = renderHook(
      () => useAddUserPolicy({ onError, onSuccess }),
      { wrapper: QueryClientWrapper },
    );

    result.current.addUserPolicy({
      projectId: 'projectId',
      userId: 12345,
      policyData: {
        policy: 'my new policy',
      },
    });

    await waitFor(() => {
      expect(userApi.addUserPolicy).toHaveBeenCalledWith({
        projectId: 'projectId',
        userId: 12345,
        policyData: {
          policy: 'my new policy',
        },
      });
      expect(onSuccess).toHaveBeenCalled();
    });
  });
});
