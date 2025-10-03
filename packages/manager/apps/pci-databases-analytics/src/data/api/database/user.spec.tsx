import { describe, expect, vi } from 'vitest';
import { apiClient } from '@/data/api/api.client';
import {
  getUsers,
  addUser,
  deleteUser,
  resetUserPassword,
  getRoles,
  editUser,
  getUserAccess,
} from '@/data/api/database/user.api';
import * as database from '@/types/cloud/project/database';

vi.mock('@/data/api/api.client', async (importOriginal) => {
  const mod = await importOriginal<typeof import('@/data/api/api.client')>();
  const get = vi.fn(() => {
    return Promise.resolve([
      { id: 1, name: 'User 1' },
      { id: 2, name: 'User 2' },
    ]);
  });
  const post = vi.fn(() => {
    return Promise.resolve({ data: null });
  });
  const put = vi.fn(() => {
    return Promise.resolve({ data: null });
  });
  const del = vi.fn(() => {
    return Promise.resolve({ data: null });
  });
  return {
    ...mod,
    apiClient: {
      v6: {
        get,
        post,
        put,
        delete: del,
      },
    },
  };
});

describe('user management functions', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should call getUsers', async () => {
    expect(apiClient.v6.get).not.toHaveBeenCalled();
    await getUsers({
      projectId: 'projectId',
      engine: database.EngineEnum.mongodb,
      serviceId: 'serviceId',
    });
    expect(apiClient.v6.get).toHaveBeenCalledWith(
      '/cloud/project/projectId/database/mongodb/serviceId/user',
      {
        headers: {
          'X-Pagination-Mode': 'CachedObjectList-Pages',
          'X-Pagination-Size': '50000',
          Pragma: 'no-cache',
        },
      },
    );
  });

  it('should call addUser', async () => {
    expect(apiClient.v6.post).not.toHaveBeenCalled();
    await addUser({
      projectId: 'projectId',
      engine: database.EngineEnum.mongodb,
      serviceId: 'serviceId',
      user: {
        name: 'newUser',
      },
    });
    expect(apiClient.v6.post).toHaveBeenCalledWith(
      '/cloud/project/projectId/database/mongodb/serviceId/user',
      {
        name: 'newUser',
      },
    );
  });

  it('should call deleteUser', async () => {
    expect(apiClient.v6.delete).not.toHaveBeenCalled();
    await deleteUser({
      projectId: 'projectId',
      engine: database.EngineEnum.mongodb,
      serviceId: 'serviceId',
      userId: 'userId',
    });
    expect(apiClient.v6.delete).toHaveBeenCalledWith(
      '/cloud/project/projectId/database/mongodb/serviceId/user/userId',
    );
  });

  it('should call resetUserPassword', async () => {
    expect(apiClient.v6.post).not.toHaveBeenCalled();
    await resetUserPassword({
      projectId: 'projectId',
      engine: database.EngineEnum.mongodb,
      serviceId: 'serviceId',
      userId: 'userId',
    });
    expect(apiClient.v6.post).toHaveBeenCalledWith(
      '/cloud/project/projectId/database/mongodb/serviceId/user/userId/credentials/reset',
    );
  });

  it('should call getUserAccess', async () => {
    expect(apiClient.v6.get).not.toHaveBeenCalled();
    await getUserAccess({
      projectId: 'projectId',
      engine: database.EngineEnum.kafka,
      serviceId: 'serviceId',
      userId: 'userId',
    });
    expect(apiClient.v6.get).toHaveBeenCalledWith(
      '/cloud/project/projectId/database/kafka/serviceId/user/userId/access',
    );
  });

  it('should call getRoles', async () => {
    expect(apiClient.v6.get).not.toHaveBeenCalled();
    await getRoles({
      projectId: 'projectId',
      engine: database.EngineEnum.postgresql,
      serviceId: 'serviceId',
    });
    expect(apiClient.v6.get).toHaveBeenCalledWith(
      '/cloud/project/projectId/database/postgresql/serviceId/roles',
    );
  });

  it('should call advanced getRoles for mongodb', async () => {
    expect(apiClient.v6.get).not.toHaveBeenCalled();
    await getRoles({
      projectId: 'projectId',
      engine: database.EngineEnum.mongodb,
      serviceId: 'serviceId',
    });
    expect(apiClient.v6.get).toHaveBeenCalledWith(
      '/cloud/project/projectId/database/mongodb/serviceId/roles?advanced=true',
    );
  });

  it('should return users for different engine', async () => {
    const mockUsers = [
      { id: 1, name: 'User 1' },
      { id: 2, name: 'User 2' },
    ];
    const usersMysql = await getUsers({
      projectId: 'projectId',
      engine: database.EngineEnum.mysql,
      serviceId: 'serviceId',
    });
    const usersMongodb = await getUsers({
      projectId: 'projectId',
      engine: database.EngineEnum.mongodb,
      serviceId: 'serviceId',
    });
    const usersRedis = await getUsers({
      projectId: 'projectId',
      engine: database.EngineEnum.redis,
      serviceId: 'serviceId',
    });
    const usersOpenSearch = await getUsers({
      projectId: 'projectId',
      engine: database.EngineEnum.opensearch,
      serviceId: 'serviceId',
    });
    const usersM3 = await getUsers({
      projectId: 'projectId',
      engine: database.EngineEnum.m3db,
      serviceId: 'serviceId',
    });

    expect(usersMysql).toEqual(mockUsers);
    expect(usersMongodb).toEqual(mockUsers);
    expect(usersRedis).toEqual(mockUsers);
    expect(usersOpenSearch).toEqual(mockUsers);
    expect(usersM3).toEqual(mockUsers);
  });

  it('should call editUser', async () => {
    expect(apiClient.v6.put).not.toHaveBeenCalled();
    await editUser({
      projectId: 'projectId',
      engine: database.EngineEnum.mongodb,
      serviceId: 'serviceId',
      user: {
        id: 'userId',
        username: 'newName',
      },
    });
    expect(apiClient.v6.put).toHaveBeenCalledWith(
      '/cloud/project/projectId/database/mongodb/serviceId/user/userId',
      {
        username: 'newName',
      },
    );
  });
});
