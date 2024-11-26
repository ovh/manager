import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as tokenApi from '@/data/api/ai/token.api';

import { useRenewToken } from './useRenewToken.hook';
import { mockedToken } from '@/__tests__/helpers/mocks/token';

vi.mock('@/data/api/ai/token.api', () => ({
  renewToken: vi.fn(),
}));

describe('useRenewToken', () => {
  it('should call useRenewToken on mutation with data', async () => {
    const projectId = 'projectId';
    const tokenId = 'tokenId';
    const onSuccess = vi.fn();
    const onError = vi.fn();

    vi.mocked(tokenApi.renewToken).mockResolvedValue(mockedToken);
    const { result } = renderHook(() => useRenewToken({ onError, onSuccess }), {
      wrapper: QueryClientWrapper,
    });

    const renewTokenProps = {
      projectId,
      tokenId,
    };
    result.current.renewToken(renewTokenProps);

    await waitFor(() => {
      expect(tokenApi.renewToken).toHaveBeenCalledWith(renewTokenProps);
      expect(onSuccess).toHaveBeenCalledWith(
        mockedToken,
        renewTokenProps,
        undefined,
      );
    });
  });
});
