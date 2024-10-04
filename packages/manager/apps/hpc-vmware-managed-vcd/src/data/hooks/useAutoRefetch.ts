import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

type AutoRefetchProps = {
  queryKeys: string[] | string[][];
  condition: boolean;
  interval?: number;
};

export const useAutoRefetch = ({
  queryKeys,
  condition,
  interval = 10_000,
}: AutoRefetchProps) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!condition) return;

    const refetchQueries = () => {
      if (Array.isArray(queryKeys[0])) {
        (queryKeys as string[][]).forEach((queryKey) =>
          queryClient.invalidateQueries({ queryKey }),
        );
      } else {
        queryClient.invalidateQueries({
          queryKey: queryKeys as string[],
        });
      }
    };

    const refetchInterval = setInterval(() => refetchQueries(), interval);

    // eslint-disable-next-line consistent-return
    return () => {
      clearInterval(refetchInterval);
    };
  }, [condition, interval, queryKeys, queryClient]);
};
