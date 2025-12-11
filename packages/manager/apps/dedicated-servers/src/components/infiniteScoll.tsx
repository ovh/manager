import React, { useEffect, useCallback, useState, FC, ReactNode } from 'react';
import { OdsSpinner } from '@ovhcloud/ods-components/react';
import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';

type InfiniteScrollType = {
  children: ReactNode;
  hasNextPage: boolean;
  fetchNextPage: () => Promise<unknown> | void;
};

const InfiniteScroll: FC<InfiniteScrollType> = ({
  children,
  fetchNextPage,
  hasNextPage,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleScroll = useCallback(() => {
    if (
      hasNextPage &&
      !isLoading &&
      Math.round(window.innerHeight + document.documentElement.scrollTop) ===
        document.documentElement.offsetHeight
    ) {
      (async () => {
        setIsLoading(true);
        await fetchNextPage();
        setIsLoading(false);
      })();
    }
  }, [document.documentElement.scrollTop]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, [document.documentElement.scrollTop]);

  return (
    <>
      {children}
      {isLoading && (
        <div className="flex justify-center">
          <OdsSpinner size={ODS_SPINNER_SIZE.md} className="mt-8" />
        </div>
      )}
    </>
  );
};

export default InfiniteScroll;
