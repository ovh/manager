import { ReactNode } from 'react';

import { DatagridColumn } from '@ovh-ux/muk';

export type FilteredDatagridProps<T extends Record<string, unknown>> = {
  data: T[];
  columns: DatagridColumn<T>[];
  topbar?: ReactNode;
  isLoading?: boolean;
  resourceType?: string;
  searchFilterLabel: string;
};
