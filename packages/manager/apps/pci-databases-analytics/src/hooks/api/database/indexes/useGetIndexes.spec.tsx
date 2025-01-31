import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import { useGetIndexes } from './useGetIndexes.hook';
import * as indexesApi from '@/data/api/database/indexes.api';
import * as database from '@/types/cloud/project/database';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import { mockedIndex } from '@/__tests__/helpers/mocks/indexes';

vi.mock('@/data/api/database/indexes.api', () => ({
  getIndexes: vi.fn(),
}));

describe('useGetIndexes', () => {
  it('should return Indexes data', async () => {
    const projectId = 'projectId';
    const engine = database.EngineEnum.m3db;
    const serviceId = 'serviceId';

    vi.mocked(indexesApi.getIndexes).mockResolvedValue([mockedIndex]);

    const { result } = renderHook(
      () => useGetIndexes(projectId, engine, serviceId),
      { wrapper: QueryClientWrapper },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual([mockedIndex]);
      expect(indexesApi.getIndexes).toHaveBeenCalledWith({
        projectId,
        engine,
        serviceId,
      });
    });
  });
});
