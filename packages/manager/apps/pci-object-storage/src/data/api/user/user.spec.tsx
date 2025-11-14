import { apiClient } from '@ovh-ux/manager-core-api';
import { describe, expect, vi } from 'vitest';
import {
  addS3Credentials,
  addUser,
  addUserPolicy,
  deleteS3Credentials,
  getUser,
  getUserPolicy,
  getUserRclone,
  getUserSecretKey,
  getUsers,
} from './user.api';
import user from '@/types/User';

describe('User functions', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should call getUsers', async () => {
    expect(apiClient.v6.get).not.toHaveBeenCalled();
    await getUsers({
      projectId: 'projectId',
    });
    expect(apiClient.v6.get).toHaveBeenCalledWith(
      '/cloud/project/projectId/user',
      undefined,
    );
  });

  it('should call addUser', async () => {
    expect(apiClient.v6.post).not.toHaveBeenCalled();
    await addUser({
      projectId: 'projectId',
      newUser: {
        description: 'myUserDesc',
        role: user.RoleEnum.objectstore_operator,
      },
    });
    expect(apiClient.v6.post).toHaveBeenCalledWith(
      '/cloud/project/projectId/user',
      {
        description: 'myUserDesc',
        role: user.RoleEnum.objectstore_operator,
      },
      undefined,
    );
  });

  it('should call getUser', async () => {
    expect(apiClient.v6.get).not.toHaveBeenCalled();
    await getUser({
      projectId: 'projectId',
      userId: 123,
    });
    expect(apiClient.v6.get).toHaveBeenCalledWith(
      '/cloud/project/projectId/user/123',
      undefined,
    );
  });

  it('should call getUserPolicy', async () => {
    expect(apiClient.v6.get).not.toHaveBeenCalled();
    await getUserPolicy({
      projectId: 'projectId',
      userId: 123,
    });
    expect(apiClient.v6.get).toHaveBeenCalledWith(
      '/cloud/project/projectId/user/123/policy',
      undefined,
    );
  });

  it('should call getUserRclone', async () => {
    expect(apiClient.v6.get).not.toHaveBeenCalled();
    await getUserRclone({
      projectId: 'projectId',
      userId: 123,
      region: 'BHS',
    });
    expect(apiClient.v6.get).toHaveBeenCalledWith(
      '/cloud/project/projectId/user/123/rclone?region=BHS',
      undefined,
    );
  });

  it('should call getUserSecretKey', async () => {
    expect(apiClient.v6.post).not.toHaveBeenCalled();
    await getUserSecretKey({
      projectId: 'projectId',
      userId: 123,
      accessKey: 'accessKey',
    });
    expect(apiClient.v6.post).toHaveBeenCalledWith(
      '/cloud/project/projectId/user/123/s3Credentials/accessKey/secret',
      undefined,
      undefined,
    );
  });

  it('should call addS3Credentials', async () => {
    expect(apiClient.v6.post).not.toHaveBeenCalled();
    await addS3Credentials({
      projectId: 'projectId',
      userId: 123,
    });
    expect(apiClient.v6.post).toHaveBeenCalledWith(
      '/cloud/project/projectId/user/123/s3Credentials',
      undefined,
      undefined,
    );
  });

  it('should call deleteS3Credentials', async () => {
    expect(apiClient.v6.delete).not.toHaveBeenCalled();
    await deleteS3Credentials({
      projectId: 'projectId',
      userId: 123,
      accessKey: 'accessKey',
    });
    expect(apiClient.v6.delete).toHaveBeenCalledWith(
      '/cloud/project/projectId/user/123/s3Credentials/accessKey',
      undefined,
    );
  });

  it('should call addUserPolicy', async () => {
    expect(apiClient.v6.post).not.toHaveBeenCalled();
    await addUserPolicy({
      projectId: 'projectId',
      userId: 123,
      policyData: {
        policy: 'myNewPolicy',
      },
    });
    expect(apiClient.v6.post).toHaveBeenCalledWith(
      '/cloud/project/projectId/user/123/policy',
      {
        policy: 'myNewPolicy',
      },
      undefined,
    );
  });
});
