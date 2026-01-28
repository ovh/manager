import { useQuery } from '@tanstack/react-query';

import { ApiError, IcebergFetchResultV6 } from '@ovh-ux/manager-core-api';

import {
  GetProductServicesParams,
  ProductServicesDetails,
  getProductServices,
  getProductServicesQueryKey,
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
  switch (category) {
    case 'CLOUD':
      return service?.description || '';
    case 'VRACK':
      return service?.name || '';
    default:
      return service?.iam?.displayName || service.displayName || '';
  }
};

/**
 * Fetch the list of available services for a product
 */
export const useGetProductService = (product: GetProductServicesParams) => {
  const { data, ...query } = useQuery<
    IcebergFetchResultV6<ProductServicesDetails>,
    ApiError
  >({
    queryKey: getProductServicesQueryKey(product),
    queryFn: () => getProductServices(product),
  });

  const services = (data?.data || []).map((service) => {
    const iam = service.iam as { urn: string } | undefined;
    const extractedServiceName = iam?.urn.split(':').pop() || '';
    return {
      category: product.category,
      serviceName: extractedServiceName,
      displayName:
        getDisplayName(product.category, service) || extractedServiceName,
    };
  }) as ServiceInfo[];

  return {
    services,
    ...query,
  };
};
