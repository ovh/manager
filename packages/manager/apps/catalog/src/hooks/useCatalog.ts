import { useContext, useEffect, useState } from 'react';

import { useQuery } from '@tanstack/react-query';

import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

import { Product, getManagerCatalogList, getManagerCatalogListQueryKey } from '@/api';
import { resolveOrderUrls } from '@/utils/order-url';
import { filterProducts } from '@/utils/utils';

interface UseCatalogParams {
  categories?: string[];
  universes?: string[];
  searchText?: string;
}

export const useCatalog = ({ categories, universes, searchText }: UseCatalogParams = {}) => {
  const [products, setProducts] = useState<Product[]>([]); // full list of products
  const [results, setResults] = useState<Product[]>([]); // the filtered list of products

  const { shell } = useContext(ShellContext);

  // The order URLs are v8 routes: the ones still hosted by v6 are remapped (see utils/order-url).
  const { error, isLoading, isSuccess, data } = useQuery<ApiResponse<Product[]>, ApiError>({
    // getURL is the shell's URL builder, not an input of the query: it stays out of the key.
    // eslint-disable-next-line @tanstack/query/exhaustive-deps
    queryKey: getManagerCatalogListQueryKey,
    queryFn: async () => {
      const response = await getManagerCatalogList();
      return {
        ...response,
        data: await resolveOrderUrls(response.data ?? [], shell.navigation.getURL),
      };
    },
    staleTime: Infinity,
  });

  useEffect(() => {
    if (data?.status === 200) {
      const response: Product[] = data?.data;
      setProducts(response);
      setResults(response);
    }
  }, [isSuccess, data]);

  useEffect(() => {
    setResults(filterProducts(products, categories, universes, searchText));
  }, [products, categories, universes, searchText]);

  return {
    products,
    results,
    isLoading,
    error,
  };
};

export default { useCatalog };
