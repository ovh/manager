import { v6 } from '@ovh-ux/manager-core-api';

type TService = {
  resource: {
    name: string;
  };
  serviceId: string;
};

type TServiceInfos = {
  serviceId: string;
};

export const getServices = async (): Promise<TService[]> => {
  const { data } = await v6.get<TService[]>('services', {
    headers: {
      'X-Pagination-Mode': 'CachedObjectList-Cursor',
      'X-Pagination-Sort': 'resource.product.name',
      'X-Pagination-Sort-Order': 'ASC',
    },
  });
  return data;
};

export const getServiceInfos = async (
  projectId: string,
): Promise<TServiceInfos> => {
  const { data } = await v6.get<TServiceInfos>(
    `/cloud/project/${projectId}/serviceInfos`,
  );
  return data;
};

export const getService = async (serviceId: string): Promise<TService> => {
  const { data } = await v6.get<TService>(`/services/${serviceId}`);
  return data;
};
