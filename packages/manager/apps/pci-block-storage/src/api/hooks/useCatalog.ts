import { queryOptions, useQuery } from '@tanstack/react-query';
import { getCatalog } from '@ovh-ux/manager-pci-common';
import { getVolumeCatalog } from '@/api/data/catalog';

export const getCatalogQuery = (ovhSubsidiary: string) => ({
  queryKey: ['catalog'],
  queryFn: () => getCatalog(ovhSubsidiary),
});

export const getVolumeCatalogQuery = (projectId: string) =>
  queryOptions({
    queryKey: ['projects', projectId, 'catalog', 'volume'],
    queryFn: () => getVolumeCatalog(projectId),
  });

export const useVolumeCatalog = (projectId: string) =>
  useQuery(getVolumeCatalogQuery(projectId));
