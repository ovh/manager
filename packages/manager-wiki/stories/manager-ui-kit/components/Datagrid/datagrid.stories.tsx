import React, { useMemo, useState } from 'react';
import {
  Button,
  BUTTON_SIZE,
  FormField,
  FormFieldLabel,
  Icon,
  ICON_NAME,
  Input,
  TABLE_SIZE,
  TABLE_VARIANT,
} from '@ovhcloud/ods-react';
import type { Row } from '@tanstack/react-table';
import { Datagrid, DatagridProps, useColumnFilters } from '@ovh-ux/muk';
import {
  applyFilters,
  FilterCategories,
  FilterComparator,
} from '@ovh-ux/manager-core-api';
import {
  ExpandedState,
  RowSelectionState,
  SortingState,
  VisibilityState,
} from '@tanstack/react-table';
import { withRouter } from 'storybook-addon-react-router-v6';

const columns = [
  {
    id: 'person',
    label: 'Person',
    accessorKey: 'person',
    header: 'Person',
    enableHiding: true,
    comparator: FilterCategories.String,
    cell: ({ getValue }) => <div>{getValue()}</div>,
  },
  {
    id: 'mostInterestIn',
    label: 'Most interest in',
    accessorKey: 'mostInterestIn',
    header: 'Most interest in',
    enableHiding: true,
    type: FilterCategories.String,
    cell: ({ getValue }) => <div>{getValue()}</div>,
  },
  {
    id: 'age',
    label: 'Age',
    accessorKey: 'age',
    header: 'Age',
    enableHiding: false,
    type: FilterCategories.Numeric,
    cell: ({ getValue }) => <div>{getValue()}</div>,
  },
];

const data = [
  {
    id: 'fjejfoirejfoierjfoier-id-1',
    person: 'John Doe',
    mostInterestIn: '	HTML tables',
    age: 25,
  },
  {
    id: 'zfdfdsdsfdsfds-id-2',
    person: 'Jane Doe',
    mostInterestIn: 'Web accessibility',
    age: 26,
  },
  {
    id: 'fdfdsds-id-3',
    person: 'Sarah',
    mostInterestIn: 'JavaScript frameworks',
    age: 25,
  },
  {
    id: 'fdfdsds-id-4',
    person: 'Karen',
    mostInterestIn: '	Web performance',
    age: 26,
  },
];

type DatagridStoryData = {
  id: string;
  person: string;
  mostInterestIn: string;
  age: number;
  subRows?: DatagridStoryData[];
};

