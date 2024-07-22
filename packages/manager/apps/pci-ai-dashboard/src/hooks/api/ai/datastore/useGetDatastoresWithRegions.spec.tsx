import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as datastoreApi from '@/data/api/ai/datastore.api';
import {
  mockedDatastore,
  mockedDatastoreWithRegion,
} from '@/__tests__/helpers/mocks/datastore';
import { useGetDatastoresWithRegions } from './useGetDatastoresWithRegions.hook';
import { mockedCapabilitiesRegion } from '@/__tests__/helpers/mocks/region';

vi.mock('@/data/api/ai/datastore.api', () => ({
  getDatastores: vi.fn(),
}));

describe('useGetDatastoresWithRegions', () => {
  it('should return Datastores', async () => {
    const projectId = 'projectId';
    const regions = [mockedCapabilitiesRegion];

    vi.mocked(datastoreApi.getDatastores).mockResolvedValue([mockedDatastore]);

    const { result } = renderHook(
      () => useGetDatastoresWithRegions(projectId, regions),
      {
        wrapper: QueryClientWrapper,
      },
    );

    await waitFor(() => {
      expect(result.current.data).toEqual([mockedDatastoreWithRegion]);
      expect(datastoreApi.getDatastores).toHaveBeenCalledWith({
        projectId,
        region: mockedCapabilitiesRegion.id,
      });
    });
  });
});
