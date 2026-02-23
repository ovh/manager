import { UseQueryResult, useQueries } from '@tanstack/react-query';

import { IcebergFetchResultV6 } from '@ovh-ux/manager-core-api';

import { IpTypeEnum } from '@/data/constants';

import {
  GetProductServicesParams,
  ProductServicesDetails,
  getProductServices,
  getProductServicesQueryKey,
} from '../api';

export interface ServiceInfoWithId {
  id: string | undefined;
  category: IpTypeEnum;
  serviceName: string;
  displayName: string;
}

const getDisplayName = (
  category: IpTypeEnum,
  service: ProductServicesDetails,
): string => {
  switch (category) {
    case IpTypeEnum.CLOUD:
      return service?.description || '';
    case IpTypeEnum.VRACK:
      return service?.name || '';
    case IpTypeEnum.PCC:
      return service?.description || '';
    default:
      return service?.iam?.displayName || service?.displayName || '';
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
      queryKey: getProductServicesQueryKey(params),
      queryFn: () => getProductServices(params),
    })),
    combine: (
      results: UseQueryResult<IcebergFetchResultV6<ProductServicesDetails>>[],
    ) => {
      const data = results
        .map((result, index) => ({
          data: result?.data?.data || [],
          category: productPathsAndCategories[index]?.category,
        }))
        .reduce(
          (acc, { category, data: serviceData }) => {
            acc[category] = serviceData.map((service) => {
              const iam = service.iam as
                | { id: string; urn: string }
                | undefined;
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
          },
          {} as Record<string, ServiceInfoWithId[]>,
        );
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
