import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as datastoreApi from '@/data/api/ai/datastore.api';
import { mockedDatastoreAuth } from '@/__tests__/helpers/mocks/datastore';
import { useGetDatastoreAuth } from './useGetDatastoreAuth.hook';

vi.mock('@/data/api/ai/datastore.api', () => ({
  getDatastoreAuth: vi.fn(),
}));

describe('useGetDatastoreAuth', () => {
  it('should return Datastore Auth', async () => {
    const projectId = 'projectId';
    const region = 'region';
    const alias = 'alias';

    vi.mocked(datastoreApi.getDatastoreAuth).mockResolvedValue(
      mockedDatastoreAuth,
    );

    const { result } = renderHook(
      () => useGetDatastoreAuth(projectId, region, alias),
      { wrapper: QueryClientWrapper },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual(mockedDatastoreAuth);
      expect(datastoreApi.getDatastoreAuth).toHaveBeenCalledWith({
        projectId,
        region,
        alias,
      });
    });
  });
});
