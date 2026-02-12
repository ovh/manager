import { VisibilityState } from '@tanstack/react-table';

export type ViewType = {
  name: string;
  id: string;
  default?: boolean;
  columnVisibility?: VisibilityState;
  columnOrder?: string[];
  groupBy?: Categories;
};

export type Categories = 'commercialRange' | 'rack' | 'region' | 'datacenter';
