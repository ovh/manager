import { useCallback, useState } from 'react';

import useDebounce from 'react-use/lib/useDebounce';

export const useDebouncedValue = <T>(
  defaultValue: T,
  delay = 500,
): [T, (v: T) => void, T, (v: T) => void, () => void] => {
  const [value, setValue] = useState<T>(defaultValue);
  const [debouncedValue, setDebouncedValue] = useState<T>(defaultValue);
  const [, cancel] = useDebounce(
    () => {
      setDebouncedValue(value);
    },
    delay,
    [value],
  );

  const updateDebouncedValue = useCallback(
    (v: T) => {
      cancel();
      setDebouncedValue(v);
    },
    [cancel],
  );

  return [value, setValue, debouncedValue, updateDebouncedValue, cancel];
};
