import { queryClient } from '@ovh-ux/manager-react-core-application';
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
 * Manager-catalog endpoints : Get manager-catalog
 */
export const getManagerCatalogList = async () => {
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
    return queryClient.fetchQuery({
      queryKey: getManagerCatalogListQueryKey,
      queryFn: fetchData,
    });
  } catch (error) {
    return Promise.reject(error);
  }
};
