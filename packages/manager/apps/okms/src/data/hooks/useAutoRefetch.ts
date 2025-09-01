import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

type AutoRefetchProps = {
  queryKey: string[];
  enabled: boolean;
  interval?: number;
  timeout?: number;
  onFinish?: () => void;
};

export const useAutoRefetch = ({
  queryKey,
  enabled = false,
  interval = 30_000,
  timeout = 60_000 * 5,
  onFinish,
}: AutoRefetchProps) => {
  const [isEnabled, setIsEnabled] = useState<boolean>(enabled);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isEnabled) {
      return undefined;
    }
    const refetchTimeout = setTimeout(() => {
      setIsEnabled(false);
      onFinish?.();
    }, timeout);
    const refetchInterval = setInterval(
      () => queryClient.invalidateQueries({ queryKey }),
      interval,
    );

    return () => {
      clearInterval(refetchInterval);
      clearTimeout(refetchTimeout);
    };
  }, [isEnabled, interval, timeout, queryKey, queryClient]);
};
