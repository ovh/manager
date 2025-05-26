export const getSlotServicesQueryKey = () => ['get', 'zimbra', 'services'];

export const getServiceByResourceNameQueryKey = (resourceName: string) => [
  'get',
  'zimbra',
  'services',
  resourceName,
];
