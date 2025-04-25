import { useServiceType } from '@/data/hooks';

export const getApiPath = (serviceName: string) => {
  const serviceType = useServiceType(serviceName);
  return `/license/${
    serviceType === 'payAsYouGo' ? 'office' : 'officePrepaid'
  }/${serviceName}/`;
};

export const getApiPathWithoutServiceName = (serviceName: string) => {
  const serviceType = useServiceType(serviceName);
  return `/license/${
    serviceType === 'payAsYouGo' ? 'office' : 'officePrepaid'
  }/`;
};
