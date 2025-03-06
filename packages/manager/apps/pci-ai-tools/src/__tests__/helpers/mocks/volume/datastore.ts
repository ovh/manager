import * as ai from '@datatr-ux/ovhcloud-types/cloud/project/ai/index';
// import { DataStoresWithContainers } from '@/hooks/api/ai/datastore/useGetDatastoresWithContainers.hook';
// import { DataStoresWithRegion } from '@/hooks/api/ai/datastore/useGetDatastoresWithRegions.hook';
// import { OrderVolumes, Containers } from '@/types/orderFunnel';

export const mockedDatastoreInputGit: ai.DataStoreInput = {
  alias: 'myGitDatastore',
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

export const mockedDatastoreS3: ai.DataStore = {
  alias: 'myDatastoreS3',
  endpoint: 'endpoint',
  owner: ai.DataStoreOwnerEnum.customer,
  type: ai.DataStoreTypeEnum.s3,
};

// export const mockedDatastoreS3WithRegion: DataStoresWithRegion = {
//   ...mockedDatastoreS3,
//   alias: 'myDatastoreS3',
//   region: 'GRA',
// };

export const mockedDatastoreAuth: ai.DataStoreAuth = {
  accessKey: 'accessKey',
  region: 'region',
  s3Url: 's3url',
  secretKey: 'secretKey',
  token: 'token',
  url: 'url',
};

// export const mockedGitWithRegion: DataStoresWithRegion = {
//   ...mockedDatastoreS3WithRegion,
//   alias: 'myGitWithRegion',
//   type: ai.DataStoreTypeEnum.git,
// };

// export const mockedDatastoreWithContainerS3: DataStoresWithContainers = {
//   ...mockedDatastoreS3,
//   alias: 'aliasS3withContainer',
//   id: 'idS3',
//   container: ['containerS3'],
// };

// export const mockedDatastoreWithContainerGit: DataStoresWithContainers = {
//   ...mockedDatastoreS3,
//   alias: 'aliasGitwithContainer',
//   type: ai.DataStoreTypeEnum.git,
//   id: 'idGit',
// };

// export const mockedOrderVolumesS3: OrderVolumes = {
//   cache: false,
//   dataStore: {
//     alias: 'aliasOfvolumeS3',
//     container: 'container',
//     type: ai.DataStoreTypeEnum.s3,
//   },
//   mountPath: '/s3',
//   permission: ai.VolumePermissionEnum.RWD,
// };

// export const mockedOrderVolumesGit: OrderVolumes = {
//   cache: true,
//   dataStore: {
//     alias: 'aliasOfVolumeGit',
//     container: 'develop',
//     type: ai.DataStoreTypeEnum.git,
//   },
//   mountPath: '/git',
//   permission: ai.VolumePermissionEnum.RWD,
// };

// export const mockedOrderPublicGit: OrderVolumes = {
//   cache: false,
//   publicGit: {
//     url: 'https://repo.git',
//   },
//   mountPath: '/demo',
//   permission: ai.VolumePermissionEnum.RO,
// };

// export const mockedContainer: Containers = {
//   status: 'ok',
//   message: 'message',
//   containers: ['container1', 'container2'],
// };
