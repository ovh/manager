import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as tokenApi from '@/data/api/ai/token/token.api';
import { mockedToken } from '@/__tests__/helpers/mocks/shared/token';
import { useGetToken } from './useGetToken.hook';

vi.mock('@/data/api/ai/token.api', () => ({
  getToken: vi.fn(),
}));

describe('useGetToken', () => {
  it('should return Token', async () => {
    const projectId = 'projectId';
    const tokenId = 'tokenId';

    vi.mocked(tokenApi.getToken).mockResolvedValue(mockedToken);

    const { result } = renderHook(() => useGetToken(projectId, tokenId), {
      wrapper: QueryClientWrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual(mockedToken);
      expect(tokenApi.getToken).toHaveBeenCalledWith({
        projectId,
        tokenId,
      });
    });
  });
});
