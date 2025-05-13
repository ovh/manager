import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import * as databaseAPI from '@/data/api/database/backup.api';
import * as database from '@/types/cloud/project/database';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import { mockedBackup } from '@/__tests__/helpers/mocks/backup';
import { useGetBackups } from './useGetBackups.hook';

vi.mock('@/data/api/database/backup.api', () => ({
  getServiceBackups: vi.fn(),
}));

describe('useGetBackups', () => {
  it('should return Services Backup', async () => {
    const projectId = 'projectId';
    const engine = database.EngineEnum.mysql;
    const serviceId = 'serviceId';

    vi.mocked(databaseAPI.getServiceBackups).mockResolvedValue([mockedBackup]);

    const { result } = renderHook(
      () => useGetBackups(projectId, engine, serviceId),
      { wrapper: QueryClientWrapper },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual([mockedBackup]);
      expect(databaseAPI.getServiceBackups).toHaveBeenCalledWith({
        projectId,
        engine,
        serviceId,
      });
    });
  });
});
