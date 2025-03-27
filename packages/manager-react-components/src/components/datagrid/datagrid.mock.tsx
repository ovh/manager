import { FilterCategories } from '@ovh-ux/manager-core-api';
import { DataGridTextCell } from './text-cell.component';

export interface Item {
  label: string;
  price: number;
  status: string;
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

export const columnsFilters = [
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
];
