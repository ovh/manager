import { UserEdition } from '@/api/databases/users';
import { database } from '@/models/database';

export const mockedDatabaseUser: database.service.User = {
  createdAt: 'createdAt',
  id: 'userId',
  status: database.StatusEnum.CREATING,
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
