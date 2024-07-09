import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as authApi from '@/data/api/apiAuthorization';
import { useGetAuthorization } from '@/hooks/api/apiAuthorization/useGetAuthorization';

vi.mock('@/data/api/apiAuthorization', () => ({
  getAuthorization: vi.fn(),
}));

describe('useGetAuthorization', () => {
  it('should return Authorization', async () => {
    const projectId = 'projectId';

    vi.mocked(authApi.getAuthorization).mockResolvedValue(true);

    const { result } = renderHook(() => useGetAuthorization(projectId), {
      wrapper: QueryClientWrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual(true);
      expect(authApi.getAuthorization).toHaveBeenCalledWith({
        projectId,
      });
    });
  });
});
