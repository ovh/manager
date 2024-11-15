import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

export const useUrlSearchParams = (...names: string[]) => {
  const [searchParams] = useSearchParams();
  return useMemo(
    () =>
      names.reduce<Record<string, string | null>>(
        (acc, cur) => ({
          ...acc,
          [cur]: searchParams.get(cur),
        }),
        {},
      ),
    [names, searchParams],
  );
};
