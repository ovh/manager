import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as authApi from '@/data/api/ai/authorization.api';
import {
  mockedDatastore,
  mockedDatastoreInput,
} from '@/__tests__/helpers/mocks/datastore';
import { usePostAuthorization } from './usePostAuthorization.hook';
import { mockedAuthorization } from '@/__tests__/helpers/mocks/authorization';

vi.mock('@/data/api/ai/authorization.api', () => ({
  postAuthorization: vi.fn(),
}));

describe('usePostAuthorization', () => {
  it('should call usePostAuthorization on mutation with data', async () => {
    const projectId = 'projectId';
    const onSuccess = vi.fn();
    const onError = vi.fn();

    vi.mocked(authApi.postAuthorization).mockResolvedValue(mockedAuthorization);
    const { result } = renderHook(
      () => usePostAuthorization({ onError, onSuccess }),
      { wrapper: QueryClientWrapper },
    );

    const postDatastoreProps = {
      projectId,
    };
    result.current.postAuthorization(postDatastoreProps);

    await waitFor(() => {
      expect(authApi.postAuthorization).toHaveBeenCalledWith(
        postDatastoreProps,
      );
      expect(onSuccess).toHaveBeenCalledWith(
        mockedAuthorization,
        postDatastoreProps,
        undefined,
      );
    });
  });
});
