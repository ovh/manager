import React from 'react';
import { Button, Thead, Tr, Th } from '@chakra-ui/react';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { ListingColumn } from './Listing';

export type ListingHeaderSorting<T> = {
  column?: ListingColumn<T>;
  reverse?: boolean;
};

export type ListingHeaderProps<T> = {
  columns: ListingColumn<T>[];
  sort: ListingHeaderSorting<T>;
  onColumnSort: (sort: ListingHeaderSorting<T>) => void;
};

export default function ListingHeader<T>({
  columns = [],
  sort = null,
  onColumnSort,
}: ListingHeaderProps<T>): JSX.Element {
  return (
    <Thead>
      <Tr>
        {columns.map((column) => {
          if (column.sort) {
            return (
              <Th key={column.label}>
                <Button
                  variant="ghost"
                  onClick={() => {
                    const reverse =
                      sort?.column === column ? !sort?.reverse : false;
                    onColumnSort({ column, reverse });
                  }}
                >
                  {column.label}
                  {sort?.column === column && sort?.reverse && (
                    <ChevronDownIcon ml={2} />
                  )}
                  {sort?.column === column && !sort?.reverse && (
                    <ChevronUpIcon ml={2} />
                  )}
                </Button>
              </Th>
            );
          }
          return <Th key={column.label}>{column.label}</Th>;
        })}
      </Tr>
    </Thead>
  );
}
