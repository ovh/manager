import { DataStoresWithContainers } from '@/hooks/api/ai/datastore/useGetDatastoresWithContainers.hook';
import { DataStoresWithRegion } from '@/hooks/api/ai/datastore/useGetDatastoresWithRegions.hook';
import * as ai from '@/types/cloud/project/ai';
import { OrderVolumes } from '@/types/orderFunnel';

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

export const mockedDatastoreWithContainerS3: DataStoresWithContainers = {
  alias: 'aliasS3',
  endpoint: 'endpoint',
  owner: ai.DataStoreOwnerEnum.customer,
  type: ai.DataStoreTypeEnum.s3,
  id: 'idS3',
  container: 'containerS3',
};

export const mockedDatastoreWithContainerGit: DataStoresWithContainers = {
  alias: 'aliasGit',
  endpoint: 'endpointGit',
  owner: ai.DataStoreOwnerEnum.customer,
  type: ai.DataStoreTypeEnum.git,
  id: 'idGit',
};

export const mockedOrderVolumesS3: OrderVolumes = {
  cache: false,
  dataStore: {
    alias: 'alias',
    container: 'container',
    type: ai.DataStoreTypeEnum.s3,
  },
  mountPath: '/s3',
  permission: ai.VolumePermissionEnum.RWD,
};

export const mockedOrderVolumesGit: OrderVolumes = {
  cache: true,
  dataStore: {
    alias: 'alias',
    container: 'develop',
    type: ai.DataStoreTypeEnum.git,
  },
  mountPath: '/git',
  permission: ai.VolumePermissionEnum.RWD,
};

export const mockedOrderPublicGit: OrderVolumes = {
  cache: false,
  publicGit: {
    url: 'https://repo.git',
  },
  mountPath: '/demo',
  permission: ai.VolumePermissionEnum.RO,
};
