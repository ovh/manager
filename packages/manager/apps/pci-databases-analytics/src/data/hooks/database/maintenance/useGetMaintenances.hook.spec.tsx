import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import * as databaseAPI from '@/data/api/database/maintenance.api';
import * as database from '@/types/cloud/project/database';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import { mockedMaintenance } from '@/__tests__/helpers/mocks/maintenances';
import { useGetMaintenances } from './useGetMaintenances.hook';

vi.mock('@/data/api/database/maintenance.api', () => ({
  getMaintenances: vi.fn(),
  applyMaintenance: vi.fn(),
}));

describe('useGetMaintenances', () => {
  it('should return service maintenances', async () => {
    const projectId = 'projectId';
    const engine = database.EngineEnum.mysql;
    const serviceId = 'serviceId';

    vi.mocked(databaseAPI.getMaintenances).mockResolvedValue([
      mockedMaintenance,
    ]);

    const { result } = renderHook(
      () => useGetMaintenances(projectId, engine, serviceId),
      { wrapper: QueryClientWrapper },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual([mockedMaintenance]);
      expect(databaseAPI.getMaintenances).toHaveBeenCalledWith({
        projectId,
        engine,
        serviceId,
      });
    });
  });
});
