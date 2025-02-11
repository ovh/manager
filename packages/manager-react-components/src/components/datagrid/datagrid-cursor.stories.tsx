import React, { useState, useMemo } from 'react';
import { ColumnSort } from '@tanstack/react-table';
import { OdsDivider, OdsButton } from '@ovhcloud/ods-components/react';
import { ODS_BUTTON_VARIANT, ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { FilterComparator, applyFilters } from '@ovh-ux/manager-core-api';
import { withRouter } from 'storybook-addon-react-router-v6';
import { useSearchParams } from 'react-router-dom';
import { Datagrid } from './datagrid.component';
import { useColumnFilters } from '../filters';
import {
  columns,
  columnsFilters,
  columnsSearchAndFilters,
} from './datagrid.mock';
import { ActionMenu } from '../navigation';

interface Item {
  label: string;
  price: number;
  actions: React.ReactElement;
}

const DatagridStory = (args) => {
  const [sorting, setSorting] = useState<ColumnSort>();
  const [data, setData] = useState(args.items);
  const [searchParams] = useSearchParams();
  const { filters, addFilter, removeFilter } = useColumnFilters();
  const [searchInput, setSearchInput] = useState('');

  const fetchNextPage = () => {
    const itemsIndex = data?.length;
    const tmp = [...Array(10).keys()].map((_, i) => ({
      label: `Item #${i + itemsIndex}`,
      price: Math.floor(1 + Math.random() * 100),
    }));
    setData((previousParams: any) => [...previousParams, ...tmp]);
  };

  const columnSearchable = useMemo(
    () =>
      args?.columns?.find((item) =>
        Object.prototype.hasOwnProperty.call(item, 'isSearchable'),
      ),
    [columns],
  );

  const onSearch = (search: string) => {
    if (columnSearchable) {
      const tmp = applyFilters(
        args.items,
        !search || search.length === 0
          ? filters
          : [
              {
                key: columnSearchable.id,
                value: searchInput,
                comparator: FilterComparator.Includes,
              },
              ...filters,
            ],
      );
      setData(tmp);
    }
  };

  return (
    <>
      {`${searchParams}` && (
        <>
          <pre>Search params: ?{`${searchParams}`}</pre>
          <OdsDivider />
        </>
      )}
      <Datagrid
        items={applyFilters(data, filters)}
        columns={args.columns}
        hasNextPage={data?.length > 0 && data.length < 30}
        onFetchNextPage={fetchNextPage}
        totalItems={data?.length}
        filters={{ filters, add: addFilter, remove: removeFilter }}
        topbar={args.topbar}
        {...(args.search
          ? {
              search: {
                searchInput,
                setSearchInput,
                onSearch,
              },
            }
          : {})}
        {...(args.isSortable
          ? {
              sorting,
              onSortChange: setSorting,
              manualSorting: false,
            }
          : {})}
      />
    </>
  );
};

export const Basic = DatagridStory.bind({});

Basic.args = {
  columns,
  items: [...Array(10).keys()].map((_, i) => ({
    label: `Item #${i}`,
    price: Math.floor(1 + Math.random() * 100),
  })),
  totalItems: 20,
  isSortable: false,
  onFetchNextPage: true,
};

export const Empty = DatagridStory.bind({});

Empty.args = {
  columns,
  items: [],
};

export const Sortable = DatagridStory.bind({});

Sortable.args = {
  columns,
  items: [...Array(10).keys()].map((_, i) => ({
    label: `Item #${i}`,
    price: Math.floor(1 + Math.random() * 100),
  })),
  isSortable: true,
};

const actionsColumns = {
  id: 'actions',
  cell: (item: Item) => {
    return item.actions;
  },
  label: '',
};

export const WithActions = DatagridStory.bind({});

WithActions.args = {
  columns: [...columns, actionsColumns],
  items: [...Array(8).keys()].map((_, i) => {
    return {
      label: `Service #${i}`,
      price: Math.floor(1 + Math.random() * 100),
      actions: (
        <div className="flex items-center justify-center">
          <div>
            <ActionMenu
              isCompact={true}
              variant={ODS_BUTTON_VARIANT.ghost}
              id={i.toString()}
              items={[
                {
                  id: 1,
                  target: '_blank',
                  label: 'Action 1',
                  urn: 'urn:v9:eu:resource:manatestkds-fdsfsd',
                  iamActions: ['vrackServices:apiovh:iam/resource/update'],
                },
                {
                  id: 2,
                  target: '_blank',
                  label: 'Action 2',
                  urn: 'urn:v9:eu:resource:manate',
                  iamActions: ['vrackServices:apiovh:iam/resource/delete'],
                },
              ]}
            />
          </div>
        </div>
      ),
    };
  }),
  isSortable: true,
};

export const Filters = DatagridStory.bind({});

Filters.args = {
  items: [...Array(10).keys()].map((_, i) => ({
    label: `Item #${i}`,
    price: Math.floor(1 + Math.random() * 100),
  })),
  columns: columnsFilters,
};

export const Topbar = DatagridStory.bind({});

const TopbarComponent = () => (
  <OdsButton label="Add item" icon={ODS_ICON_NAME.plus} />
);

Topbar.args = {
  items: [...Array(10).keys()].map((_, i) => ({
    label: `Item #${i}`,
    price: Math.floor(1 + Math.random() * 100),
  })),
  columns: columnsSearchAndFilters,
  search: {
    searchInput: '',
    setSearchInput: () => {},
    onSearch: () => {},
  },
  topbar: <TopbarComponent />,
};

export default {
  title: 'Components/Datagrid Cursor',
  component: Datagrid,
  decorators: [withRouter],
};
