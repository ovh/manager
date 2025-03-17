import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as datastoreApi from '@/data/api/ai/data/datastore.api';
import { useGetDatastores } from './useGetDatastores.hook';
import { mockedDatastoreS3 } from '@/__tests__/helpers/mocks/volume/datastore';

vi.mock('@/data/api/ai/data/datastore.api', () => ({
  getDatastores: vi.fn(),
}));

describe('useGetDatastores', () => {
  it('should return Datastores', async () => {
    const projectId = 'projectId';
    const region = 'region';

    vi.mocked(datastoreApi.getDatastores).mockResolvedValue([
      mockedDatastoreS3,
    ]);

    const { result } = renderHook(() => useGetDatastores(projectId, region), {
      wrapper: QueryClientWrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual([mockedDatastoreS3]);
      expect(datastoreApi.getDatastores).toHaveBeenCalledWith({
        projectId,
        region,
      });
    });
  });
});
