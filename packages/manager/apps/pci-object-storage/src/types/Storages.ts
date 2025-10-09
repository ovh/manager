import * as storages from '@datatr-ux/ovhcloud-types/cloud/storage/index';
import cloud from './Cloud';

export default storages;

export enum ObjectStorageTypeEnum {
  's3' = 's3',
  'swift' = 'swift',
}

export interface FormattedStorage extends storages.Container {
  createdAt?: string;
  encryption?: storages.EncryptionAlgorithmEnum;
  isHighPerfStorage?: boolean;
  objects: storages.ContainerObject[];
  objectsCount: number;
  objectsSize: number;
  ownerId: number;
  public?: boolean;
  s3StorageType: string;
  virtualHost: string;
  regionType: cloud.RegionTypeEnum;
  storageType: ObjectStorageTypeEnum;
}

export interface Error {
  code: string;
  message: string;
  type: string;
}

export interface StorageError {
  error: Error;
  region: string;
}

export interface Storages {
  errors: StorageError[];
  resources: FormattedStorage[];
}
