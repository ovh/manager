import { useEffect } from 'react';

import { useQueryClient } from '@tanstack/react-query';

type AutoRefetchProps = {
  queryKey: string[];
  enabled: boolean;
  interval?: number;
};

export const useAutoRefetch = ({ queryKey, enabled, interval = 10_000 }: AutoRefetchProps) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!enabled) return undefined;

    const refetchQueries = () => {
      void queryClient.invalidateQueries({ queryKey });
    };

    const refetchInterval = setInterval(() => refetchQueries(), interval);

    return () => clearInterval(refetchInterval);
  }, [enabled, interval, queryKey, queryClient]);
};
