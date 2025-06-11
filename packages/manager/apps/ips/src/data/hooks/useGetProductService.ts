import { useQuery } from '@tanstack/react-query';
import {
  GetProductServicesParams,
  getProductServicesQueryKey,
  getProductServices,
  ProductServicesDetails,
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
    case 'CLOUD':
      return (service?.description as string) || '';
    case 'VRACK':
      return (service?.name as string) || '';
    default:
      iam = service.iam as { displayName?: string } | undefined;
      return iam?.displayName || (service.displayName as string) || '';
  }
};

/**
 * Fetch the list of available services for a product
 */
export const useGetProductService = (product: GetProductServicesParams) => {
  const { data, ...query } = useQuery({
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
