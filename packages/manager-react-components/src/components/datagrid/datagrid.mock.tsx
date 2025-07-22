import { FilterCategories } from '@ovh-ux/manager-core-api';
import { ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import { DataGridTextCell } from './text-cell.component';
import { ActionMenu } from '../action-menu';
import { DatagridColumn, DatagridColumnTypes } from './datagrid.component';
import { IamObject } from '../../hooks';

export interface Item {
  label: string;
  price: number;
  status: string;
  anotherStatus: string;
  iam: IamObject;
}

export const columns = [
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

export const columnsFilters: DatagridColumn<unknown>[] = [
  {
    id: 'label',
    cell: (item: Item) => {
      return <DataGridTextCell>{item.label}</DataGridTextCell>;
    },
    label: 'Label',
    isFilterable: true,
    comparator: FilterCategories.String,
  },
  {
    id: 'price',
    cell: (item: Item) => {
      return <DataGridTextCell>{item.price} €</DataGridTextCell>;
    },
    label: 'Price',
    isFilterable: true,
    comparator: FilterCategories.String,
  },
];

export const columnsFiltersWithTags: DatagridColumn<unknown>[] = [
  {
    id: 'label',
    cell: (item: Item) => {
      return <DataGridTextCell>{item.label}</DataGridTextCell>;
    },
    label: 'Label',
    isFilterable: true,
    comparator: FilterCategories.String,
  },
  {
    id: 'price',
    cell: (item: Item) => {
      return <DataGridTextCell>{item.price} €</DataGridTextCell>;
    },
    label: 'Price',
    isFilterable: true,
    comparator: FilterCategories.String,
  },
  {
    id: 'Tags',
    cell: (item: Item) => {
      return (
        <DataGridTextCell>{JSON.stringify(item.iam?.tags)}</DataGridTextCell>
      );
    },
    label: 'Tags',
    isFilterable: true,
    type: DatagridColumnTypes.Tags,
  },
];

export const columnsVisibility = [
  {
    id: 'label',
    cell: (item: Item) => {
      return <DataGridTextCell>{item.label}</DataGridTextCell>;
    },
    label: 'Label',
    enableHiding: false,
  },
  {
    id: 'price',
    cell: (item: Item) => {
      return <DataGridTextCell>{item.price} €</DataGridTextCell>;
    },
    label: 'Price',
    enableHiding: true,
  },
  {
    id: 'actions',
    cell: (item: Item) => {
      return (
        <div className="flex items-center justify-center">
          <ActionMenu
            id={item.label.replace(/Item #/g, '')}
            items={[
              {
                id: 1,
                onClick: () => console.log(`Action on ${item.label}`),
                label: `Action on ${item.label}`,
              },
            ]}
            variant={ODS_BUTTON_VARIANT.ghost}
            isCompact
          />
        </div>
      );
    },
    label: '',
    enableHiding: false,
  },
];

export const columnsSearchAndFilters = [
  {
    id: 'label',
    cell: (item: Item) => {
      return <DataGridTextCell>{item.label}</DataGridTextCell>;
    },
    label: 'Label',
    isFilterable: true,
    isSearchable: true,
    enableHiding: true,
    comparator: FilterCategories.String,
  },
  {
    id: 'price',
    cell: (item: Item) => {
      return <DataGridTextCell>{item.price} €</DataGridTextCell>;
    },
    label: 'Price',
    isFilterable: true,
    isSearchable: true,
    enableHiding: true,
    comparator: FilterCategories.String,
  },
  {
    id: 'status',
    cell: (item: Item) => {
      return <DataGridTextCell>{item.status}</DataGridTextCell>;
    },
    label: 'Status',
    isFilterable: true,
    comparator: FilterCategories.Options,
    filterOptions: [
      { label: 'Status #0', value: 'Status #0' },
      { label: 'Status #1', value: 'Status #1' },
    ],
  },
  {
    id: 'anotherStatus',
    cell: (item: Item) => {
      return <DataGridTextCell>{item.anotherStatus}</DataGridTextCell>;
    },
    label: 'anotherStatus',
    isFilterable: true,
    comparator: FilterCategories.Options,
    filterOptions: [
      {
        label: 'anotherStatus #0000000000000000000000',
        value: 'anotherStatus #0000000000000000000000',
      },
      { label: 'anotherStatus #1', value: 'anotherStatus #1' },
    ],
  },
];
