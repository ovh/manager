import cloud from '@/types/Cloud';
import storages from '@/types/Storages';

export const mockedS3Object: cloud.StorageObject = {
  etag: 'etag',
  key: 'objectKey',
  lastModified: '2024-08-04',
  size: 157,
  storageClass: cloud.storage.StorageClassEnum.STANDARD,
};

export const mockContainerObject: storages.ContainerObject = {
  contentType: 'application/json',
  lastModified: '2025-11-05T12:34:56Z',
  name: 'example-object.json',
  retrievalDelay: 0,
  retrievalState: storages.RetrievalStateEnum.sealed,
  size: 1024,
};

export const mockedS3ObjectVersions: cloud.StorageObject = {
  ...mockedS3Object,
  versionId: 'versionId',
};
