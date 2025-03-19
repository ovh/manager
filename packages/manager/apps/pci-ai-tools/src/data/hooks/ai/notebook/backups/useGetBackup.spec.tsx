import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as backupApi from '@/data/api/ai/notebook/backups/backups.api';
import { useGetBackup } from './useGetBackup.hook';
import { mockedBackup } from '@/__tests__/helpers/mocks/notebook/backup';

vi.mock('@/data/api/ai/notebook/backups/backups.api', () => ({
  getBackup: vi.fn(),
}));

describe('useGetBackup', () => {
  it('should return Backup', async () => {
    const projectId = 'projectId';
    const notebookId = 'notebookId';
    const backupId = 'backupId';

    vi.mocked(backupApi.getBackup).mockResolvedValue(mockedBackup);

    const { result } = renderHook(
      () => useGetBackup(projectId, notebookId, backupId),
      {
        wrapper: QueryClientWrapper,
      },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual(mockedBackup);
      expect(backupApi.getBackup).toHaveBeenCalledWith({
        projectId,
        notebookId,
        backupId,
      });
    });
  });
});
