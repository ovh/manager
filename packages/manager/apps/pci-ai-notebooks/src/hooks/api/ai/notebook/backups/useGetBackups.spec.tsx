import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as backupApi from '@/data/api/ai/notebook/backups/backups.api';
import { mockedBackup } from '@/__tests__/helpers/mocks/notebook/backup';
import { useGetBackups } from './useGetBackups.hook';

vi.mock('@/data/api/ai/notebook/backups/backups.api', () => ({
  getBackups: vi.fn(),
}));

describe('useGetBackups', () => {
  it('should return Backups', async () => {
    const projectId = 'projectId';
    const notebookId = 'notebookId';

    vi.mocked(backupApi.getBackups).mockResolvedValue([mockedBackup]);

    const { result } = renderHook(() => useGetBackups(projectId, notebookId), {
      wrapper: QueryClientWrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual([mockedBackup]);
      expect(backupApi.getBackups).toHaveBeenCalledWith({
        projectId,
        notebookId,
      });
    });
  });
});
