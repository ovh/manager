import { useQuery } from '@tanstack/react-query';
import { TokenParam, getTokens, getTokenQueryKey } from '../api';

/**
 * Fetch the token for a given campus
 */
export const useGetTokens = ({ campus }: TokenParam) => {
  const { data, ...query } = useQuery({
    queryKey: getTokenQueryKey({
      campus,
    }),
    queryFn: () => getTokens({ campus }),
  });

  return {
    token: data?.data,
    ...query,
  };
};
