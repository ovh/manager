import { useQueries } from '@tanstack/react-query';
import {
  GetProductServicesParams,
  getProductServicesQueryKey,
  getProductServices,
  ProductServicesDetails,
  IpTypeEnum,
} from '../api';

export interface ServiceInfo {
  category: string;
  serviceName: string;
  displayName: string;
}

const getDisplayName = (
  category: string,
  service: ProductServicesDetails,
): string => {
  let iam;
  switch (category) {
    case IpTypeEnum.CLOUD:
      return (service?.description as string) || '';
    case IpTypeEnum.VRACK:
      return (service?.name as string) || '';
    default:
      iam = service.iam as { displayName?: string } | undefined;
      return iam?.displayName || (service.displayName as string) || '';
  }
};

/**
 * Fetch the list of available services for a product list
 */
export const useGetProductServices = (
  productPathsAndCategories: GetProductServicesParams[],
) => {
  const serviceByCategory = useQueries({
    queries: productPathsAndCategories.map((params) => ({
      queryKey: getProductServicesQueryKey(params as GetProductServicesParams),
      queryFn: () => getProductServices(params as GetProductServicesParams),
    })),
    combine: (queries) =>
      queries
        .map((result, index) => ({
          data: result?.data?.data || [],
          category: productPathsAndCategories[index]?.category,
        }))
        .reduce((acc, { category, data }) => {
          acc[category] = data.map((service) => {
            const iam = service.iam as { urn: string } | undefined;
            const extractedServiceName = iam?.urn.split(':').pop() || '';

            return {
              category,
              serviceName: extractedServiceName,
              displayName:
                getDisplayName(category, service) || extractedServiceName,
            };
          });
          return acc;
        }, {} as Record<string, ServiceInfo[]>),
  });

  return {
    serviceList: serviceByCategory
      ? Object.values(serviceByCategory).flatMap((service) => service)
      : [],
    serviceByCategory,
  };
};
