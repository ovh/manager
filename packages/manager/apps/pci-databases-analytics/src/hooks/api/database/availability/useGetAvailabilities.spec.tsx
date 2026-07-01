import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import * as databaseAPI from '@/data/api/database/availability.api';
import * as database from '@/types/cloud/project/database';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';

import { mockedAvailabilities } from '@/__tests__/helpers/mocks/availabilities';
import { useGetAvailabilities } from './useGetAvailabilities.hook';

vi.mock('@/data/api/database/availability.api', () => ({
  getAvailabilities: vi.fn(),
}));

describe('useGetAvailabilities', () => {
  it('should return Availabilities', async () => {
    const projectId = 'projectId';
    const serviceId = 'serviceId';

    vi.mocked(databaseAPI.getAvailabilities).mockResolvedValue([
      mockedAvailabilities,
    ]);

    const { result } = renderHook(
      () => useGetAvailabilities(projectId, serviceId),
      { wrapper: QueryClientWrapper },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual([mockedAvailabilities]);
      expect(databaseAPI.getAvailabilities).toHaveBeenCalledWith({
        projectId,
        serviceId,
      });
    });
  });

  it('should forward the status filter (e.g. no filter for the self target)', async () => {
    const projectId = 'projectId';
    const serviceId = 'serviceId';

    vi.mocked(databaseAPI.getAvailabilities).mockResolvedValue([
      mockedAvailabilities,
    ]);

    const { result } = renderHook(
      () =>
        useGetAvailabilities(
          projectId,
          serviceId,
          undefined,
          database.availability.TargetEnum.self,
          [],
        ),
      { wrapper: QueryClientWrapper },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(databaseAPI.getAvailabilities).toHaveBeenCalledWith({
        projectId,
        serviceId,
        target: database.availability.TargetEnum.self,
        status: [],
      });
    });
  });
});
