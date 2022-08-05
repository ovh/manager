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

import { ListingColumn } from './Listing';
import ListingHead, { ListingHeadSorting } from './ListingHead';
import Pagination from './Pagination';
import ListingSkeleton from './ListingSkeleton';

export type ListingTableState = {
  currentPage: number;
  pageSize: number;
  sort?: ListingHeadSorting;
};

export type ListingTableData<T> = {
  total: number;
  items: T[];
};

export type ListingTableProps<T> = {
  columns: ListingColumn<T>[];
  data?: ListingTableData<T>;
  state: ListingTableState;
  onChange: (state: ListingTableState) => void;
};

export default function ListingTable<T>({
  columns,
  data,
  state,
  onChange,
}: ListingTableProps<T>): JSX.Element {
  const { currentPage, pageSize } = state;
  const visibleColumns = columns.filter((c) => !c.hidden);

  const cells = useMemo(() => {
    if (!data?.items)
      return (
        <ListingSkeleton columnsCount={visibleColumns.length} linesCount={10} />
      );
    return data.items.map((item, index) => (
      <Tr key={index}>
        {visibleColumns.map(({ key, renderer }) => (
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
          <ListingHead
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
          <Pagination
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
