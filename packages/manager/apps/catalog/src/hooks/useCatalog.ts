import { useEffect, useState } from 'react';

import { useQuery } from '@tanstack/react-query';

import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';

import { Product, getManagerCatalogList, getManagerCatalogListQueryKey } from '@/api';
import { filterProducts } from '@/utils/utils';

interface UseCatalogParams {
  categories?: string[];
  universes?: string[];
  searchText?: string;
}

export const useCatalog = ({ categories, universes, searchText }: UseCatalogParams = {}) => {
  const [products, setProducts] = useState<Product[]>([]); // full list of products
  const [results, setResults] = useState<Product[]>([]); // the filtered list of products

  const { error, isLoading, isSuccess, data } = useQuery<ApiResponse<Product[]>, ApiError>({
    queryKey: getManagerCatalogListQueryKey,
    queryFn: getManagerCatalogList,
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
