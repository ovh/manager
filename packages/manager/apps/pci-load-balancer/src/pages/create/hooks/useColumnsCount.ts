import { useMemo } from 'react';
import { useWindowSize } from 'react-use';

export const useColumnsCount = (): 1 | 2 | 3 => {
  const { width: windowWidth } = useWindowSize();
  return useMemo(() => {
    if (windowWidth >= 1200) return 3;
    if (windowWidth >= 768) return 2;

    return 1;
  }, [windowWidth]);
};
