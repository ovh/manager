import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

const usePageQuery = () => {
  const [searchParams] = useSearchParams();

  return useMemo(() => {
    const page = searchParams.get('page');
    return page ? `?page=${page}` : '';
  }, [searchParams]);
};

export default usePageQuery;
