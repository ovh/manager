import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as sshkeyApi from '@/data/api/sshkey/sshkey.api';
import {
  mockedSshKey,
  mockedSshKeyDetail,
} from '@/__tests__/helpers/mocks/sshkey';
import { useAddSshKey } from './useAddSshKey.hook';

vi.mock('@/data/api/sshkey/sshkey.api', () => ({
  addSSHKey: vi.fn(),
}));

describe('useAddSshKey', () => {
  it('should create a SshKey', async () => {
    const onAddKeySuccess = vi.fn();
    const onError = vi.fn();

    vi.mocked(sshkeyApi.addSSHKey).mockResolvedValue(mockedSshKeyDetail);

    const { result } = renderHook(
      () => useAddSshKey({ onError, onAddKeySuccess }),
      {
        wrapper: QueryClientWrapper,
      },
    );

    const addSshKeyProps: sshkeyApi.AddSSHKey = {
      projectId: 'projectId',
      sshKey: mockedSshKey,
    };

    result.current.addSSHKey(addSshKeyProps);

    await waitFor(() => {
      expect(sshkeyApi.addSSHKey).toHaveBeenCalledWith(addSshKeyProps);
    });
  });
});
