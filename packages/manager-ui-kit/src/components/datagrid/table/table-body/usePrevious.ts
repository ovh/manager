import { useEffect, useState } from 'react';

export const usePrevious = (value: number) => {
  const [previous, setPrevious] = useState<number>(0);

  useEffect(() => {
    setPrevious(value);
  }, [value]);

  return previous;
};
