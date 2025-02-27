import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as datastoreApi from '@/data/api/ai/datastore.api';
import {
  mockedContainer,
  mockedDatastoreS3,
} from '@/__tests__/helpers/mocks/volume/datastore';
import { mockedCapabilitiesRegionGRA } from '@/__tests__/helpers/mocks/capabilities/region';
import { useGetDatastoresWithContainers } from './useGetDatastoresWithContainers.hook';

vi.mock('@/data/api/ai/datastore.api', () => ({
  getDatastores: vi.fn(),
  getDatastoreContainer: vi.fn(),
}));

const mockedResut = [
  {
    id: 's3 - myDatastoreS3 - container1',
    container: 'container1',
    alias: 'myDatastoreS3',
    type: 's3',
    endpoint: 'endpoint',
    owner: 'customer',
  },
  {
    id: 's3 - myDatastoreS3 - container2',
    container: 'container2',
    alias: 'myDatastoreS3',
    type: 's3',
    endpoint: 'endpoint',
    owner: 'customer',
  },
];

describe('useGetDatastoresWithContainers', () => {
  it('should return Datastores', async () => {
    const projectId = 'projectId';
    const region = mockedCapabilitiesRegionGRA;
    const datastores = [mockedDatastoreS3];

    vi.mocked(datastoreApi.getDatastores).mockResolvedValue([
      mockedDatastoreS3,
    ]);
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
        alias: 'myDatastoreS3',
      });
    });
  });
});
