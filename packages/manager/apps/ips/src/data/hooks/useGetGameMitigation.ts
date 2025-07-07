import { useQuery } from '@tanstack/react-query';
import { getIpGameMitigationQueryKey, getIpGameMitigation } from '../api';

/**
 * Fetch the game mitigation
 */
export const useGetGameMitigation = ({
  ip,
  enabled,
}: {
  ip: string;
  enabled: boolean;
}) => {
  const { data, ...query } = useQuery({
    queryKey: getIpGameMitigationQueryKey({
      ip,
    }),
    queryFn: () => getIpGameMitigation({ ip }),
    enabled,
    staleTime: Number.POSITIVE_INFINITY,
    retry: false,
  });

  return {
    result: data?.data,
    ...query,
  };
};
