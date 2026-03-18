import { VisibilityState } from '@tanstack/react-table';
import { DedicatedServer } from '@/data/types/server.type';

export type ViewType = {
  name: string;
  id: string;
  default?: boolean;
  columnVisibility?: VisibilityState;
  columnOrder?: string[];
  groupBy?: Categories;
};

export type Categories = 'commercialRange' | 'rack' | 'region' | 'datacenter';

export interface GroupRow {
  id: string;
  displayName: string;
  subRows: DedicatedServer[];
  [key: string]: any;
}
