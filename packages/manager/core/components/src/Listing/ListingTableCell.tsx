import React from 'react';
import { ListingColumn } from './Listing';

type ListingTableCellProps<T> = {
  item: T;
  column: ListingColumn<T>;
};

export default function ListingTableCell<T>({
  item,
  column,
}: ListingTableCellProps<T>): JSX.Element {
  const defaultItemRenderer = ({
    item: cellItem,
  }: {
    item: T;
  }): JSX.Element => <>{`${cellItem[column.key as keyof T]}`}</>;
  const Renderer = column.renderer || defaultItemRenderer;

  return <Renderer item={item} />;
}
