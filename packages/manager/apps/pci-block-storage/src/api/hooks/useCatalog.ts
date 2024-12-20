import { useQuery } from '@tanstack/react-query';
import { useMe } from '@ovh-ux/manager-react-components';
import { getCatalog } from '@ovh-ux/manager-pci-common';
import { getVolumeCatalog } from '@/api/data/catalog';

export const getCatalogQuery = (ovhSubsidiary: string) => ({
  queryKey: ['catalog'],
  queryFn: () => getCatalog(ovhSubsidiary),
});

/**
 * @deprecated use {@link useVolumeCatalog} instead
 */
export const useCatalog = () => {
  const { me } = useMe();
  return useQuery({
    ...getCatalogQuery(me?.ovhSubsidiary),
    enabled: !!me,
  });
};

export const useVolumeCatalog = (projectId: string) =>
  useQuery({
    queryKey: ['projects', projectId, 'catalog', 'volume'],
    queryFn: () => getVolumeCatalog(projectId),
  });
