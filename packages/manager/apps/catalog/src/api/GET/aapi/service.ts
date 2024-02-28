import { apiClient } from '@ovh-ux/manager-core-api';
import i18next from 'i18next';

export const getManagerCatalogListQueryKey = ['/catalog'];

export type Product = {
  id: number;
  name: string;
  description: string;
  lang: string;
  categories: string[];
  url: string;
  regionTags: string[];
  productName: string;
  order: string;
  universe: string;
  category: string;
};

export type CatalogData = {
  data: Product[];
};

export type ResponseData<T> = {
  status: number;
  data: T;
  code: string;
  response?: {
    status: number;
    data: { message: string };
  };
};

/**
 * 2API-catalog endpoints : Get catalog
 */
export const getManagerCatalogList = async () =>
  apiClient.aapi.get<Product[]>('/catalog', {
    headers: {
      'Content-Language': i18next.language.replace('-', '_'),
    },
  });
