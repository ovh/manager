import { IpTypeEnum } from '@/data/api';
import { useGetProductServices } from '../useGetProductServices';

// List of all relevant product paths and categories to check except { path: '/dedicated/housing', category: 'HOUSING' },
export const PRODUCT_PATHS_AND_CATEGORIES = {
  [IpTypeEnum.CLOUD]: { path: '/cloud/project', category: IpTypeEnum.CLOUD },
  [IpTypeEnum.DEDICATED]: {
    path: '/dedicated/server',
    category: IpTypeEnum.DEDICATED,
  },
  [IpTypeEnum.VPS]: { path: '/vps', category: IpTypeEnum.VPS },
  [IpTypeEnum.VRACK]: { path: '/vrack', category: IpTypeEnum.VRACK },
  [IpTypeEnum.PCC]: { path: '/dedicatedCloud', category: IpTypeEnum.PCC },
  [IpTypeEnum.LOAD_BALANCING]: {
    path: '/ipLoadbalancing',
    category: IpTypeEnum.LOAD_BALANCING,
  },
  [IpTypeEnum.XDSL]: {
    pathList: ['/xdsl', '/pack/xdsl'],
    category: IpTypeEnum.XDSL,
  },
  [IpTypeEnum.OVERTHEBOX]: {
    path: '/overTheBox',
    category: IpTypeEnum.OVERTHEBOX,
  },
};

export type UseGetAttachedServicesParams = {
  serviceName?: string;
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

  return { servicesAttached };
};
