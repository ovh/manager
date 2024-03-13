import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  getManagerCatalogList,
  getManagerCatalogListQueryKey,
  Product,
} from '@/api';
import { filterProducts } from '@/utils/utils';

interface UseCatalogParams {
  categories?: string[];
  universes?: string[];
  searchText?: string;
}

export const useCatalog = ({
  categories,
  universes,
  searchText,
}: UseCatalogParams = {}) => {
  const [products, setProducts] = useState<Product[]>([]); // full list of products
  const [results, setResults] = useState<Product[]>([]); // the filtered list of products

  const service = useQuery<ApiResponse<Product[]>, ApiError>({
    queryKey: getManagerCatalogListQueryKey,
    queryFn: () => getManagerCatalogList(),
    staleTime: Infinity,
  });

  const { error } = service;

  useEffect(() => {
    if (service?.data?.status === 200) {
      const response: Product[] = service.data?.data;
      setProducts(response);
      setResults(response);
    }
  }, [service.isSuccess, service.data]);

  useEffect(() => {
    setResults(filterProducts(products, categories, universes, searchText));
  }, [products, categories, universes, searchText]);

  return {
    products,
    results,
    isLoading: service.isLoading,
    error,
  };
};

export default { useCatalog };
