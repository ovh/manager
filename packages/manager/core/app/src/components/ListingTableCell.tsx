import React, { useEffect, useState } from 'react';
import { Skeleton } from '@chakra-ui/react';
import { ListingColumn } from './Listing';

type ListingTableCellProps<T> = {
  item: T;
  column: ListingColumn<T>;
};

export default function ListingTableCell<T>({
  item,
  column,
}: ListingTableCellProps<T>): JSX.Element {
  const [element, setElement] = useState<JSX.Element>();
  const defaultItemRenderer = () => <>{`${item[column.key as keyof T]}`}</>;
  const renderer = column.renderer || defaultItemRenderer;

  useEffect(() => {
    try {
      const elementOrPromise = renderer(item);
      Promise.resolve(elementOrPromise)
        .then(setElement)
        .catch((error) => {
          throw error;
        });
    } catch {
      setElement(<>#Error</>);
    }
  }, []);

  return (
    element || (
      <Skeleton isLoaded={false}>
        <span>&nbsp;</span>
      </Skeleton>
    )
  );
}
