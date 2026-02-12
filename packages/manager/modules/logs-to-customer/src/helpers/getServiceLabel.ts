import { Service } from '@/data/types/dbaas/logs/Logs.type';

const getServiceLabel = (service: Service) => {
  return service.displayName
    ? `${service.serviceName} - ${service.displayName}`
    : service.serviceName;
};

export default getServiceLabel;
