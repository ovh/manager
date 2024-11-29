import React, { useState } from 'react';
import { ColumnSort } from '@tanstack/react-table';
import { ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import { withRouter } from 'storybook-addon-react-router-v6';
<<<<<<< HEAD
=======
import { applyFilters, FilterCategories } from '@ovh-ux/manager-core-api';
>>>>>>> 2f9eca4b15 (feat(generator): update v6 listing filter)
import { useSearchParams } from 'react-router-dom';
import DataGridTextCell from './text-cell.component';
import { Datagrid } from './datagrid.component';
import { useColumnFilters } from '../filters';
<<<<<<< HEAD
import { columsTmp, columsFilters } from './datagrid.stories';
import { ActionMenu } from '../navigation';
=======
>>>>>>> 2f9eca4b15 (feat(generator): update v6 listing filter)

interface Item {
  label: string;
  price: number;
  actions: React.ReactElement;
}

<<<<<<< HEAD
const DatagridStory = (args) => {
=======
const columsTmp = [
  {
    id: 'label',
    cell: (item: Item) => {
      return <DataGridTextCell>{item.label}</DataGridTextCell>;
    },
    label: 'Label',
  },
  {
    id: 'price',
    cell: (item: Item) => {
      return <DataGridTextCell>{item.price} €</DataGridTextCell>;
    },
    label: 'Price',
  },
];

const columsFilters = [
  {
    id: 'label',
    cell: (item: Item) => {
      return <DataGridTextCell>{item.label}</DataGridTextCell>;
    },
    label: 'Label',
    comparator: FilterCategories.String,
  },
  {
    id: 'price',
    cell: (item: Item) => {
      return <DataGridTextCell>{item.price} €</DataGridTextCell>;
    },
    label: 'Price',
    comparator: FilterCategories.String,
  },
];

const DatagridStory = ({
  items,
  isSortable,
  columns = columsTmp,
}: {
  items: Item[];
  isSortable: boolean;
  columns?: any;
}) => {
>>>>>>> 2f9eca4b15 (feat(generator): update v6 listing filter)
  const [sorting, setSorting] = useState<ColumnSort>();
  const [data, setData] = useState(args.items);
  const [searchParams] = useSearchParams();
  const { filters, addFilter, removeFilter } = useColumnFilters();

  const fetchNextPage = () => {
    const itemsIndex = data?.length;
    const tmp = [...Array(10).keys()].map((_, i) => ({
      label: `Item #${i + itemsIndex}`,
      price: Math.floor(1 + Math.random() * 100),
    }));
    setData((previousParams: any) => [...previousParams, ...tmp]);
  };

  return (
    <>
      {`${searchParams}` && (
        <>
          <pre>Search params: ?{`${searchParams}`}</pre>
          <hr />
        </>
      )}
      <Datagrid
        items={data}
        columns={args.columns}
        hasNextPage={data?.length > 0 && data.length < 30}
        onFetchNextPage={fetchNextPage}
        totalItems={data?.length}
        filters={{ filters, add: addFilter, remove: removeFilter }}
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
  columns: columsTmp,
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
  columns: columsTmp,
  items: [],
};

export const Sortable = DatagridStory.bind({});

Sortable.args = {
  columns: columsTmp,
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
  columns: [...columsTmp, actionsColumns],
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

export const Filters = {
  args: {
    items: [...Array(10).keys()].map((_, i) => ({
      label: `Item #${i}`,
      price: Math.floor(1 + Math.random() * 100),
    })),
    isSortable: true,
    columns: columsFilters,
  },
};

export default {
  title: 'Components/Datagrid Cursor',
  component: Datagrid,
  decorators: [withRouter],
};
