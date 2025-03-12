import { AxiosError } from 'axios';
import { useQuery } from '@tanstack/react-query';
import { getCatalog } from '@/data/api/catalog';
import { CatalogItem } from '@/types/catalog';

export const useFetchHubCatalog = () =>
  useQuery<Record<string, CatalogItem[]>, AxiosError>({
    queryKey: ['getHubCatalog'],
    queryFn: getCatalog,
    retry: 0,
  });
