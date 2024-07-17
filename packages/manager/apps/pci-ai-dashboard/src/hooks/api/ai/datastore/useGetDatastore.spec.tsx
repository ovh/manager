import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as datastoreApi from '@/data/api/ai/datastore.api';
import { mockedDatastore } from '@/__tests__/helpers/mocks/datastore';
import { useGetDatastore } from './useGetDatastore.hook';

vi.mock('@/data/api/ai/datastore.api', () => ({
  getDatastore: vi.fn(),
}));

describe('useGetDatastores', () => {
  it('should return Datastores', async () => {
    const projectId = 'projectId';
    const region = 'region';
    const alias = 'alias';

    vi.mocked(datastoreApi.getDatastore).mockResolvedValue(mockedDatastore);

    const { result } = renderHook(
      () => useGetDatastore(projectId, region, alias),
      { wrapper: QueryClientWrapper },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual(mockedDatastore);
      expect(datastoreApi.getDatastore).toHaveBeenCalledWith({
        projectId,
        region,
        alias,
      });
    });
  });
});
