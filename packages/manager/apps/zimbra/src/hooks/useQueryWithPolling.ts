import { useQueries, useQuery, UseQueryOptions } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';

type UseQueryWithPollingOptions<T> = UseQueryOptions<T> & {
  isComplete: (data: T) => boolean;
  onComplete?: (data: T) => void;
  maxRefreshes: number;
  interval?: number;
  throttleInterval?: number;
};

type UseQueriesWithPollingOptions<T> = {
  options: UseQueryOptions<T>[];
  isComplete: (data: T) => boolean;
  onComplete?: (data: T) => void;
  maxRefreshes: number;
  interval?: number;
  throttleInterval?: number;
};

export const useQueryWithPolling = <T>(
  params: UseQueryWithPollingOptions<T>,
) => {
  const {
    enabled,
    isComplete,
    onComplete,
    maxRefreshes,
    interval,
    throttleInterval,
    ...rest
  } = params;

  const { data, refetch, ...query } = useQuery({
    ...rest,
    enabled,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    retry: false,
  });

  const isPolling = useRef(false);
  const completed = useRef(false);
  const tryCount = useRef(1);

  useEffect(() => {
    if (isPolling.current || !enabled || tryCount.current >= maxRefreshes) {
      return undefined;
    }

    if (
      !completed.current &&
      data &&
      typeof isComplete === 'function' &&
      isComplete(data)
    ) {
      if (typeof onComplete === 'function') {
        onComplete(data);
      }
      completed.current = true;
      return undefined;
    }

    const delay = interval || tryCount.current * throttleInterval;

    const timeout = setTimeout(async () => {
      await refetch();
      tryCount.current += 1;
      isPolling.current = false;
    }, delay);

    isPolling.current = true;

    return () => clearTimeout(timeout);
  }, [data, isPolling.current]);

  return { data, refetch, ...query };
};

export const useQueriesWithPolling = <T>(
  params: UseQueriesWithPollingOptions<T>,
) => {
  const {
    options,
    isComplete,
    onComplete,
    maxRefreshes,
    interval,
    throttleInterval,
  } = params;

  const isPolling = useRef<Record<number, boolean>>({});
  const completed = useRef<Record<number, boolean>>({});
  const tryCount = useRef<Record<number, number>>({});
  const timeouts: NodeJS.Timeout[] = [];

  const queries = useQueries({
    queries: options.map((opts, index) => {
      isPolling.current[index] = false;
      completed.current[index] = false;
      tryCount.current[index] = 1;
      return {
        ...opts,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
        retry: false,
      };
    }),
  });

  useEffect(() => {
    queries.forEach((query, index) => {
      if (
        isPolling.current[index] ||
        !options[index].enabled ||
        tryCount.current[index] >= maxRefreshes
      ) {
        return;
      }

      if (
        !completed.current[index] &&
        query.data &&
        typeof isComplete === 'function' &&
        isComplete(query.data)
      ) {
        if (typeof onComplete === 'function') {
          onComplete(query.data);
        }
        completed.current[index] = true;
        return;
      }

      const delay = interval || tryCount.current[index] * throttleInterval;

      const timeout = setTimeout(async () => {
        await queries[index].refetch();
        isPolling.current[index] = false;
        tryCount.current[index] += 1;
      }, delay);

      timeouts.push(timeout);

      isPolling.current[index] = true;
    });

    return () => {
      timeouts.forEach((timeout) => {
        clearTimeout(timeout);
      });
    };
  }, [queries]);

  return queries;
};
