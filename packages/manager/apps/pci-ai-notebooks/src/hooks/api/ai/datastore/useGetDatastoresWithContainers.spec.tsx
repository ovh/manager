import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as datastoreApi from '@/data/api/ai/datastore.api';
import { mockedDatastore } from '@/__tests__/helpers/mocks/datastore';
import { mockedCapabilitiesRegion } from '@/__tests__/helpers/mocks/region';
import { useGetDatastoresWithContainers } from './useGetDatastoresWithContainers.hook';
import { mockedContainer } from '@/__tests__/helpers/mocks/container';

vi.mock('@/data/api/ai/datastore.api', () => ({
  getDatastores: vi.fn(),
  getDatastoreContainer: vi.fn(),
}));

const mockedResut = [
  {
    id: 's3 - alias - container1',
    container: 'container1',
    alias: 'alias',
    type: 's3',
    endpoint: 'endpoint',
    owner: 'customer',
  },
  {
    id: 's3 - alias - container2',
    container: 'container2',
    alias: 'alias',
    type: 's3',
    endpoint: 'endpoint',
    owner: 'customer',
  },
];

describe('useGetDatastoresWithContainers', () => {
  it('should return Datastores', async () => {
    const projectId = 'projectId';
    const region = mockedCapabilitiesRegion;
    const datastores = [mockedDatastore];

    vi.mocked(datastoreApi.getDatastores).mockResolvedValue([mockedDatastore]);
    vi.mocked(datastoreApi.getDatastoreContainer).mockResolvedValue(
      mockedContainer,
    );

    const { result } = renderHook(
      () => useGetDatastoresWithContainers(projectId, region.id, datastores),
      {
        wrapper: QueryClientWrapper,
      },
    );

    await waitFor(() => {
      expect(result.current.data).toEqual(mockedResut);
      expect(datastoreApi.getDatastoreContainer).toHaveBeenCalledWith({
        projectId,
        region: region.id,
        alias: 'alias',
      });
    });
  });
});
