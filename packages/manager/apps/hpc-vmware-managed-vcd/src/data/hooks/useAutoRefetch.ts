import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

type AutoRefetchProps = {
  queryKey: string[];
  condition: boolean;
  interval?: number;
};

export const useAutoRefetch = ({
  queryKey,
  condition,
  interval = 10_000,
}: AutoRefetchProps) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!condition) return;

    const refetchQueries = () => {
      queryClient.invalidateQueries({ queryKey });
    };

    const refetchInterval = setInterval(() => refetchQueries(), interval);

    // eslint-disable-next-line consistent-return
    return () => clearInterval(refetchInterval);
  }, [condition, interval, queryKey, queryClient]);
};
