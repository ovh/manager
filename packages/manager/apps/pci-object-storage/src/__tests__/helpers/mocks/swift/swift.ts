import storages from '@/types/Storages';
import { mockContainerObject } from '../s3/object';

export const mockedSwiftContainer: storages.Container = {
  id: 'swift-id',
  name: 'swiftName',
  region: 'bhs',
  storedBytes: 0,
  storedObjects: 0,
};

export const mockedContainerDetail: storages.ContainerDetail = {
  archive: false,
  containerType: storages.TypeEnum.private,
  cors: ['https://example.com'],
  name: 'mocked-container',
  objects: [mockContainerObject],
  public: false, // Deprecated field
  region: 'mocked-region',
  staticUrl: 'https://mocked-static-url.com',
  storedBytes: 3072,
  storedObjects: 2,
};
