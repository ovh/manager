import { useCallback, useState, useEffect } from "react";

/**
 * Very simple hook to store a value in session storage. Implemented as a custom hook because
 * the react-use hook doesn't offer a way to clear the value.
 *
 * @param key data key
 * @param defaultValue default value
 * @returns [value, setValue, removeValue] tuple of the value, setter and remover functions
 */
export const useSessionStorage = <T extends string>(key: string, defaultValue?: T): [T | null, (newValue: T) => void, () => void] => {
  const [state, setState] = useState<T | null>(() => {
    const storedValue = window.sessionStorage.getItem(key);
    return storedValue !== null ? (storedValue as T) : defaultValue ?? null;
  });

  const set = useCallback(
    (newValue: T) => {
      window.sessionStorage.setItem(key, newValue);
      setState(newValue);
    },
    [key, setState],
  );

  const remove = useCallback(() => {
    try {
      window.sessionStorage.removeItem(key);
      setState(null);
    } catch {
      // Do nothing, could be private mode
    }
  }, [key, setState]);

  useEffect(() => {
    const existingValue = window.sessionStorage.getItem(key);
    if (existingValue !== null) {
      setState(existingValue as T);
    } else if (defaultValue) {
      set(defaultValue);
    }
  }, [key]);

  return [state, set, remove];
};
