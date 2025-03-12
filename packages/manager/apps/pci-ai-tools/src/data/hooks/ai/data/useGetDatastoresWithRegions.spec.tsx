import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as datastoreApi from '@/data/api/ai/data/datastore.api';

import { useGetDatastoresWithRegions } from './useGetDatastoresWithRegions.hook';
import { mockedCapabilitiesRegionGRA } from '@/__tests__/helpers/mocks/capabilities/region';
import {
  mockedDatastoreS3,
  mockedDatastoreS3WithRegion,
} from '@/__tests__/helpers/mocks/volume/datastore';

vi.mock('@/data/api/ai/datastore.api', () => ({
  getDatastores: vi.fn(),
}));

describe('useGetDatastoresWithRegions', () => {
  it('should return Datastores', async () => {
    const projectId = 'projectId';
    const regions = [mockedCapabilitiesRegionGRA];

    vi.mocked(datastoreApi.getDatastores).mockResolvedValue([
      mockedDatastoreS3,
    ]);

    const { result } = renderHook(
      () => useGetDatastoresWithRegions(projectId, regions),
      {
        wrapper: QueryClientWrapper,
      },
    );

    await waitFor(() => {
      expect(result.current.data).toEqual([mockedDatastoreS3WithRegion]);
      expect(datastoreApi.getDatastores).toHaveBeenCalledWith({
        projectId,
        region: mockedCapabilitiesRegionGRA.id,
      });
    });
  });
});
