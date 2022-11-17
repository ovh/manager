import React from 'react';
import { Button, Flex, Spacer, Thead, Tr, Th } from '@chakra-ui/react';
import { SortDownIcon, SortUpIcon } from '@ovh-ux/manager-themes';
import { ListingColumn } from './Listing';
import ListingColumnToggler from './ListingColumnToggler';

export type ListingTableHeadSorting = {
  key?: string;
  reverse?: boolean;
};

export type ListingTableHeadProps<T> = {
  columns: ListingColumn<T>[];
  sort: ListingTableHeadSorting;
  onColumnSort: (sort: ListingTableHeadSorting) => void;
  onColumnVisibilityChange: (
    column: ListingColumn<T>,
    isVisible: boolean,
  ) => void;
};

export default function ListingTableHead<T>({
  columns = [],
  sort = null,
  onColumnSort,
  onColumnVisibilityChange,
}: ListingTableHeadProps<T>): JSX.Element {
  const visibleColumns = columns.filter((c) => !c.hidden);
  return (
    <Thead>
      <Tr>
        {visibleColumns.map(({ key, label, sortable }) => {
          return (
            <Th key={key}>
              {sortable && (
                <Button
                  variant="table"
                  onClick={() => {
                    const reverse = sort?.key === key ? !sort?.reverse : false;
                    onColumnSort({ key, reverse });
                  }}
                >
                  {label}
                  {sort?.key === key && sort?.reverse && (
                    <SortDownIcon ml={2} />
                  )}
                  {sort?.key === key && !sort?.reverse && <SortUpIcon ml={2} />}
                </Button>
              )}
              {!sortable && label}
            </Th>
          );
          return <Th key={key}>{label}</Th>;
        })}
        <Th>
          <Flex>
            <Spacer />
            <ListingColumnToggler
              columns={columns}
              onColumnVisibilityChange={onColumnVisibilityChange}
            />
          </Flex>
        </Th>
      </Tr>
    </Thead>
  );
}
