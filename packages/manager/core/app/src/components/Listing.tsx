import React, { useMemo } from 'react';
import {
  Button,
  Flex,
  VStack,
  Skeleton,
  Spacer,
  Table,
  TableContainer,
  Thead,
  Tbody,
  Td,
  Tr,
  Th,
} from '@chakra-ui/react';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';

import ListingPagination from './ListingPagination';

export type ListingSorter<T> = (a: T, b: T) => number;

export type ListingColumn<T> = {
  label: string;
  sort?: ListingSorter<T>;
  render: (item: T) => JSX.Element;
};

export type ListingState<T> = {
  currentPage: number;
  pageSize: number;
  sort?: {
    column: ListingColumn<T>;
    reverse: boolean;
  };
};

export type ListingData<T> = {
  total: number;
  items: T[];
};

export type ListingProps<T> = {
  columns: ListingColumn<T>[];
  data?: ListingData<T>;
  state: ListingState<T>;
  onChange: (state: ListingState<T>) => void;
};

interface ListingItem {
  id: string;
};

export default function Listing<T extends ListingItem>({
  columns,
  data,
  state,
  onChange,
}: ListingProps<T>): JSX.Element {
  const { currentPage, pageSize } = state;

  const paginationChangeHandler = (page: number, size: number) => {
    onChange({ ...state, currentPage: page, pageSize: size });
  };

  const columnClickHandler = (column: ListingColumn<T>) => {
    const reverse = state.sort?.column === column ? !state.sort.reverse : false;
    onChange({
      ...state,
      sort: {
        column,
        reverse,
      },
    });
  };

  const columnsData = useMemo(
    () =>
      columns.map((column) => {
        if (column.sort) {
          return (
            <Th key={column.label}>
              <Button
                variant="ghost"
                onClick={() => columnClickHandler(column)}
              >
                {column.label}
                {state.sort?.column === column && state.sort?.reverse && (
                  <ChevronDownIcon ml={2} />
                )}
                {state.sort?.column === column && !state.sort?.reverse && (
                  <ChevronUpIcon ml={2} />
                )}
              </Button>
            </Th>
          );
        }
        return <Th key={column.label}>{column.label}</Th>;
      }),
    [columns, state],
  );

  const placeholder = useMemo(() => {
    return [...Array(10).keys()].map((row) => (
      <Tr key={`${row}`}>
        {columns.map((column, col) => (
          <Td key={`${col}-${row}`}>
            <Skeleton isLoaded={false}>
              <span>&nbsp;</span>
            </Skeleton>
          </Td>
        ))}
      </Tr>
    ));
  }, []);

  const cells = useMemo(() => {
    if (!data?.items) return placeholder;
    return data.items.map((item) => (
      <Tr key={item.id}>
        {columns.map(({ label, render }) => (
          <Td key={`${label}-${item.id}`}>{render(item)}</Td>
        ))}
      </Tr>
    ));
  }, [data, columns]);

  return (
    <VStack align="left">
      <TableContainer>
        <Table>
          <Thead>
            <Tr>{columnsData}</Tr>
          </Thead>
          <Tbody>{cells}</Tbody>
        </Table>
      </TableContainer>
      {data && (
        <Flex>
          <Spacer />
          <ListingPagination
            currentPage={currentPage}
            pageSize={pageSize}
            itemsCount={data.total}
            onChange={paginationChangeHandler}
          />
        </Flex>
      )}
    </VStack>
  );
}
