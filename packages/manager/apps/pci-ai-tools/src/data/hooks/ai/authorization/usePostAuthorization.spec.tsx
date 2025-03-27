import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as authApi from '@/data/api/ai/authorization.api';
import { usePostAuthorization } from './usePostAuthorization.hook';
import { mockedAuthorization } from '@/__tests__/helpers/mocks/shared/authorization';

vi.mock('@/data/api/ai/authorization.api', () => ({
  postAuthorization: vi.fn(),
}));

describe('usePostAuthorization', () => {
  it('should call usePostAuthorization on mutation with data', async () => {
    const onSuccess = vi.fn();
    const onError = vi.fn();

    vi.mocked(authApi.postAuthorization).mockResolvedValue(mockedAuthorization);
    const { result } = renderHook(
      () => usePostAuthorization({ onError, onSuccess }),
      { wrapper: QueryClientWrapper },
    );
    result.current.postAuthorization();

    await waitFor(() => {
      expect(authApi.postAuthorization).toHaveBeenCalled();
      expect(onSuccess).toHaveBeenCalledWith(mockedAuthorization);
    });
  });
});
