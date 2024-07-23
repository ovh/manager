import { DataStoresWithRegion } from '@/hooks/api/ai/datastore/useGetDatastoresWithRegions.hook';
import { ai } from '@/types/ai';

export const mockedDatastoreInput: ai.DataStoreInput = {
  alias: 'datastoreAlias',
  credentials: {
    git: {
      basicAuth: {
        password: 'password',
        username: 'username',
      },
    },
  },
  endpoint: 'datastoreEndpoints',
  owner: ai.DataStoreOwnerEnum.customer,
  type: ai.DataStoreTypeEnum.git,
};

export const mockedDatastore: ai.DataStore = {
  alias: 'alias',
  endpoint: 'endpoint',
  owner: ai.DataStoreOwnerEnum.customer,
  type: ai.DataStoreTypeEnum.s3,
};

export const mockedDatastoreAuth: ai.DataStoreAuth = {
  accessKey: 'accessKey',
  region: 'region',
  s3Url: 's3url',
  secretKey: 'secretKey',
  token: 'token',
  url: 'url',
};

export const mockedDatastoreWithRegion: DataStoresWithRegion = {
  alias: 'alias',
  endpoint: 'endpoint',
  owner: ai.DataStoreOwnerEnum.customer,
  type: ai.DataStoreTypeEnum.s3,
  region: 'GRA',
};

export const mockedGitWithRegion: DataStoresWithRegion = {
  alias: 'alias',
  endpoint: 'endpoint',
  owner: ai.DataStoreOwnerEnum.customer,
  type: ai.DataStoreTypeEnum.git,
  region: 'GRA',
};
