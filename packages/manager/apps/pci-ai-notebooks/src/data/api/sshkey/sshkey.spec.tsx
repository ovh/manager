import { apiClient } from '@ovh-ux/manager-core-api';
import { describe, expect, vi } from 'vitest';
import { addSSHKey, getSshkey } from '@/data/api/sshkey/sshkey.api';
import { mockedSshKey } from '@/__tests__/helpers/mocks/sshkey';

vi.mock('@ovh-ux/manager-core-api', () => {
  const get = vi.fn(() => {
    return Promise.resolve({ data: null });
  });
  const post = vi.fn(() => {
    return Promise.resolve({ data: null });
  });
  return {
    apiClient: {
      v6: {
        get,
        post,
      },
    },
  };
});

describe('sshkey functions', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should call getSshkey', async () => {
    expect(apiClient.v6.get).not.toHaveBeenCalled();
    await getSshkey({
      projectId: 'projectId',
    });
    expect(apiClient.v6.get).toHaveBeenCalledWith(
      '/cloud/project/projectId/sshkey',
      {
        headers: {
          'X-Pagination-Mode': 'CachedObjectList-Pages',
          'X-Pagination-Size': '50000',
        },
      },
    );
  });

  it('should call addSshKey', async () => {
    expect(apiClient.v6.post).not.toHaveBeenCalled();
    await addSSHKey({
      projectId: 'projectId',
      sshKey: mockedSshKey,
    });
    expect(apiClient.v6.post).toHaveBeenCalledWith(
      '/cloud/project/projectId/sshkey',
      {
        id: 'idSSHKEY',
        name: 'nameSSHKEY',
        publicKey: 'publicKey',
        regions: ['GRA'],
      },
    );
  });
});
