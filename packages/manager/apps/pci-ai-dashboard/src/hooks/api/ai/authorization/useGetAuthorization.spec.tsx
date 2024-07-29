import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as authApi from '@/data/api/ai/authorization.api';
import { useGetAuthorization } from './useGetAuthorization.hook';
import { mockedAuthorization } from '@/__tests__/helpers/mocks/authorization';

vi.mock('@/data/api/ai/authorization.api', () => ({
  getAuthorization: vi.fn(),
}));

describe('useGetAuthorization', () => {
  it('should return Authorization', async () => {
    const projectId = 'projectId';

    vi.mocked(authApi.getAuthorization).mockResolvedValue(mockedAuthorization);

    const { result } = renderHook(() => useGetAuthorization(projectId), {
      wrapper: QueryClientWrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual(mockedAuthorization);
      expect(authApi.getAuthorization).toHaveBeenCalledWith({
        projectId,
      });
    });
  });
});
