import { UserEdition } from '@/data/api/database/user.api';
import * as database from '@/types/cloud/project/database';

export const mockedDatabaseUser: database.service.User = {
  createdAt: '2024-03-19T11:34:47.088723+01:00',
  id: 'userId',
  status: database.StatusEnum.READY,
  username: 'username',
};

export const mockedDatabaseUserWithPassword: database.service.UserWithPassword = {
  ...mockedDatabaseUser,
  password: 'password',
};

export const mockedDatabaseUserCreation: database.service.UserCreation = {
  name: 'name',
};

export const mockedDatabaseUserEdition: UserEdition = {
  id: 'userId',
  username: 'username',
};

export const mockedUserRoles = [
  'backup@admin',
  'clusterAdmin@admin',
  'clusterManager@admin',
  'clusterMonitor@admin',
  'dbAdmin@(defined db)',
  'dbAdminAnyDatabase@admin',
  'dbOwner@(defined db)',
  'enableSharding@(defined db)',
  'hostManager@admin',
  'read@(defined db)',
  'readAnyDatabase@admin',
  'readWrite@(defined db)',
  'readWriteAnyDatabase@admin',
  'restore@admin',
  'root@admin',
  'userAdmin@(defined db)',
  'userAdminAnyDatabase@admin',
];
