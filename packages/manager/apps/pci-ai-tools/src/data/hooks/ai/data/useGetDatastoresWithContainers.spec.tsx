import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as datastoreApi from '@/data/api/ai/data/datastore.api';
import { mockedCapabilitiesRegionGRA } from '@/__tests__/helpers/mocks/capabilities/region';
import { useGetDatastoresWithContainers } from './useGetDatastoresWithContainers.hook';
import {
  mockedContainer,
  mockedDatastoreS3,
} from '@/__tests__/helpers/mocks/volume/datastore';

vi.mock('@/data/api/ai/data/datastore.api', () => ({
  getDatastores: vi.fn(),
  getDatastoreContainer: vi.fn(),
}));

const mockedResut = [
  {
    id: 's3 - myDatastoreS3',
    container: ['container1', 'container2'],
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
