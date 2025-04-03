import { apiClient } from '@ovh-ux/manager-core-api';
import { describe, expect, vi } from 'vitest';
import { addUser, getUsers } from '@/data/api/user/user.api';
import { mockedUserCreation } from '@/__tests__/helpers/mocks/user';

describe('User functions', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should call getUser', async () => {
    expect(apiClient.v6.get).not.toHaveBeenCalled();
    await getUsers({
      projectId: 'projectId',
    });
    expect(apiClient.v6.get).toHaveBeenCalledWith(
      '/cloud/project/projectId/user',
    );
  });

  it('should call addUser with User', async () => {
    expect(apiClient.v6.post).not.toHaveBeenCalled();
    await addUser({
      projectId: 'projectId',
      newUser: mockedUserCreation,
    });
    expect(apiClient.v6.post).toHaveBeenCalledWith(
      '/cloud/project/projectId/user',
      mockedUserCreation,
    );
  });
});
