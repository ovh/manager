import cloud from '@/types/Cloud';
import user from '@/types/User';

export const mockedCloudUser: user.User = {
  creationDate: '2024-04-08',
  description: 'userDescription',
  id: 12,
  roles: [
    {
      description: 'rolesDesc',
      id: 'roleId',
      name: 'roleName',
      permissions: ['rw'],
    },
  ],
  status: user.UserStatusEnum.ok,
  username: 'username',
  openstackId: 'userOpenstackId',
};

export const mockedS3Credentials: user.S3CredentialsWithSecret = {
  access: 'mock-access',
  secret: 'mock-secret',
  tenantId: 'mock-tenant',
  userId: '12345',
};

export const mockedRole: cloud.role.Role = {
  description: 'Administrator role',
  id: '1',
  name: 'admin',
  permissions: ['read', 'write', 'delete'],
};

export const mockedUserDetail: user.UserDetail = {
  creationDate: '2025-11-05T12:00:00Z',
  description: 'Test user',
  id: 12345,
  openstackId: 'os-67890',
  password: 'mocked-password',
  roles: [mockedRole],
  status: user.UserStatusEnum.ok,
  username: 'testuser',
};

export const mockedRclone: user.Rclone = {
  content: 'rclone configuration data',
};

export const mockedS3CredentialsWithoutPwd: user.S3Credentials = {
  access: 'mock-access-key-1',
  tenantId: 'tenant-1',
  userId: 'user-1',
};

export const mockedS3CredentialsSecretOnly: user.S3CredentialsSecretOnly = {
  secret: 'mock-secret-key',
};
