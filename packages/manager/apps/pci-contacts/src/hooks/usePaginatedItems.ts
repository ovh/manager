import { useEffect, useState } from 'react';

export function usePaginatedItems<T>(allItems: T[], itemsPerBatch = 10) {
  const [nbDisplayedBatchs, setNbDisplayedBatchs] = useState<number>(0);
  const nbBatchs = Math.ceil(allItems.length / itemsPerBatch);
  const maxNbItemsToDisplay = nbDisplayedBatchs * itemsPerBatch;
  const flattenData = allItems.slice(0, maxNbItemsToDisplay);
  const hasNextBatch = nbDisplayedBatchs < nbBatchs;

  useEffect(() => {
    // Initialize it to first batch on item load.
    setNbDisplayedBatchs(Math.min(1, nbBatchs));
  }, [nbBatchs]);

  const fetchNextBatch = () => {
    if (hasNextBatch) {
      setNbDisplayedBatchs((previous) => previous + 1);
    }
  };

  return {
    flattenData,
    hasNextPage: hasNextBatch,
    fetchNextPage: fetchNextBatch,
  };
}
