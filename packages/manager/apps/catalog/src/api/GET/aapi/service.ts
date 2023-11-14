import { queryClient } from '@ovh-ux/manager-react-core-application';
import { apiClient } from '@ovh-ux/manager-core-api';
import i18next from 'i18next';

export const getManagerHubCatalogListQueryKey = ['/hub/catalog'];

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

// interface ResponseData {
//   status: number;
//   data: CatalogData;
// }
export type CatalogData = {
  data: Product[];
};

export type ResponseData<T> = {
  status: number;
  data: T;
  code: string;
  // Error response
  response?: {
    status: number;
    data: { message: string };
  };
};

/**
 * Manager-catalog endpoints : Get manager-catalog
 */
export const getManagerHubCatalogList = async () => {
  const fetchData = async () => {
    const config = {
      headers: {
        'Content-Language': i18next.language.replace('-', '_'),
      },
    };
    const response: ResponseData<Product[]> = await apiClient.aapi.get(
      '/catalog',
      config,
    );
    return response;
  };
  try {
    return queryClient.fetchQuery(getManagerHubCatalogListQueryKey, fetchData);
  } catch (error) {
    return Promise.reject(error);
  }
};
