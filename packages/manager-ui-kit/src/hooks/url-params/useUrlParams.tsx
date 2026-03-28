import { useCallback, useEffect, useMemo } from 'react';

import { useSearchParams } from 'react-router-dom';

type ParamValue = string | string[];

type Params<K extends readonly string[]> = {
  [P in K[number]]?: ParamValue;
};

type SetValues<K extends readonly string[]> = Partial<
  Record<K[number], ParamValue | null | undefined>
>;

export function useUrlParams<const K extends readonly string[]>(keys: K) {
  const [searchParams, setSearchParams] = useSearchParams();
  /**
   * Typed params object for the provided keys
   */
  const params = useMemo(() => {
    const acc = {} as Params<K>;
    for (const key of keys as ReadonlyArray<K[number]>) {
      const values = searchParams.getAll(key).filter((value) => value !== '');
      if (values.length === 1) {
        acc[key] = values[0];
      } else if (values.length > 1) {
        acc[key] = values;
      } else {
        acc[key] = undefined;
      }
    }
    return acc;
  }, [keys, searchParams]);

  /**
   * Current query string (ex: "mainState=OK&tab=settings")
   */
  const queryString = useMemo(() => searchParams.toString(), [searchParams]);

  /**
   * Cleanup invariant:
   * - if a managed key has value === '' => remove it from URL
   * - undefined is represented as "key not present" (already clean)
   */
  useEffect(() => {
    let shouldUpdate = false;
    const next = new URLSearchParams(searchParams);

    for (const key of keys) {
      const values = next.getAll(key);
      if (values.length === 0) continue;

      const cleanedValues = values.filter((value) => value !== '');
      if (cleanedValues.length !== values.length) {
        next.delete(key);
        cleanedValues.forEach((value) => next.append(key, value));
        shouldUpdate = true;
      }
    }

    if (shouldUpdate) {
      setSearchParams(next, { replace: true });
    }
  }, [keys, searchParams, setSearchParams]);

  /**
   * Updates multiple query params at once (merge behavior).
   * - value === null | undefined => delete the key
   */
  const setQueryParams = useCallback(
    (values: SetValues<K>, options?: { replace?: boolean }) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);

          for (const key of Object.keys(values) as Array<K[number]>) {
            const value = values[key];
            if (value == null || value === '' || (Array.isArray(value) && value.length === 0)) {
              next.delete(key);
            } else if (Array.isArray(value)) {
              const cleanedValues = value.filter((item) => item !== '');
              if (cleanedValues.length === 0) {
                next.delete(key);
              } else {
                next.delete(key);
                cleanedValues.forEach((item) => next.append(key, item));
              }
            } else {
              next.set(key, value);
            }
          }

          return next;
        },
        { replace: options?.replace ?? true },
      );
    },
    [setSearchParams],
  );

  /**
   * Updates a single query param.
   * - value === null | undefined | '' => delete the key
   */
  const setQueryParam = useCallback(
    (key: K[number], value: ParamValue | null | undefined, options?: { replace?: boolean }) => {
      setQueryParams({ [key]: value } as SetValues<K>, options);
    },
    [setQueryParams],
  );

  /**
   * Deletes a single query param (typed)
   */
  const deleteQueryParam = useCallback(
    (key: K[number], options?: { replace?: boolean }) => {
      setQueryParam(key, null, options);
    },
    [setQueryParam],
  );

  /**
   * Removes all managed keys from the URL
   */
  const clearKeys = useCallback(
    (options?: { replace?: boolean }) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          for (const key of keys) next.delete(key);
          return next;
        },
        { replace: options?.replace ?? true },
      );
    },
    [keys, setSearchParams],
  );

  return {
    params,
    queryString,
    searchParams, // exposed for advanced usage (getAll, etc.)
    setQueryParams,
    setQueryParam,
    deleteQueryParam,
    clearKeys,
  };
}
