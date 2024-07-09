import { ai } from '@/types/ai';

export const mockedRegistryInput: ai.registry.RegistryCreation = {
  password: 'password',
  region: 'region',
  url: 'url',
  username: 'username',
};

export const mockedRegistryEdit: ai.registry.RegistryEdition = {
  password: 'password',
  url: 'url',
  username: 'username',
};

export const mockedRegistry: ai.registry.Registry = {
  createdAt: 'createdAt',
  id: 'id',
  region: 'region',
  updatedAt: 'updatedAt',
  user: 'user',
};
