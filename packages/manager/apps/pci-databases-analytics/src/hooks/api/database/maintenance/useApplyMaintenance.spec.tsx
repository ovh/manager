import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import * as databaseAPI from '@/data/api/database/maintenance.api';
import * as database from '@/types/cloud/project/database';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import { mockedMaintenance } from '@/__tests__/helpers/mocks/maintenances';
import { useApplyMaintenance } from './useApplyMaintenance.hook';

vi.mock('@/data/api/database/maintenance.api', () => ({
  getMaintenances: vi.fn(),
  applyMaintenance: vi.fn(),
}));

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
