import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as tokenApi from '@/data/api/apiToken';
import { mockedToken } from '@/__tests__/helpers/mocks/token';
import { useRenewToken } from './useRenewToken';

vi.mock('@/data/api/apiToken', () => ({
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
