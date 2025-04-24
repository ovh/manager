import { useQuery } from '@tanstack/react-query';
import { OvhSubsidiary } from '@ovh-ux/manager-react-components';
import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import { CatalogIpsResponse, getCatalogIps } from '../../api/catalog';
import { getCatalogIpsQueryKey } from './catalog.utils';

export const useCatalogIps = ({
  subsidiary,
  enabled = true,
}: {
  subsidiary: string;
  enabled?: boolean;
}) =>
  useQuery<ApiResponse<CatalogIpsResponse>, ApiError>({
    queryKey: getCatalogIpsQueryKey(subsidiary),
    queryFn: () => getCatalogIps(subsidiary as OvhSubsidiary),
    enabled,
  });
