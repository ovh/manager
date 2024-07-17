import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as datastoreApi from '@/data/api/ai/datastore.api';
import { mockedDatastore } from '@/__tests__/helpers/mocks/datastore';
import { useGetDatastores } from './useGetDatastores.hook';

vi.mock('@/data/api/ai/datastore.api', () => ({
  getDatastores: vi.fn(),
}));

describe('useGetDatastores', () => {
  it('should return Datastores', async () => {
    const projectId = 'projectId';
    const region = 'region';

    vi.mocked(datastoreApi.getDatastores).mockResolvedValue([mockedDatastore]);

    const { result } = renderHook(() => useGetDatastores(projectId, region), {
      wrapper: QueryClientWrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual([mockedDatastore]);
      expect(datastoreApi.getDatastores).toHaveBeenCalledWith({
        projectId,
        region,
      });
    });
  });
});
