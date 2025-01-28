import React, { useState } from 'react';
import { ColumnSort } from '@tanstack/react-table';
import { ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import { withRouter } from 'storybook-addon-react-router-v6';
import { Datagrid, DatagridProps } from './datagrid.component';
import { DataGridTextCell } from './text-cell.component';
import { ActionMenu } from '../navigation';

interface Item {
  label: string;
  price: number;
  actions: React.ReactElement;
}

const columns = [
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

const DatagridStory = ({
  items,
  isSortable,
  ...args
}: { isSortable?: boolean } & DatagridProps<unknown>) => {
  const [sorting, setSorting] = useState<ColumnSort>();
  const [data, setData] = useState(items);

  const fetchNextPage = () => {
    const itemsIndex = data?.length;
    const tmp = [...Array(10).keys()].map((_, i) => ({
      label: `Item #${i + itemsIndex}`,
      price: Math.floor(1 + Math.random() * 100),
    }));
    setData((previousParams: any) => [...previousParams, ...tmp]);
  };

  return (
    <Datagrid
      {...args}
      items={data}
      hasNextPage={data?.length > 0 && data.length < 30}
      onFetchNextPage={fetchNextPage}
      totalItems={data?.length}
      {...(isSortable
        ? {
            sorting,
            onSortChange: setSorting,
            manualSorting: false,
          }
        : {})}
    />
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

export default {
  title: 'Components/Datagrid Cursor',
  component: Datagrid,
  decorators: [withRouter],
};
