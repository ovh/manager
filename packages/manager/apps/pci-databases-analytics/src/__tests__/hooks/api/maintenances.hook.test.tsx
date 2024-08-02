import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import {
  useGetMaintenances,
  useApplyMaintenance,
} from '@/hooks/api/maintenances.api.hooks';
import * as databaseAPI from '@/api/databases/maintenances';
import { database } from '@/models/database';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import { mockedMaintenance } from '@/__tests__/helpers/mocks/maintenances';

vi.mock('@/api/databases/maintenances', () => ({
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

describe('useApplyMaintenance', () => {
  it('should call useApplyMaintenance on mutation with data', async () => {
    const projectId = 'projectId';
    const engine = database.EngineEnum.mysql;
    const serviceId = 'serviceId';
    const onSuccess = vi.fn();
    const onError = vi.fn();

    vi.mocked(databaseAPI.applyMaintenance).mockResolvedValue(
      mockedMaintenance,
    );
    const { result } = renderHook(
      () => useApplyMaintenance({ onError, onSuccess }),
      { wrapper: QueryClientWrapper },
    );

    const applyMaintenanceProps = {
      projectId,
      engine,
      serviceId,
      maintenanceId: 'maintenanceId',
    };
    result.current.applyMaintenance(applyMaintenanceProps);

    await waitFor(() => {
      expect(databaseAPI.applyMaintenance).toHaveBeenCalledWith(
        applyMaintenanceProps,
      );
      expect(onSuccess).toHaveBeenCalledWith(
        mockedMaintenance,
        applyMaintenanceProps,
        undefined,
      );
    });
  });
});
