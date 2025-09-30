import React, { useState } from 'react';
import {
  Datagrid,
  DatagridProps,
  Text,
  useColumnFilters,
} from '@ovh-ux/manager-react-components';
import {
  FilterComparator,
  applyFilters,
  FilterCategories,
} from '@ovh-ux/manager-core-api';
import {
  FormField,
  FormFieldLabel,
  Input,
  Button,
  Icon,
  ICON_NAME,
  BUTTON_SIZE,
} from '@ovhcloud/ods-react';
import {
  SortingState,
  VisibilityState,
  RowSelectionState,
} from '@tanstack/react-table';
import { withRouter } from 'storybook-addon-react-router-v6';

const columns = [
  {
    id: 'person',
    label: 'Person',
    accessorKey: 'person',
    header: 'Person',
    enableHiding: true,
    isSearchable: true,
    isFilterable: true,
    comparator: FilterCategories.String,
    cell: ({ getValue }) => <div>{getValue()}</div>,
  },
  {
    id: 'mostInterestIn',
    label: 'Most interest in',
    accessorKey: 'mostInterestIn',
    header: 'Most interest in',
    enableHiding: true,
    isFilterable: true,
    type: FilterCategories.String,
    cell: ({ getValue }) => <div>{getValue()}</div>,
  },
  {
    id: 'age',
    label: 'Age',
    accessorKey: 'age',
    header: 'Age',
    enableHiding: false,
    isFilterable: true,
    type: FilterCategories.Numeric,
    cell: ({ getValue }) => <div>{getValue()}</div>,
  },
];

const data = [
  {
    person: 'John Doe',
    mostInterestIn: '	HTML tables',
    age: 25,
    subRows: Array.from({ length: 5 }, (_, index) => ({
      person: `Most interest in ${index + 999999}`,
      mostInterestIn: `Most interest in ${index + 999999}`,
      age: index + 999999,
    })),
  },
  {
    person: 'Jane Doe',
    mostInterestIn: 'Web accessibility',
    age: 26,
    subRows: Array.from({ length: 5 }, (_, index) => ({
      person: `Most interest in ${index + 888888}`,
      mostInterestIn: `Most interest in ${index + 888888}`,
      age: index + 888888,
    })),
  },
  {
    person: 'Sarah',
    mostInterestIn: 'JavaScript frameworks',
    age: 25,
    subRows: Array.from({ length: 5 }, (_, index) => ({
      person: `Most interest in ${index + 777777}`,
      mostInterestIn: `Most interest in ${index + 777777}`,
      age: index + 777777,
    })),
  },
  {
    person: 'Karen',
    mostInterestIn: '	Web performance',
    age: 26,
    subRows: Array.from({ length: 5 }, (_, index) => ({
      person: `Most interest in ${index + 666666}`,
      mostInterestIn: `Most interest in ${index + 666666}`,
      age: index + 666666,
    })),
  },
];

const DatagridStory = (args: DatagridProps<Record<string, unknown>>) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [searchInput, setSearchInput] = useState('');
  const sortAttrs = {
    sorting,
    onSortChange: setSorting,
    manualSorting: args.manualSorting,
  };
  const [isFetchAll, setIsFetchAll] = useState(false);
  const [items, setItems] = useState(args.data);
  const cols = args.columns;
  const fetchAllPages = () => {
    const newData = Array.from({ length: 10000 }, (_, index) => ({
      ...items[index],
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
    expandable,
    autoScroll,
    renderSubComponent,
    subComponentHeight,
    maxRowHeight,
    isLoading,
    totalCount,
    onFetchNextPage,
    onFetchAllPages,
    manualSorting,
    topbar,
    enableFilter,
    enableSearch,
    enableColumnvisibility,
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

  console.info('sortAttrs : ', sortAttrs);
  return (
    <>
      {'containerHeight' in args && (
        <div className="py-4">
          <div className="max-w-[200px]">
            <FormField>
              <FormFieldLabel>Container Height</FormFieldLabel>
              <Input
                value={containerHeightState}
                onChange={(e) =>
                  setContainerHeightState(Number(e.target.value))
                }
              />
              <Button
                onClick={() => setContainerHeightStyle(containerHeightState)}
              >
                Update
              </Button>
            </FormField>
          </div>
        </div>
      )}
      <Datagrid
        columns={cols}
        data={applyFilters(items, filters)}
        {...('containerHeight' in args && {
          containerHeight: containerHeightStyle,
        })}
        {...('manualSorting' in args && { ...sortAttrs })}
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
                  person: `Person ${items.length + 1}`,
                  mostInterestIn: `Most interest in ${items.length + 1}`,
                  age: items.length + 1,
                },
              ]),
          })}
        {...('renderSubComponent' in args && { renderSubComponent })}
        {...('subComponentHeight' in args && { subComponentHeight })}
        {...('maxRowHeight' in args && { maxRowHeight })}
        {...('isLoading' in args && { isLoading })}
        {...('totalCount' in args && { totalCount })}
        {...('expandable' in args && { expandable })}
        {...('autoScroll' in args && { autoScroll })}
        {...('columnVisibility' in args && { columnVisibility })}
        {...('setColumnVisibility' in args && { setColumnVisibility })}
        {...('topbar' in args && { topbar })}
        {...('filters' in args && {
          filters: { filters, add: addFilter, remove: removeFilter },
        })}
        {...('enableFilter' in args && { enableFilter })}
        {...('enableSearch' in args && { enableSearch })}
        {...('enableColumnvisibility' in args && { enableColumnvisibility })}
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
    </>
  );
};

