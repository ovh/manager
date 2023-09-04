import { useState, useEffect } from 'react';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import {
  getManagerHubCatalogList,
  getManagerHubCatalogListQueryKey,
} from '@/api';
import { filterItems } from '@/utils/utils';

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
  catalog: {
    data: Product[];
  };
};

interface ServiceData {
  status: number;
  data: CatalogData;
}

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

  const service: UseQueryResult<ServiceData> = useQuery({
    queryKey: getManagerHubCatalogListQueryKey,
    queryFn: () => getManagerHubCatalogList(),
    staleTime: Infinity,
  });

  useEffect(() => {
    if (service.isSuccess && service.data.status === 200) {
      const response: Product[] = service.data?.data?.catalog?.data || [];
      setProducts(response);
      setResults(response);
    }
  }, [service.isSuccess, service.data]);

  useEffect(() => {
    setResults(filterItems(products, categories, universes, searchText));
  }, [categories, universes, searchText]);

  return {
    products,
    results,
  };
};

export default { useCatalog };
