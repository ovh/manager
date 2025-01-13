import { v6 } from '@ovh-ux/manager-core-api';

type TService = {
  resource: {
    name: string;
  };
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
