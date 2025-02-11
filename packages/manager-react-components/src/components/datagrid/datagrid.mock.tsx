import { FilterCategories } from '@ovh-ux/manager-core-api';
import { DataGridTextCell } from './text-cell.component';

export interface Item {
  label: string;
  price: number;
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

export const columnsSearchAndFilters = [
  {
    id: 'label',
    cell: (item: Item) => {
      return <DataGridTextCell>{item.label}</DataGridTextCell>;
    },
    label: 'Label',
    isFilterable: true,
    isSearchable: true,
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
    comparator: FilterCategories.String,
  },
];
