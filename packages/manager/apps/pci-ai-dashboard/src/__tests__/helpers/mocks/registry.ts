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
  createdAt: '1989/04/08',
  id: 'id',
  region: 'GRA',
  updatedAt: '1989/04/08',
  user: 'user',
};
