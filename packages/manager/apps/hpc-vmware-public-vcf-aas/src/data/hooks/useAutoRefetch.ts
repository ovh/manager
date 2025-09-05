import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

type AutoRefetchProps = {
  queryKey: string[];
  enabled: boolean;
  interval?: number;
};

export const useAutoRefetch = ({
  queryKey,
  enabled,
  interval = 10_000,
}: AutoRefetchProps) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!enabled) return;

    const refetchQueries = () => {
      queryClient.invalidateQueries({ queryKey });
    };

    const refetchInterval = setInterval(() => refetchQueries(), interval);

    // eslint-disable-next-line consistent-return
    return () => clearInterval(refetchInterval);
  }, [enabled, interval, queryKey, queryClient]);
};
