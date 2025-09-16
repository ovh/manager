import { useEffect, useState } from 'react';

export function usePaginatedItems<T>(allItems: T[], itemsPerPage = 10) {
  const [nbDisplayedPages, setNbDisplayedPages] = useState<number>(0);
  const nbPages = Math.ceil(allItems.length / itemsPerPage);
  const maxNbItemsToDisplay = nbDisplayedPages * itemsPerPage;
  const flattenData = allItems.slice(0, maxNbItemsToDisplay);
  const hasNextPage = nbDisplayedPages < nbPages;

  useEffect(() => {
    // Initialize it to first page on item load.
    setNbDisplayedPages(Math.min(1, nbPages));
  }, [allItems, itemsPerPage]);

  const fetchNextPage = () => {
    if (hasNextPage) {
      setNbDisplayedPages((previous) => previous + 1);
    }
  };

  return {
    flattenData,
    hasNextPage,
    fetchNextPage,
  };
}
