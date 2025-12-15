import storages from '@/types/Storages';

export const mockedPresignUrlInput: storages.PresignedURLInput = {
  expire: 48,
  method: storages.PresignedURLMethodEnum.GET,
  object: 'myObject',
  storageClass: storages.StorageClassEnum.STANDARD,
  versionId: 'versionId',
};

export const mockedPresignUrl: storages.PresignedURL = {
  url: '/mynewurl',
  method: storages.PresignedURLMethodEnum.GET,
  signedHeaders: {
    header1: 'header1',
  },
};

export const mockedObjectTempUrl: storages.ContainerObjectTempURL = {
  expirationDate: '2024-12-31T23:59:59Z',
  getURL: 'https://mytempurl.com',
};
