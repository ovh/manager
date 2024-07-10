import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as tokenApi from '@/data/api/apiToken';
import { useAddToken } from './useAddToken';
import {
  mockedToken,
  mockedTokenCreation,
} from '@/__tests__/helpers/mocks/token';

vi.mock('@/data/api/apiToken', () => ({
  addToken: vi.fn(),
}));

describe('useAddToken', () => {
  it('should call useAddToken on mutation with data', async () => {
    const projectId = 'projectId';
    const onSuccess = vi.fn();
    const onError = vi.fn();

    vi.mocked(tokenApi.addToken).mockResolvedValue(mockedToken);
    const { result } = renderHook(() => useAddToken({ onError, onSuccess }), {
      wrapper: QueryClientWrapper,
    });

    const addTokenProps = {
      projectId,
      token: mockedTokenCreation,
    };
    result.current.addToken(addTokenProps);

    await waitFor(() => {
      expect(tokenApi.addToken).toHaveBeenCalledWith(addTokenProps);
      expect(onSuccess).toHaveBeenCalledWith(
        mockedToken,
        addTokenProps,
        undefined,
      );
    });
  });
});
