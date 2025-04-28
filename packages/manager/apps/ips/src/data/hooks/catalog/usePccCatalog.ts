import { useQuery } from '@tanstack/react-query';
import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import { PccCatalogResponse, getPccCatalog } from '../../api/catalog';

export const getPccCatalogQueryKey = (serviceName: string) => [
  'pccCatalog',
  serviceName,
];
export const usePccCatalog = ({
  serviceName,
  enabled = true,
}: {
  serviceName: string;
  enabled?: boolean;
}) =>
  useQuery<ApiResponse<PccCatalogResponse>, ApiError>({
    queryKey: getPccCatalogQueryKey(serviceName),
    queryFn: () => getPccCatalog(serviceName),
    enabled,
  });
