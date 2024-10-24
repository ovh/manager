import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as tokenApi from '@/data/api/ai/token.api';
import { useDeleteToken } from './useDeleteToken.hook';

vi.mock('@/data/api/ai/token.api', () => ({
  deleteToken: vi.fn(),
}));

describe('useDeleteToken', () => {
  it('should call useDeleteToken on mutation with data', async () => {
    const projectId = 'projectId';
    const tokenId = 'tokenId';
    const onSuccess = vi.fn();
    const onError = vi.fn();

    vi.mocked(tokenApi.deleteToken).mockResolvedValue(undefined);
    const { result } = renderHook(
      () => useDeleteToken({ onError, onSuccess }),
      { wrapper: QueryClientWrapper },
    );

    const deleteTokenProps = {
      projectId,
      tokenId,
    };
    result.current.deleteToken(deleteTokenProps);

    await waitFor(() => {
      expect(tokenApi.deleteToken).toHaveBeenCalledWith(deleteTokenProps);
      expect(onSuccess).toHaveBeenCalledWith(
        undefined,
        deleteTokenProps,
        undefined,
      );
    });
  });
});