const DatagridStory = (args: DatagridProps<DatagridStoryData>) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [searchInput, setSearchInput] = useState('');
  const sortAttrs = {
    sorting,
    setSorting,
    manualSorting: false,
  };
  const [isFetchAll, setIsFetchAll] = useState(false);
  const [items, setItems] = useState(args.data);
  const cols = args.columns;
  const fetchAllPages = () => {
    const newData = Array.from({ length: 10000 }, (_, index) => ({
      ...items[index],
      id: `person-${items.length + index}`,
      person: `Most interest in ${items.length + index}`,
      mostInterestIn: `Most interest in ${items.length + index}`,
      age: index + 1,
    }));
    setItems([...items, ...newData]);
  };

  const [containerHeightState, setContainerHeightState] = useState(
    args.containerHeight,
  );
  const [containerHeightStyle, setContainerHeightStyle] = useState(
    args.containerHeight,
  );
  const {
    autoScroll,
    renderSubComponent,
    subComponentHeight,
    maxRowHeight,
    isLoading,
    size,
    variant,
    totalCount,
    topbar,
    hideHeader,
  } = args;
  const { filters, addFilter, removeFilter } = useColumnFilters();
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const onSearch = (search: string) => {
    const tmp = applyFilters(
      args.data,
      !search || search.length === 0
        ? filters
        : [
            {
              key: 'person',
              value: searchInput,
              comparator: FilterComparator.Includes,
            },
            ...filters,
          ],
    );
    setItems(tmp);
  };
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const colsArgs = useMemo(
    () =>
      cols.map((col) => ({
        ...col,
        ...('sorting' in args && { isSortable: true }),
        ...('search' in args && { isSearchable: true }),
        ...('filters' in args && { isFilterable: true }),
      })),
    [cols, args],
  );

  const itemsArgs = useMemo(
    () =>
      items?.map((col, indexItems) => ({
        ...col,
        ...('subRows' in args && {
          subRows: Array.from({ length: 5 }, (_, index) => ({
            id: `sub-${indexItems}-${index}`,
            person: `Most interest in ${index + (indexItems * 2 + 888888)}`,
            mostInterestIn: `Most interest in ${index +
              (indexItems * 2 + 888888)}`,
            age: index + (indexItems * 2 + 888888),
          })),
        }),
      })),
    [items, args],
  );
  return (
    <>
      <Datagrid
        columns={colsArgs}
        data={applyFilters(itemsArgs, filters)}
        {...('size' in args && { size })}
        {...('variant' in args && { variant })}
        {...('containerHeight' in args && {
          containerHeight: containerHeightStyle,
        })}
        {...('manualSorting' in args && { sorting: { ...sortAttrs } })}
        {...('onFetchAllPages' in args &&
          !isFetchAll && {
            hasNextPage: true,
            onFetchAllPages: () => {
              setIsFetchAll(true);
              fetchAllPages();
            },
          })}
        {...('onFetchNextPage' in args &&
          !isFetchAll && {
            hasNextPage: true,
            onFetchNextPage: () =>
              setItems([
                ...items,
                {
                  id: `person-${items.length + 1}`,
                  person: `Person ${items.length + 1}`,
                  mostInterestIn: `Most interest in ${items.length + 1}`,
                  age: items.length + 1,
                },
              ]),
        })}
        {...('hideHeader' in args && { hideHeader })}
        {...('renderSubComponent' in args && { renderSubComponent })}
        {...('subComponentHeight' in args && { subComponentHeight })}
        {...('maxRowHeight' in args && { maxRowHeight })}
        {...('isLoading' in args && { isLoading })}
        {...('totalCount' in args && { totalCount })}
        {...('expandable' in args && {
          expandable: {
            expanded,
            setExpanded,
          },
        })}
        {...('autoScroll' in args && { autoScroll })}
        {...('columnVisibility' in args && {
          columnVisibility: {
            columnVisibility,
            setColumnVisibility,
          },
        })}

        {...('topbar' in args && { topbar })}
        {...('filters' in args && {
          filters: {
            filters,
            add: addFilter,
            remove: removeFilter,
          },
        })}
        {...('search' in args && {
          search: { searchInput, setSearchInput, onSearch },
        })}
        {...('rowSelection' in args && {
          rowSelection: {
            rowSelection,
            setRowSelection,
          },
        })}
      />
      { Object.keys(rowSelection)?.length > 0 && (
        <div className="p-4">
          <h3>Row Selection</h3>
          <div className="bg-gray-100 p-2 rounded-md">{JSON.stringify(rowSelection)}</div>
        </div>
      )}
    </>
  );
};

export const Default = DatagridStory.bind({});

Default.args = {
  columns,
  data,
};

export const Size = DatagridStory.bind({});

Size.args = {
  columns,
  data,
  size: TABLE_SIZE.sm,
};

export const Variant = DatagridStory.bind({});

Variant.args = {
  columns,
  data,
  variant: TABLE_VARIANT.striped,
};

export const Sorting = DatagridStory.bind({});

Sorting.args = {
  columns,
  data,
  manualSorting: false,
  sorting: {
    sorting: [],
    setSorting: () => {},
    manualSorting: false,
  },
};

export const Loading = DatagridStory.bind({});

Loading.args = {
  columns,
  data: [],
  isLoading: true,
};

export const LoadMore = DatagridStory.bind({});

LoadMore.args = {
  columns,
  data: [...data],
  hasNextPage: true,
  onFetchNextPage: () => {},
};

export const LoadAllAndLoading = DatagridStory.bind({});

LoadAllAndLoading.args = {
  columns,
  data: [...data],
  manualSorting: false,
  hasNextPage: true,
  onFetchAllPages: () => {},
  onFetchNextPage: () => {},
};

