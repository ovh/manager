import { useQuery } from '@tanstack/react-query';
import {
  getIpGameMitigationQueryKey,
  GetIpGameMitigationParams,
  getIpGameMitigation,
} from '../api';

/**
 * Fetch the game mitigation
 */
export const useGetGameMitigation = ({ ip }: GetIpGameMitigationParams) => {
  const { data, ...query } = useQuery({
    queryKey: getIpGameMitigationQueryKey({
      ip,
    }),
    queryFn: () => getIpGameMitigation({ ip }),
  });

  return {
    result: data?.data,
    ...query,
  };
};
