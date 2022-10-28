import React from 'react';
import { Flex, Spacer, Stack, HStack } from '@chakra-ui/react';
import { Filter, FilterComparator } from '@ovh-ux/manager-core-api';

import ListingTable, {
  ListingTableData,
  ListingTableState,
} from './ListingTable';
import ListingFilterAdder from './ListingFilterAdder';
import ListingFilters from './ListingFilters';
import ActionMenu, {
  ActionMenuProps,
  MenuActionButtonProps,
} from '../ActionMenu';
import SearchInput from '../SearchInput';
import ActionButton, { ActionButtonProps } from '../ActionButton';

export type ListingColumn<T> = {
  key: string;
  label: string;
  renderer?: ({ item }: { item: T }) => JSX.Element;
  sortable?: boolean;
  filterable?: FilterComparator[];
  search?: boolean;
  hidden?: boolean;
};

type MainActionButtonProps = ActionMenuProps | ActionButtonProps;
type ListingActionColumnActionProps = Omit<
  MenuActionButtonProps,
  'label' | 'title' | 'to'
> & {
  label: string | ((data?: unknown) => string);
  title?: string | ((data?: unknown) => string);
  to?: string | ((data?: unknown) => string);
};

export type ListingActionColumnProps = Omit<
  ActionMenuProps,
  'disabled' | 'actions'
> & {
  disabled?: boolean | ((data?: unknown) => boolean);
  actions?: ListingActionColumnActionProps[];
};

export type ListingProps<T> = {
  columns: ListingColumn<T>[];
  data: ListingTableData<T>;
  state: ListingState;
  onChange: (state: ListingState) => void;
  onColumnsChange: (columns: ListingColumn<T>[]) => void;
  actionButton?: MainActionButtonProps;
  actionColumn?: ListingActionColumnProps;
};

export type ListingState = {
  table: ListingTableState;
  filters: Filter[];
};

export type ListingData<T> = ListingTableData<T>;

const getMainActionButton = (
  actionButtonProp: MainActionButtonProps,
): JSX.Element => {
  if (!actionButtonProp) {
    return <></>;
  }

  const actionMenuProp = actionButtonProp as ActionMenuProps;

  if (!actionMenuProp.actions) {
    return <ActionButton {...(actionButtonProp as ActionButtonProps)} />;
  }

  return <ActionMenu {...actionMenuProp} />;
};

export default function Listing<T>({
  columns,
  data,
  state,
  onChange,
  onColumnsChange,
  actionButton,
  actionColumn,
}: ListingProps<T>): JSX.Element {
  const searchColumn = columns.find((c) => c.search);

  return (
    <Stack>
      <Flex>
        {getMainActionButton(actionButton)}
        <Spacer />
        <HStack>
          {searchColumn && (
            <SearchInput
              onSubmit={(value) => {
                const { filters = [] } = state;
                filters.push({
                  key: searchColumn.key,
                  value,
                  comparator: FilterComparator.Includes,
                });
                onChange({
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
              const { filters = [] } = state;
              filters.push({
                key: column.key,
                value,
                comparator,
              });
              onChange({
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
          onChange({
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
          onChange({
            ...state,
            table,
          })
        }
        onColumnsChange={onColumnsChange}
        actionColumn={actionColumn}
      />
    </Stack>
  );
}
