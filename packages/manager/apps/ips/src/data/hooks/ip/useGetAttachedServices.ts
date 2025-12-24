import { IpTypeEnum, PRODUCT_PATHS_AND_CATEGORIES } from '@/data/constants';

import { useGetProductServices } from '../useGetProductServices';

export type UseGetAttachedServicesParams = {
  serviceName?: string | null;
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

  const hasVrackAttachedToIp = servicesAttached.some(
    (service) => service.category === IpTypeEnum.VRACK,
  );

  return {
    servicesAttached,
    hasCloudServiceAttachedToIP,
    hasDedicatedServiceAttachedToIp,
    hasHousingServiceAttachedToIp,
    hasVrackAttachedToIp,
  };
};
