import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as datastoreApi from '@/data/api/apiDatastore';
import {
  mockedDatastore,
  mockedDatastoreInput,
} from '@/__tests__/helpers/mocks/datastore';
import { useAddDatastore } from './useAddDatastore';

vi.mock('@/data/api/apiDatastore', () => ({
  addDatastore: vi.fn(),
}));

describe('useAddDatastore', () => {
  it('should call useAddDatastore on mutation with data', async () => {
    const projectId = 'projectId';
    const region = 'region';
    const onSuccess = vi.fn();
    const onError = vi.fn();

    vi.mocked(datastoreApi.addDatastore).mockResolvedValue(mockedDatastore);
    const { result } = renderHook(
      () => useAddDatastore({ onError, onSuccess }),
      { wrapper: QueryClientWrapper },
    );

    const addDatastoreProps = {
      projectId,
      region,
      datastore: mockedDatastoreInput,
    };
    result.current.addDatastore(addDatastoreProps);

    await waitFor(() => {
      expect(datastoreApi.addDatastore).toHaveBeenCalledWith(addDatastoreProps);
      expect(onSuccess).toHaveBeenCalledWith(
        mockedDatastore,
        addDatastoreProps,
        undefined,
      );
    });
  });
});
