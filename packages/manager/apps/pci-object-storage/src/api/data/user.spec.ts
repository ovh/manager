import { describe, it, expect, vi } from 'vitest';
import { v6 } from '@ovh-ux/manager-core-api';
import {
  getUser,
  getAllUsers,
  getS3Credentials,
  deleteUser,
  getUserStoragePolicy,
  postS3Secret,
  importUserPolicy,
  generateS3Credentials,
  createUser,
} from './user';
import { OBJECT_STORAGE_USER_ROLE } from '@/constants';

describe('User API', () => {
  const projectId = 'test-project';
  const userId = 1;
  const userAccess = 'test-access';
  const accessKey = 'test-access-key';
  const description = 'test-description';
  const policy = 'test-policy';

  it('should get a user', async () => {
    const mockUser = { id: userId, username: 'test-user' };
    vi.mocked(v6.get).mockResolvedValue({ data: mockUser });

    const result = await getUser(projectId, userId);
    expect(result).toEqual(mockUser);
    expect(v6.get).toHaveBeenCalledWith(
      `/cloud/project/${projectId}/user/${userId}`,
    );
  });

  it('should get all users', async () => {
    const mockUsers = [{ id: userId, username: 'test-user' }];
    vi.mocked(v6.get).mockResolvedValue({ data: mockUsers });

    const result = await getAllUsers(projectId);
    expect(result).toEqual(mockUsers);
    expect(v6.get).toHaveBeenCalledWith(`/cloud/project/${projectId}/user`);
  });

  it('should get S3 credentials', async () => {
    const mockCredentials = [
      { userId: 'test-user', access: 'test-access', secret: 'test-secret' },
    ];
    vi.mocked(v6.get).mockResolvedValue({ data: mockCredentials });

    const result = await getS3Credentials(projectId, userAccess);
    expect(result).toEqual(mockCredentials);
    expect(v6.get).toHaveBeenCalledWith(
      `/cloud/project/${projectId}/user/${userAccess}/s3Credentials`,
    );
  });

  it('should delete a user', async () => {
    await deleteUser(projectId, userAccess, accessKey);
    expect(v6.delete).toHaveBeenCalledWith(
      `/cloud/project/${projectId}/user/${userAccess}/s3Credentials/${accessKey}`,
    );
  });

  it('should get user storage policy', async () => {
    const mockPolicy = { policy: 'test-policy' };
    vi.mocked(v6.get).mockResolvedValue({ data: mockPolicy });

    const result = await getUserStoragePolicy(projectId, userId);
    expect(result).toEqual(mockPolicy);
    expect(v6.get).toHaveBeenCalledWith(
      `/cloud/project/${projectId}/user/${userId}/policy`,
    );
  });

  it('should post S3 secret', async () => {
    const mockSecret = { secret: 'test-secret' };
    vi.mocked(v6.post).mockResolvedValue({ data: mockSecret });

    const result = await postS3Secret(projectId, userId, userAccess);
    expect(result).toEqual(mockSecret);
    expect(v6.post).toHaveBeenCalledWith(
      `/cloud/project/${projectId}/user/${userId}/s3Credentials/${userAccess}/secret`,
    );
  });

  it('should import user policy', async () => {
    const mockResponse = { data: 'success' };
    vi.mocked(v6.post).mockResolvedValue(mockResponse);

    const result = await importUserPolicy(projectId, userAccess, policy);
    expect(result).toEqual(mockResponse.data);
    expect(
      v6.post,
    ).toHaveBeenCalledWith(
      `/cloud/project/${projectId}/user/${userAccess}/policy`,
      { policy },
    );
  });

  it('should generate S3 credentials', async () => {
    const mockCredentials = {
      userId: 'test-user',
      access: 'test-access',
      secret: 'test-secret',
    };
    vi.mocked(v6.post).mockResolvedValue({ data: mockCredentials });

    const result = await generateS3Credentials(projectId, userId);
    expect(result).toEqual(mockCredentials);
    expect(v6.post).toHaveBeenCalledWith(
      `/cloud/project/${projectId}/user/${userId}/s3Credentials`,
    );
  });

  it('should create a user', async () => {
    const mockUser = { id: userId, username: 'test-user' };
    vi.mocked(v6.post).mockResolvedValue({ data: mockUser });

    const result = await createUser(projectId, description);
    expect(result).toEqual(mockUser);
    expect(v6.post).toHaveBeenCalledWith(`/cloud/project/${projectId}/user`, {
      description,
      role: OBJECT_STORAGE_USER_ROLE,
    });
  });
});
