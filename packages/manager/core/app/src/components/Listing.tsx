import React, { useMemo } from 'react';
import {
  Flex,
  VStack,
  Spacer,
  Table,
  TableContainer,
  Tbody,
  Td,
  Tr,
} from '@chakra-ui/react';

import ListingHeader, { ListingHeaderSorting } from './ListingHeader';
import ListingPagination from './ListingPagination';
import ListingPlaceholder from './ListingPlaceholder';

export type ListingColumnSortingFunction<T> = (a: T, b: T) => number;

export type ListingColumn<T> = {
  label: string;
  render: (item: T) => JSX.Element;
  sort?: ListingColumnSortingFunction<T>;
};

export type ListingState<T> = {
  currentPage: number;
  pageSize: number;
  sort?: ListingHeaderSorting<T>;
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

export interface ListingItem {
  id: string;
}

export default function Listing<T extends ListingItem>({
  columns,
  data,
  state,
  onChange,
}: ListingProps<T>): JSX.Element {
  const { currentPage, pageSize } = state;

  const cells = useMemo(() => {
    if (!data?.items)
      return (
        <ListingPlaceholder columnsCount={columns.length} linesCount={10} />
      );
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
          <ListingHeader
            columns={columns}
            sort={state.sort}
            onColumnSort={(sort) => onChange({ ...state, sort })}
          />
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
            onChange={(page, size) =>
              onChange({ ...state, currentPage: page, pageSize: size })
            }
          />
        </Flex>
      )}
    </VStack>
  );
}
