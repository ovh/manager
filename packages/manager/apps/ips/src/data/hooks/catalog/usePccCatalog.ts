import { useQuery } from '@tanstack/react-query';
import { getPccCatalog } from '../../api/catalog';

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
  useQuery({
    queryKey: getPccCatalogQueryKey(serviceName),
    queryFn: () => getPccCatalog(serviceName),
    enabled,
  });
