import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
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
import ListingTableCell from './ListingTableCell';

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
  const { t } = useTranslation('common');
  const { currentPage, pageSize } = state;
  const visibleColumns = columns.filter((c) => !c.hidden);

  const cells = useMemo(() => {
    if (!data?.items)
      return (
        <ListingSkeleton columnsCount={visibleColumns.length} linesCount={10} />
      );
    if (data.items.length === 0)
      return (
        <Tr>
          <Td colSpan={columns.length} textAlign="center">
            {t('no_results')}
          </Td>
        </Tr>
      );
    return data.items.map((item, index) => (
      <Tr key={index}>
        {visibleColumns.map((column) => (
          <Td key={`${column.key}-${index}`}>
            <ListingTableCell item={item} column={column} />
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
