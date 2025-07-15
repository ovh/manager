import { useGetProductServices } from '../useGetProductServices';

// List of all relevant product paths and categories to check except { path: '/dedicated/housing', category: 'HOUSING' },
const PRODUCT_PATHS_AND_CATEGORIES = [
  { path: '/cloud/project', category: 'CLOUD' },
  { path: '/dedicated/server', category: 'DEDICATED' },
  { path: '/vps', category: 'VPS' },
  { path: '/vrack', category: 'VRACK' },
  { path: '/dedicatedCloud', category: 'PRIVATE_CLOUD' },
  { path: '/ipLoadbalancing', category: 'IP_LOAD_BALANCING' },
];

export type UseGetAttachedServicesParams = {
  serviceName?: string;
};

export const useGetAttachedServices = ({
  serviceName,
}: UseGetAttachedServicesParams) => {
  // Fetch all product services for all paths/categories
  const { services: productServicesList } = useGetProductServices(
    PRODUCT_PATHS_AND_CATEGORIES,
  );

  const servicesAttached = productServicesList.filter((productServices) => {
    return serviceName === productServices.serviceName;
  });

  return { servicesAttached };
};
