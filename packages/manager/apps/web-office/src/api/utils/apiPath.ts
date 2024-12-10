import { useOfficeServiceType } from '@/hooks';

export const getApiPath = (serviceName: string) => {
  const serviceType = useOfficeServiceType(serviceName);
  return `/license/${
    serviceType === 'payAsYouGo' ? 'office' : 'officePrepaid'
  }/${serviceName}/`;
};

export const getApiPathWithoutServiceName = (serviceName: string) => {
  const serviceType = useOfficeServiceType(serviceName);
  return `/license/${
    serviceType === 'payAsYouGo' ? 'office' : 'officePrepaid'
  }/`;
};
