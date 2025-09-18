import { useEffect, useRef } from 'react';

export const usePrevious = (value) => {
  const ref = useRef<typeof value>();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
};
