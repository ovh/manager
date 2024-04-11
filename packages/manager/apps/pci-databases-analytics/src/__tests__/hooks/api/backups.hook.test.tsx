import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { useGetBackups, useRestoreBackup } from '@/hooks/api/backups.api.hooks';

import * as databaseAPI from '@/api/databases/backups';
import { database } from '@/models/database';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import { mockedBackup } from '@/__tests__/helpers/mocks/backup';

vi.mock('@/api/databases/backups', () => ({
  getServiceBackups: vi.fn(),
  restoreBackup: vi.fn(),
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

describe('useRestoreBackup', () => {
  it('should call useRestoreBackup on mutation with backUpId', async () => {
    const projectId = 'projectId';
    const engine = database.EngineEnum.mysql;
    const serviceId = 'serviceId';
    const mockRestoreData = {
      backupId: 'backupId',
    };
    const onSuccess = vi.fn();
    const onError = vi.fn();

    vi.mocked(databaseAPI.restoreBackup).mockResolvedValue(mockedBackup);
    const { result } = renderHook(
      () => useRestoreBackup({ onError, onSuccess }),
      { wrapper: QueryClientWrapper },
    );

    const updateProps = {
      projectId,
      engine,
      serviceId,
      mockRestoreData,
    };
    result.current.restoreBackup(updateProps);

    await waitFor(() => {
      expect(databaseAPI.restoreBackup).toHaveBeenCalledWith(updateProps);
      expect(onSuccess).toHaveBeenCalledWith(
        mockedBackup,
        updateProps,
        undefined,
      );
    });
  });
});

describe('useRestoreBackup', () => {
  it('should call useRestoreBackup on mutation with Restore', async () => {
    const projectId = 'projectId';
    const engine = database.EngineEnum.mysql;
    const serviceId = 'serviceId';
    const mockRestoreData = {
      restore: {
        pointInTime: 'yesterday',
      },
    };
    const onSuccess = vi.fn();
    const onError = vi.fn();

    vi.mocked(databaseAPI.restoreBackup).mockResolvedValue(mockedBackup);
    const { result } = renderHook(
      () => useRestoreBackup({ onError, onSuccess }),
      { wrapper: QueryClientWrapper },
    );

    const updateProps = {
      projectId,
      engine,
      serviceId,
      mockRestoreData,
    };
    result.current.restoreBackup(updateProps);

    await waitFor(() => {
      expect(databaseAPI.restoreBackup).toHaveBeenCalledWith(updateProps);
      expect(onSuccess).toHaveBeenCalledWith(
        mockedBackup,
        updateProps,
        undefined,
      );
    });
  });
});
