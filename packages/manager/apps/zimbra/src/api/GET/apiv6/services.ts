import apiClient from '@ovh-ux/manager-core-api';

export const getDomainsZoneListQueryKey = ['get/domain/zone'];

export const getDomainsZoneList = async () => {
  const { data } = await apiClient.v6.get('/domain/zone');
  return data;
};

export const getDomainZoneQueryKey = (zoneName: string) => [
  `get/domain/zone/${zoneName}`,
];
