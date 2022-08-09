import React, { useEffect, useState } from 'react';
import { Flex, Spacer, Stack, HStack } from '@chakra-ui/react';
import { Filter, FilterComparator } from '@/api/filters';
import ListingTable, {
  ListingTableData,
  ListingTableState,
} from './ListingTable';
import ListingFilterAdder from './ListingFilterAdder';
import ListingFilters from './ListingFilters';
import SearchInput from '@/components/SearchInput';

export type ListingColumn<T> = {
  key: string;
  label: string;
  renderer?: (item: T) => JSX.Element | Promise<JSX.Element>;
  sortable?: boolean;
  filterable?: FilterComparator[];
  search?: boolean;
  hidden?: boolean;
};

export type ListingProps<T> = {
  columns: ListingColumn<T>[];
  data: ListingTableData<T>;
  initialState?: ListingState;
  onChange: (state: ListingState) => void;
  onColumnsChange: (columns: ListingColumn<T>[]) => void;
};

export type ListingState = {
  table: ListingTableState;
  filters: Filter[];
};

export type ListingData<T> = ListingTableData<T>;

export default function Listing<T>({
  columns,
  data,
  initialState,
  onChange,
  onColumnsChange,
}: ListingProps<T>): JSX.Element {
  const [state, setState] = useState<ListingState>(
    initialState || {
      table: {
        currentPage: 1,
        pageSize: 10,
        sort: {
          key: columns[0].key,
        },
      },
      filters: [],
    },
  );
  const searchColumn = columns.find((c) => c.search);

  useEffect(() => {
    onChange(state);
  }, [state]);

  return (
    <Stack>
      <Flex>
        <Spacer />
        <HStack>
          {searchColumn && (
            <SearchInput
              onSubmit={(value) => {
                const { filters } = state;
                filters.push({
                  key: searchColumn.key,
                  value,
                  comparator: FilterComparator.Includes,
                });
                setState({
                  ...state,
                  filters,
                  table: {
                    ...state.table,
                    currentPage: 1,
                  },
                });
              }}
            />
          )}
          <ListingFilterAdder
            columns={columns.filter((c) => c.filterable)}
            onAdd={(column, value, comparator) => {
              const { filters } = state;
              filters.push({
                key: column.key,
                value,
                comparator,
              });
              setState({
                ...state,
                filters,
                table: {
                  ...state.table,
                  currentPage: 1,
                },
              });
            }}
          />
        </HStack>
      </Flex>
      <ListingFilters
        columns={columns}
        filters={state.filters}
        onChange={(filters) =>
          setState({
            ...state,
            filters,
          })
        }
      />
      <ListingTable
        columns={columns}
        data={data}
        state={state.table}
        onChange={(table) =>
          setState({
            ...state,
            table,
          })
        }
        onColumnsChange={onColumnsChange}
      />
    </Stack>
  );
}
