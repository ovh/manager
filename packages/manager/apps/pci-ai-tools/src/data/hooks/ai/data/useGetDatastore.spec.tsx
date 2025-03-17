import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as datastoreApi from '@/data/api/ai/data/datastore.api';
import { mockedDatastoreS3 } from '@/__tests__/helpers/mocks/volume/datastore';
import { useGetDatastore } from './useGetDatastore.hook';

vi.mock('@/data/api/ai/data/datastore.api', () => ({
  getDatastore: vi.fn(),
}));

describe('useGetDatastores', () => {
  it('should return Datastores', async () => {
    const projectId = 'projectId';
    const region = 'region';
    const alias = 'alias';

    vi.mocked(datastoreApi.getDatastore).mockResolvedValue(mockedDatastoreS3);

    const { result } = renderHook(
      () => useGetDatastore(projectId, region, alias),
      { wrapper: QueryClientWrapper },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual(mockedDatastoreS3);
      expect(datastoreApi.getDatastore).toHaveBeenCalledWith({
        projectId,
        region,
        alias,
      });
    });
  });
});
