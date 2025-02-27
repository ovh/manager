import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as datastoreApi from '@/data/api/ai/datastore.api';
import {
  mockedDatastore,
  mockedDatastoreInput,
} from '@/__tests__/helpers/mocks/volume/datastore';
import { useAddDatastore } from './useAddDatastore.hook';

vi.mock('@/data/api/ai/datastore.api', () => ({
  addDatastore: vi.fn(),
}));

describe('useAddDatastore', () => {
  it('should call useAddDatastore on mutation with data', async () => {
    const projectId = 'projectId';
    const region = 'region';
    const onAddSuccess = vi.fn();
    const onError = vi.fn();

    vi.mocked(datastoreApi.addDatastore).mockResolvedValue(mockedDatastore);
    const { result } = renderHook(
      () => useAddDatastore({ onError, onAddSuccess }),
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
      expect(onAddSuccess).toHaveBeenCalledWith(mockedDatastore);
    });
  });
});
