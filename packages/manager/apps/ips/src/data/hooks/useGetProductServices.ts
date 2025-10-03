import { useQueries } from '@tanstack/react-query';
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
 * Fetch the list of available services for a product list
 */
export const useGetProductServices = (
  productPathsAndCategories: GetProductServicesParams[],
) => {
  const queries = useQueries({
    queries: productPathsAndCategories.map((params) => ({
      queryKey: getProductServicesQueryKey(params as GetProductServicesParams),
      queryFn: () => getProductServices(params as GetProductServicesParams),
    })),
  });

  const services = queries.flatMap(({ data }) =>
    (data?.data || []).map((service: any) => {
      const iam = service.iam as { urn: string } | undefined;
      const extractedServiceName = iam?.urn.split(':').pop() || '';
      return {
        category: service.category,
        serviceName: extractedServiceName,
        displayName:
          getDisplayName(service.category, service) || extractedServiceName,
      };
    }),
  ) as ServiceInfo[];

  return {
    services,
    queries,
  };
};
