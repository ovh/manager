import { useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import qs from 'qs';

export const useQueryState = <T extends string>(
  query: string,
): [T | undefined, (value: T | undefined) => void] => {
  const location = useLocation();
  const navigate = useNavigate();

  const setQuery = useCallback(
    (value: T | undefined) => {
      const existingQueries = qs.parse(location.search, {
        ignoreQueryPrefix: true,
      });

      // If value is undefined, delete the query from existingQueries
      if (value === undefined) {
        delete existingQueries[query];
      } else {
        existingQueries[query] = value;
      }

      const newQueries =
        value !== undefined
          ? { ...existingQueries, [query]: value }
          : { ...existingQueries };

      const queryString = qs.stringify(newQueries, {
        skipNulls: true,
        addQueryPrefix: true,
      });

      navigate(`${location.pathname}${queryString}`);
    },
    [navigate, location, query],
  );

  return [
    (qs.parse(location.search, { ignoreQueryPrefix: true })[query] as T) ||
      undefined,
    setQuery,
  ];
};
