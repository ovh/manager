import storages from '@/types/Storages';

export const mockedSwift: storages.ContainerDetail = {
  name: 'test-container',
  region: 'GRA',
  storedBytes: 1024,
  storedObjects: 5,
  objects: [
    {
      name: 'file1.txt',
      size: 100,
      contentType: 'text/plain',
      lastModified: '2024-01-01',
      retrievalDelay: 0,
      retrievalState: 'sealed',
    },
    {
      name: 'file2.txt',
      size: 200,
      contentType: 'text/plain',
      lastModified: '2024-01-02',
      retrievalDelay: 0,
      retrievalState: 'sealed',
    },
  ],
  archive: false,
  containerType: 'private',
  cors: [],
  public: false,
  staticUrl: '',
} as storages.ContainerDetail;

export const mockedSwiftEmpty: storages.ContainerDetail = {
  name: 'empty-container',
  region: 'GRA',
  storedBytes: 0,
  storedObjects: 0,
  objects: [],
  archive: false,
  containerType: 'private',
  cors: [],
  public: false,
  staticUrl: '',
} as storages.ContainerDetail;