export const Default = DatagridStory.bind({});

Default.args = {
  columns,
  data,
};

export const Sorting = DatagridStory.bind({});

Sorting.args = {
  columns,
  data,
  manualSorting: false,
};

export const Loading = DatagridStory.bind({});

Loading.args = {
  columns: [],
  data,
  isLoading: true,
};

export const LoadMore = DatagridStory.bind({});

LoadMore.args = {
  columns,
  data,
  manualSorting: false,
  hasNextPage: true,
  onFetchNextPage: () => {},
};

export const LoadAll = DatagridStory.bind({});

LoadAll.args = {
  columns,
  data,
  manualSorting: false,
  hasNextPage: true,
  onFetchAllPages: () => {},
};

export const LoadAllAndLoading = DatagridStory.bind({});

LoadAllAndLoading.args = {
  columns,
  data,
  manualSorting: false,
  hasNextPage: true,
  onFetchAllPages: () => {},
  onFetchNextPage: () => {},
};

export const ContainerHeight = DatagridStory.bind({});

ContainerHeight.args = {
  columns,
  data,
  manualSorting: false,
  hasNextPage: true,
  onFetchAllPages: () => {},
  onFetchNextPage: () => {},
  containerHeight: '260px',
};

export const SubComponent = DatagridStory.bind({});

SubComponent.args = {
  columns,
  data,
  manualSorting: false,
  hasNextPage: true,
  autoScroll: false,
  onFetchNextPage: () => {},
  renderSubComponent: (row: any) => (
    <>
      <div>{row.original.person}</div>
      <div>{row.original.mostInterestIn}</div>
      <div>{row.original.age}</div>
    </>
  ),
  subComponentHeight: 80,
  totalCount: 4,
};

export const Expandable = DatagridStory.bind({});

Expandable.args = {
  columns,
  data,
  manualSorting: false,
  expandable: true,
  autoScroll: false,
  subComponentHeight: 80,
  totalCount: 4,
};

export const VisibilityColumns = DatagridStory.bind({});

VisibilityColumns.args = {
  columns,
  data,
  manualSorting: false,
  columnVisibility: { person: true, mostInterestIn: true, age: true },
  setColumnVisibility: () => {},
  enableColumnvisibility: true,
};

export const Filtering = DatagridStory.bind({});

Filtering.args = {
  columns,
  data,
  filters: {
    filters: [],
    add: () => {},
    remove: () => {},
  },
  enableFilter: true,
};

export const Search = DatagridStory.bind({});

Search.args = {
  columns,
  data,
  search: {
    searchInput: '',
    setSearchInput: () => {},
    onSearch: () => {},
  },
  enableSearch: true,
};

export const RowSelection = DatagridStory.bind({});

RowSelection.args = {
  columns,
  data,
  rowSelection: {
    rowSelection: [],
    setRowSelection: () => {},
    onRowSelectionChange: () => {},
  },
};

export const Topbar = DatagridStory.bind({});

Topbar.args = {
  columns,
  data,
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
  enableFilter: true,
  search: {
    searchInput: '',
    setSearchInput: () => {},
    onSearch: () => {},
  },
  enableSearch: true,
  rowSelection: {
    rowSelection: [],
    setRowSelection: () => {},
    onRowSelectionChange: () => {},
  },
  columnVisibility: { person: true, mostInterestIn: true, age: true },
  setColumnVisibility: () => {},
  enableColumnvisibility: true,
};

const meta = {
  title: 'Manager React Components/Components/Datagrid New',
  component: Datagrid,
  decorators: [withRouter],
  parameters: {
    docs: {
      description: {
        component:
          'The `Datagrid` component provides a powerful data table with built-in pagination controls. The footer actions section includes "Load More" and "Load All" buttons for progressive data loading.',
      },
    },
  },
  argTypes: {
    hasNextPage: {
      description: 'Controls whether pagination buttons are shown',
      control: 'boolean',
    },
    onFetchNextPage: {
      description: 'Callback function triggered when "Load More" is clicked',
      action: 'fetchNextPage',
    },
    onFetchAllPages: {
      description: 'Callback function triggered when "Load All" is clicked',
      action: 'fetchAllPages',
    },
    isLoading: {
      description: 'Shows loading state on pagination buttons',
      control: 'boolean',
    },
  },
};

export default meta;
