import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as sshkeyApi from '@/data/api/sshkey/sshkey.api';
import { useGetSshkey } from './useGetSshkey.hook';
import { mockedSshKey } from '@/__tests__/helpers/mocks/sshkey';

vi.mock('@/data/api/sshkey/sshkey.api', () => ({
  getSshkey: vi.fn(),
}));

describe('useGetSshkey', () => {
  it('should return sshkey', async () => {
    const projectId = 'projectId';

    vi.mocked(sshkeyApi.getSshkey).mockResolvedValue([mockedSshKey]);

    const { result } = renderHook(() => useGetSshkey(projectId), {
      wrapper: QueryClientWrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual([mockedSshKey]);
      expect(sshkeyApi.getSshkey).toHaveBeenCalledWith({
        projectId,
      });
    });
  });
});
