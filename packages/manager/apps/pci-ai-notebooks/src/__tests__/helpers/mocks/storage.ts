import * as storage from '@/types/cloud/storage';

export const mockedStorage: storage.Container = {
  archive: false,
  containerType: storage.TypeEnum.private,
  id: 'storageId',
  name: 'storageName',
  region: 'region',
  storedBytes: 0,
  storedObjects: 0,
};
