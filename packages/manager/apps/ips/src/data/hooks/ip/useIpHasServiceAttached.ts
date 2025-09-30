import { IpTypeEnum } from '@/data/api';
import { useGetProductService } from '../useGetProductService';

export type UseIpHasServicesAttachedParams = {
  path: string;
  category: IpTypeEnum;
  serviceName?: string;
};

export const useIpHasServicesAttached = ({
  path,
  category,
  serviceName,
}: UseIpHasServicesAttachedParams) => {
  const productServices = useGetProductService({
    path,
    category,
  });

  return {
    hasServiceAttached:
      productServices?.services?.some(
        (service) => serviceName === service.serviceName,
      ) ?? false,
  };
};
