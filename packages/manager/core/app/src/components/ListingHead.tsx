import React from 'react';
import { Button, Thead, Tr, Th } from '@chakra-ui/react';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';
import { ListingColumn } from './Listing';

export type ListingHeadSorting = {
  key?: string;
  reverse?: boolean;
};

export type ListingHeadProps<T> = {
  columns: ListingColumn<T>[];
  sort: ListingHeadSorting;
  onColumnSort: (sort: ListingHeadSorting) => void;
};

export default function ListingHead<T>({
  columns = [],
  sort = null,
  onColumnSort,
}: ListingHeadProps<T>): JSX.Element {
  return (
    <Thead>
      <Tr>
        {columns.map(({ key, label }) => {
          return (
            <Th key={key}>
              <Button
                variant="ghost"
                onClick={() => {
                  const reverse = sort?.key === key ? !sort?.reverse : false;
                  onColumnSort({ key, reverse });
                }}
              >
                {label}
                {sort?.key === key && sort?.reverse && (
                  <ChevronDownIcon ml={2} />
                )}
                {sort?.key === key && !sort?.reverse && (
                  <ChevronUpIcon ml={2} />
                )}
              </Button>
            </Th>
          );
          return <Th key={key}>{label}</Th>;
        })}
      </Tr>
    </Thead>
  );
}
