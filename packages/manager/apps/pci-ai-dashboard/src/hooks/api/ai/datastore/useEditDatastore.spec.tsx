import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as datastoreApi from '@/data/api/ai/datastore.api';
import {
  mockedDatastore,
  mockedDatastoreInput,
} from '@/__tests__/helpers/mocks/datastore';
import { useEditDatastore } from './useEditDatastore.hook';

vi.mock('@/data/api/ai/datastore.api', () => ({
  editDatastore: vi.fn(),
}));

describe('useEditDatastore', () => {
  it('should call useEditDatastore on mutation with data', async () => {
    const projectId = 'projectId';
    const region = 'region';
    const alias = 'alias';
    const onSuccess = vi.fn();
    const onError = vi.fn();

    vi.mocked(datastoreApi.editDatastore).mockResolvedValue(mockedDatastore);
    const { result } = renderHook(
      () => useEditDatastore({ onError, onSuccess }),
      { wrapper: QueryClientWrapper },
    );

    const editDatastoreProps = {
      projectId,
      region,
      alias,
      datastore: mockedDatastoreInput,
    };
    result.current.editDatastore(editDatastoreProps);

    await waitFor(() => {
      expect(datastoreApi.editDatastore).toHaveBeenCalledWith(
        editDatastoreProps,
      );
      expect(onSuccess).toHaveBeenCalledWith(
        mockedDatastore,
        editDatastoreProps,
        undefined,
      );
    });
  });
});
