import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as backupApi from '@/data/api/ai/notebook/backups/backups.api';
import { mockedNotebook } from '@/__tests__/helpers/mocks/notebook/notebook';
import { useForkBackup } from './useForkBackup.hook';

vi.mock('@/data/api/ai/notebook/backups/backups.api', () => ({
  forkBackup: vi.fn(),
}));

describe('useForkBackup', () => {
  it('should call useForkBackup on mutation', async () => {
    const projectId = 'projectId';
    const notebookId = 'notebookId';
    const backupId = 'backupId';
    const onSuccess = vi.fn();
    const onError = vi.fn();

    vi.mocked(backupApi.forkBackup).mockResolvedValue(mockedNotebook);
    const { result } = renderHook(() => useForkBackup({ onError, onSuccess }), {
      wrapper: QueryClientWrapper,
    });

    const forkBackupProps = {
      projectId,
      notebookId,
      backupId,
    };
    result.current.forkBackup(forkBackupProps);

    await waitFor(() => {
      expect(backupApi.forkBackup).toHaveBeenCalledWith(forkBackupProps);
      expect(onSuccess).toHaveBeenCalledWith(mockedNotebook);
    });
  });
});
