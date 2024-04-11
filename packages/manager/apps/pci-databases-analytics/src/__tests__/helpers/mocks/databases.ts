import { database } from '@/models/database';

export const mockedDatabase: database.service.Database = {
  default: true,
  id: 'databaseId',
  name: 'databaseName',
};
