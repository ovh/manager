import storages from '@/types/Storages';

export const mockedPresignInputData: storages.PresignedURLInput = {
  expire: 48,
  method: storages.PresignedURLMethodEnum.GET,
  object: 'myObject',
  storageClass: storages.StorageClassEnum.STANDARD,
  versionId: 'versionId',
};
