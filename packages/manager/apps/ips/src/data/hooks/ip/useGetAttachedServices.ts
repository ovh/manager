import { PRODUCT_PATHS_AND_CATEGORIES, IpTypeEnum } from '@/data/constants';
import { useGetProductServices } from '../useGetProductServices';

export type UseGetAttachedServicesParams = {
  serviceName?: string;
};

export const useGetAttachedServices = ({
  serviceName,
}: UseGetAttachedServicesParams) => {
  // Fetch all product services for all paths/categories
  const { serviceList: productServicesList } = useGetProductServices(
    Object.values(PRODUCT_PATHS_AND_CATEGORIES),
  );

  const servicesAttached = productServicesList.filter((productServices) => {
    return serviceName === productServices.serviceName;
  });

  const hasCloudServiceAttachedToIP = servicesAttached.some(
    (service) => service.category === IpTypeEnum.CLOUD,
  );

  const hasDedicatedServiceAttachedToIp = servicesAttached.some(
    (service) => service.category === IpTypeEnum.DEDICATED,
  );

  const hasHousingServiceAttachedToIp = servicesAttached.some(
    (service) => service.category === IpTypeEnum.HOUSING,
  );

  return {
    servicesAttached,
    hasCloudServiceAttachedToIP,
    hasDedicatedServiceAttachedToIp,
    hasHousingServiceAttachedToIp,
  };
};
