import { useGetProductServices } from '../useGetProductServices';

// List of all relevant product paths and categories to check except { path: '/dedicated/housing', category: 'HOUSING' },
export const PRODUCT_PATHS_AND_CATEGORIES = {
  CLOUD: { path: '/cloud/project', category: 'CLOUD' },
  DEDICATED: { path: '/dedicated/server', category: 'DEDICATED' },
  VPS: { path: '/vps', category: 'VPS' },
  VRACK: { path: '/vrack', category: 'VRACK' },
  PRIVATE_CLOUD: { path: '/dedicatedCloud', category: 'PRIVATE_CLOUD' },
  IP_LOAD_BALANCING: {
    path: '/ipLoadbalancing',
    category: 'IP_LOAD_BALANCING',
  },
};

export type UseGetAttachedServicesParams = {
  serviceName?: string;
};

export const useGetAttachedServices = ({
  serviceName,
}: UseGetAttachedServicesParams) => {
  // Fetch all product services for all paths/categories
  const { services: productServicesList } = useGetProductServices(
    Object.values(PRODUCT_PATHS_AND_CATEGORIES),
  );

  const servicesAttached = productServicesList.filter((productServices) => {
    return serviceName === productServices.serviceName;
  });

  return { servicesAttached };
};
