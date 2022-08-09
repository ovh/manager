import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Flex,
  VStack,
  Spacer,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Tr,
} from '@chakra-ui/react';

import { ListingColumn } from './Listing';
import ListingTableHead, { ListingTableHeadSorting } from './ListingTableHead';
import ListingTableCell from './ListingTableCell';
import Pagination from '@/components/Pagination';

export type ListingTableState = {
  currentPage: number;
  pageSize: number;
  sort?: ListingTableHeadSorting;
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
  onColumnsChange: (columns: ListingColumn<T>[]) => void;
};

export default function ListingTable<T>({
  columns,
  data,
  state,
  onChange,
  onColumnsChange,
}: ListingTableProps<T>): JSX.Element {
  const { t } = useTranslation('common');
  const { currentPage, pageSize } = state;
  const visibleColumns = columns.filter((c) => !c.hidden);

  const cells = useMemo(() => {
    if (!data?.items)
      return (
        <Tr>
          <Td colSpan={columns.length + 1} textAlign="center">
            <Spinner m={4} size="lg" />
          </Td>
        </Tr>
      );
    if (data.items.length === 0)
      return (
        <Tr>
          <Td colSpan={columns.length + 1} textAlign="center">
            {t('no_results')}
          </Td>
        </Tr>
      );
    return data.items.map((item, index) => (
      <Tr key={index}>
        {visibleColumns.map((column, colIndex) => (
          <Td
            key={`${column.key}-${index}`}
            colSpan={colIndex + 1 === visibleColumns.length ? 2 : 1}
          >
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
          <ListingTableHead
            columns={columns}
            sort={state.sort}
            onColumnSort={(sort) => onChange({ ...state, sort })}
            onColumnVisibilityChange={(column, isVisible) =>
              onColumnsChange(
                columns.map((c) => {
                  if (c === column) {
                    return { ...column, hidden: !isVisible };
                  }
                  return c;
                }),
              )
            }
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
