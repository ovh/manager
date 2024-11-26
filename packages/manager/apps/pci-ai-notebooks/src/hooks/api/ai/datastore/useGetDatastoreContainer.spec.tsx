import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as datastoreApi from '@/data/api/ai/datastore.api';
import { getDatastoreContainer } from '@/data/api/ai/datastore.api';
import { mockedContainer } from '@/__tests__/helpers/mocks/container';
import { useGetDatastoreContainer } from './useGetDatastoreContainer.hook';

vi.mock('@/data/api/ai/datastore.api', () => ({
  getDatastoreContainer: vi.fn(),
}));

describe('useGetDatastoreContainer', () => {
  it('should return Container in Datastore', async () => {
    const projectId = 'projectId';
    const region = 'region';
    const alias = 'alias';

    vi.mocked(datastoreApi.getDatastoreContainer).mockResolvedValue(
      mockedContainer,
    );

    const { result } = renderHook(
      () => useGetDatastoreContainer(projectId, region, alias),
      {
        wrapper: QueryClientWrapper,
      },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual(mockedContainer);
      expect(datastoreApi.getDatastoreContainer).toHaveBeenCalledWith({
        projectId,
        region,
        alias,
      });
    });
  });
});
