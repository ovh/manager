import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as datastoreApi from '@/data/api/ai/data/datastore.api';
import { useAddDatastore } from './useAddDatastore.hook';
import {
  mockedDatastoreInputGit,
  mockedDatastoreS3,
} from '@/__tests__/helpers/mocks/volume/datastore';

vi.mock('@/data/api/ai/datastore.api', () => ({
  addDatastore: vi.fn(),
}));

describe('useAddDatastore', () => {
  it('should call useAddDatastore on mutation with data', async () => {
    const projectId = 'projectId';
    const region = 'region';
    const onAddSuccess = vi.fn();
    const onError = vi.fn();

    vi.mocked(datastoreApi.addDatastore).mockResolvedValue(mockedDatastoreS3);
    const { result } = renderHook(
      () => useAddDatastore({ onError, onAddSuccess }),
      { wrapper: QueryClientWrapper },
    );

    const addDatastoreProps = {
      projectId,
      region,
      datastore: mockedDatastoreInputGit,
    };
    result.current.addDatastore(addDatastoreProps);

    await waitFor(() => {
      expect(datastoreApi.addDatastore).toHaveBeenCalledWith(addDatastoreProps);
      expect(onAddSuccess).toHaveBeenCalledWith(mockedDatastoreS3);
    });
  });
});
