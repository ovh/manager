import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import * as databaseAPI from '@/data/api/database/backup.api';
import * as database from '@/types/cloud/project/database';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import { mockedBackup } from '@/__tests__/helpers/mocks/backup';
import { useRestoreBackup } from './useRestoreBackup.hook';

vi.mock('@/data/api/database/backup.api', () => ({
  restoreBackup: vi.fn(),
}));

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