export const SubComponent = DatagridStory.bind({});

SubComponent.args = {
  columns,
  data: [...data],
  autoScroll: false,
  renderSubComponent: (row: any) => (
    <>
      <div>{row.original.person}</div>
      <div>{row.original.mostInterestIn}</div>
      <div>{row.original.age}</div>
    </>
  ),
  subComponentHeight: 80,
  size: TABLE_SIZE.md,
};

export const Expandable = DatagridStory.bind({});

Expandable.args = {
  columns,
  data: [...data],
  expandable: {
    expanded: {},
    setExpanded: () => {},
  },
  autoScroll: false,
  subComponentHeight: 80,
  subRows: true,
};

export const VisibilityColumns = DatagridStory.bind({});

VisibilityColumns.args = {
  columns,
  data: [...data],
  manualSorting: false,
  columnVisibility: {
    columnVisibility: { person: true, mostInterestIn: true, age: true },
    setColumnVisibility: () => {},
  },
};

export const Filtering = DatagridStory.bind({});

Filtering.args = {
  columns,
  data: [...data],
  filters: {
    filters: [],
    add: () => {},
    remove: () => {},
  },
};

export const Search = DatagridStory.bind({});

Search.args = {
  columns,
  data: [...data],
  search: {
    searchInput: '',
    setSearchInput: () => {},
    onSearch: () => {},
  },
};

export const RowSelection = DatagridStory.bind({});

RowSelection.args = {
  columns,
  data: [...data],
  rowSelection: {
    rowSelection: [],
    setRowSelection: () => {},
    onRowSelectionChange: () => {},
    enableRowSelection: (row: Row<DatagridStoryData>) => row?.original?.age === 26,
  },
};

export const HideHeader = DatagridStory.bind({});

HideHeader.args = {
  columns,
  data: [...data],
  hideHeader: true,
};

export const Topbar = DatagridStory.bind({});

Topbar.args = {
  columns,
  data: [...data],
  topbar: (
    <div>
      <Button size={BUTTON_SIZE.sm}>
        <Icon name={ICON_NAME.plus} />
        Add New
      </Button>
    </div>
  ),
  filters: {
    filters: [],
    add: () => {},
    remove: () => {},
  },
  search: {
    searchInput: '',
    setSearchInput: () => {},
    onSearch: () => {},
  },
  rowSelection: {
    rowSelection: [],
    setRowSelection: () => {},
    onRowSelectionChange: () => {},
  },
  columnVisibility: {
    columnVisibility: { person: true, mostInterestIn: true, age: true },
    setColumnVisibility: () => {},
  },
};

export const TotalCount = DatagridStory.bind({});

TotalCount.args = {
  columns,
  data: [...data],
  totalCount: 4,
};

export const FullFooter = DatagridStory.bind({});

FullFooter.args = {
  columns,
  data: [...data],
  hasNextPage: true,
  onFetchAllPages: () => {},
  onFetchNextPage: () => {},
  totalCount: 4,
};

const meta = {
  title: 'Manager UI Kit/Components/Datagrid',
  component: Datagrid,
  tags: ['autodocs'],
  decorators: [withRouter],
  parameters: {
    docs: {
      description: {
        component:
          'The `Datagrid` component provides a powerful data table with built-in pagination controls. The footer actions section includes "Load More" and "Load All" buttons for progressive data loading.',
      },
    },
    preserveArgs: false,
  },
  args: {
    containerHeight: 250,
  },
  argTypes: {
    size: {
      description: 'Controls the table row size',
      control: 'select',
      options: [TABLE_SIZE.sm, TABLE_SIZE.md, TABLE_SIZE.lg],
    },
    variant: {
      description: 'Controls the table variant style',
      control: 'select',
      options: [TABLE_VARIANT.default, TABLE_VARIANT.striped],
    },
    hasNextPage: {
      description: 'Controls whether pagination buttons are shown',
      control: 'boolean',
    },
    isLoading: {
      description: 'Shows loading state on pagination buttons',
      control: 'boolean',
    },
  },
};

export default meta;
