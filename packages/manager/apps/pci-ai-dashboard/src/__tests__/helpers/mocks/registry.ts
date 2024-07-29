import * as ai from '@/types/cloud/project/ai';

export const mockedRegistryEdit: ai.registry.RegistryUpdateInput = {
  password: 'password',
  url: 'url',
  username: 'username',
};

export const mockedRegistryInput = {
  password: 'password',
  url: 'url',
  username: 'username',
  region: 'GRA',
};

export const mockedRegistry: ai.registry.Registry = {
  createdAt: '1989/04/08',
  id: 'id',
  region: 'GRA',
  updatedAt: '1989/04/08',
  user: 'user',
  password: '',
  url: 'registryUrl',
  username: 'username',
};
