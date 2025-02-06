import * as ai from '@/types/cloud/project/ai';

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
  cache: true,
  mountPath: '/publicGit',
  permission: ai.VolumePermissionEnum.RWD,
  volumeSource: {
    publicGit: {
      url: 'https://myUrl.com',
    },
  },
};

export const mockedStatusVolume: ai.volume.VolumeStatus = {
  id: 'volumeId',
  mountPath: 'volumeMountPaht',
  userVolumeId: 'userVolumeId',
};
