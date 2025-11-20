import {
  FormattedStorage,
  ObjectStorageTypeEnum,
  Storages,
} from '@/types/Storages';
import { mockedRegion } from '../region/region';
import cloud from '@/types/Cloud';

export const mockedFormattedStorage: FormattedStorage = {
  id: 'storageId',
  name: 'storageName',
  region: 'BHS',
  storedBytes: 0,
  storedObjects: 0,
  storageType: ObjectStorageTypeEnum.s3,
  objects: [],
  objectsCount: 0,
  objectsSize: 0,
  ownerId: 123,
  virtualHost: 'virtualHost',
  s3StorageType: cloud.RegionTypeEnum['region-3-az'],
  regionObj: mockedRegion,
};

export const mockedStorages: Storages = {
  errors: [
    {
      error: {
        code: '400',
        message: 'bad request',
        type: 'error',
      },
      region: 'BHS',
    },
  ],
  resources: [mockedFormattedStorage],
};
