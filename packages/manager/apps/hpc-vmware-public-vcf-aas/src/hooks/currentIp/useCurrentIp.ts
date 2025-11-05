import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

type IpResponse = string;

interface UseCurrentIpResult {
  ip: IpResponse | null;
  retrieveCurrentIp: () => Promise<IpResponse | null>;
  isLoading: boolean;
  error: unknown;
}

export const useCurrentIp = (autoFetch = false): UseCurrentIpResult => {
  const { data, refetch, isLoading, error } = useQuery<IpResponse>({
    queryKey: ['api64.ipify.org/current-ip'],
    queryFn: async (): Promise<IpResponse> => {
      const response = await axios.get<{ ip: string }>(
        'https://api64.ipify.org?format=json',
      );
      return response.data.ip;
    },
    enabled: autoFetch,
  });

  const retrieveCurrentIp = async (): Promise<IpResponse | null> => {
    const result = await refetch();
    return result.data ?? null;
  };

  return {
    ip: data ?? null,
    retrieveCurrentIp,
    isLoading,
    error,
  };
};
