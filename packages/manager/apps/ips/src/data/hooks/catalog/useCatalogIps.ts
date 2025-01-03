import { useQuery } from '@tanstack/react-query';
import { OvhSubsidiary } from '@ovh-ux/manager-react-components';
import { getCatalogIps } from '../../api/catalog';
import { getCatalogIpsQueryKey } from './catalog.utils';

export const useCatalogIps = (subsidiary: string) =>
  useQuery({
    queryKey: getCatalogIpsQueryKey(subsidiary),
    queryFn: () => getCatalogIps(subsidiary as OvhSubsidiary),
  });
