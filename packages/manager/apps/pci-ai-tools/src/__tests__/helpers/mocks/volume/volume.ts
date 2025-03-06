import * as ai from '@datatr-ux/ovhcloud-types/cloud/project/ai/index';

export const mockedVolume: ai.volume.Volume = {
  cache: false,
  mountPath: '/demo',
  permission: ai.VolumePermissionEnum.RO,
  volumeSource: {
    dataStore: {
      alias: 'alias',
      container: 'container',
    },
  },
};

export const mockedDatastoreVolume: ai.volume.Volume = {
  cache: false,
  mountPath: '/demo1',
  permission: ai.VolumePermissionEnum.RO,
  volumeSource: {
    dataStore: {
      alias: 'alias1',
      container: 'container1',
      internal: false,
    },
  },
};

export const mockedPublicGitVolume: ai.volume.Volume = {
  cache: false,
  mountPath: '/demo',
  permission: ai.VolumePermissionEnum.RO,
  volumeSource: {
    publicGit: {
      url: 'https://repo.git',
    },
  },
};

export const mockedStatusVolume: ai.volume.VolumeStatus = {
  id: 'volumeId',
  mountPath: 'volumeMountPaht',
  userVolumeId: 'userVolumeId',
};

export const mockedS3Volume: ai.volume.Volume = {
  cache: false,
  mountPath: '/s3',
  permission: ai.VolumePermissionEnum.RWD,
  volumeSource: {
    dataStore: {
      alias: 'aliasOfvolumeS3',
      container: 'container',
    },
  },
};

export const mockedGitVolume: ai.volume.Volume = {
  cache: true,
  mountPath: '/git',
  permission: ai.VolumePermissionEnum.RWD,
  volumeSource: {
    dataStore: {
      alias: 'aliasOfVolumeGit',
      container: 'develop',
    },
  },
};
