import storages from '@/types/Storages';

export const mockedContainerAccess: storages.ContainerAccess = {
  endpoints: [
    {
      region: 'BHS',
      url: 'myBHSurl.com',
    },
  ],
  token: 'myToken',
};
