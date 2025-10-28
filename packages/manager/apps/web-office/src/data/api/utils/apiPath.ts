import { ServiceType } from '@/utils/ServiceType.utils';

export const getApiPath = (serviceName: string) => {
  const serviceType = ServiceType(serviceName);
  return `/license/${serviceType === 'payAsYouGo' ? 'office' : 'officePrepaid'}/${serviceName}/`;
};

export const getApiPathWithoutServiceName = (serviceName: string) => {
  const serviceType = ServiceType(serviceName);
  return `/license/${serviceType === 'payAsYouGo' ? 'office' : 'officePrepaid'}/`;
};
