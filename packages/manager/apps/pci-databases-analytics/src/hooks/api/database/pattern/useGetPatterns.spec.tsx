import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import { useGetPatterns } from './useGetPatterns.hook';
import * as databaseAPI from '@/data/api/database/pattern.api';
import * as database from '@/types/cloud/project/database';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import { mockedPattern } from '@/__tests__/helpers/mocks/patterns';

vi.mock('@/data/api/database/pattern.api', () => ({
  getPatterns: vi.fn(),
}));

describe('useGetPatterns', () => {
  it('should return Patterns data', async () => {
    const projectId = 'projectId';
    const engine = database.EngineEnum.m3db;
    const serviceId = 'serviceId';

    vi.mocked(databaseAPI.getPatterns).mockResolvedValue([mockedPattern]);

    const { result } = renderHook(
      () => useGetPatterns(projectId, engine, serviceId),
      { wrapper: QueryClientWrapper },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual([mockedPattern]);
      expect(databaseAPI.getPatterns).toHaveBeenCalledWith({
        projectId,
        engine,
        serviceId,
      });
    });
  });
});
