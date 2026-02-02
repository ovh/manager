import { useQuery } from '@tanstack/react-query';
import { ApiError } from '@ovh-ux/manager-core-api';
import { getDSVrackQueryKey, getDSVrack } from '@/data/api/vrack';

export type UseGetVrackParams = {
  server: string;
};

export const useGetVrack = ({ server }: UseGetVrackParams) => {
  const { data: vrackResponse, isLoading, isError, error } = useQuery<
    string[],
    ApiError
  >({
    queryKey: getDSVrackQueryKey(server),
    queryFn: () => getDSVrack(server),
  });

  return { vrack: vrackResponse, isLoading, isError, error };
};
