import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as tokenApi from '@/data/api/ai/token/token.api';
import { useAddToken } from './useAddToken.hook';
import {
  mockedToken,
  mockedTokenCreation,
} from '@/__tests__/helpers/mocks/shared/token';

vi.mock('@/data/api/ai/token/token.api', () => ({
  addToken: vi.fn(),
}));

describe('useAddToken', () => {
  it('should call useAddToken on mutation with data', async () => {
    const projectId = 'projectId';
    const onAddEditSuccess = vi.fn();
    const onError = vi.fn();

    vi.mocked(tokenApi.addToken).mockResolvedValue(mockedToken);
    const { result } = renderHook(
      () => useAddToken({ onError, onAddEditSuccess }),
      {
        wrapper: QueryClientWrapper,
      },
    );

    const addTokenProps = {
      projectId,
      token: mockedTokenCreation,
    };
    result.current.addToken(addTokenProps);

    await waitFor(() => {
      expect(tokenApi.addToken).toHaveBeenCalledWith(addTokenProps);
      expect(onAddEditSuccess).toHaveBeenCalledWith(mockedToken);
    });
  });
});
