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

export type ListingColumn<T> = {
  key: string;
  label: string;
  renderer?: (item: T) => JSX.Element;
};

export type ListingState = {
  currentPage: number;
  pageSize: number;
  sort?: ListingHeaderSorting;
};

export type ListingData<T> = {
  total: number;
  items: T[];
};

export type ListingProps<T> = {
  columns: ListingColumn<T>[];
  data?: ListingData<T>;
  state: ListingState;
  onChange: (state: ListingState) => void;
};

export default function Listing<T>({
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
    return data.items.map((item, index) => (
      <Tr key={index}>
        {columns.map(({ key, renderer }) => (
          <Td key={`${key}-${index}`}>
            {renderer ? renderer(item) : item[key as keyof T]}
          </Td>
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
