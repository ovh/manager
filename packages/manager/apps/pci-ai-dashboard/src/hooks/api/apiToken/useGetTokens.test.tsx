import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as tokenApi from '@/data/api/apiToken';
import { mockedToken } from '@/__tests__/helpers/mocks/token';
import { useGetTokens } from './useGetTokens';

vi.mock('@/data/api/apiToken', () => ({
  getTokens: vi.fn(),
}));

describe('useGetTokens', () => {
  it('should return Tokens', async () => {
    const projectId = 'projectId';

    vi.mocked(tokenApi.getTokens).mockResolvedValue([mockedToken]);

    const { result } = renderHook(() => useGetTokens(projectId), {
      wrapper: QueryClientWrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual([mockedToken]);
      expect(tokenApi.getTokens).toHaveBeenCalledWith({
        projectId,
      });
    });
  });
});
