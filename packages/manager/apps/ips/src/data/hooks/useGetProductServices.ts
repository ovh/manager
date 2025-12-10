import { useQueries, UseQueryResult } from '@tanstack/react-query';
import { ApiError, IcebergFetchResultV6 } from '@ovh-ux/manager-core-api';
import {
  GetProductServicesParams,
  getProductServicesQueryKey,
  getProductServices,
  ProductServicesDetails,
} from '../api';
import { IpTypeEnum } from '@/data/constants';

export interface ServiceInfoWithId {
  id: string | undefined;
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
    case IpTypeEnum.PCC:
      return (service?.description as string) || '';
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
  const queriesResults = useQueries({
    queries: productPathsAndCategories.map((params) => ({
      queryKey: getProductServicesQueryKey(params as GetProductServicesParams),
      queryFn: () => getProductServices(params as GetProductServicesParams),
    })),
    combine: (
      results: UseQueryResult<
        IcebergFetchResultV6<ProductServicesDetails>,
        ApiError
      >[],
    ) => {
      const data = results
        .map((result, index) => ({
          data: result?.data?.data || [],
          category: productPathsAndCategories[index]?.category,
        }))
        .reduce((acc, { category, data: serviceData }) => {
          acc[category] = serviceData.map((service) => {
            const iam = service.iam as { id: string; urn: string } | undefined;
            const id = iam?.id ?? undefined;
            const extractedServiceName = iam?.urn.split(':').pop() || '';

            return {
              category,
              id,
              serviceName: extractedServiceName,
              displayName:
                getDisplayName(category, service) || extractedServiceName,
            };
          });
          return acc;
        }, {} as Record<string, ServiceInfoWithId[]>);
      return {
        data,
        isLoading: results.some((result) => result.isLoading),
        isError: results.some((result) => result.error),
        error: results.find((result) => result.error)?.error,
      };
    },
  });

  return {
    serviceList: queriesResults.data
      ? Object.values(queriesResults.data).flatMap((service) => service)
      : [],
    serviceByCategory: queriesResults.data,
    isLoading: queriesResults.isLoading,
    isError: queriesResults.isError,
    error: queriesResults.error,
  };
};
