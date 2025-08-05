import { Dispatch, SetStateAction } from 'react';

import { ColumnSort, PaginationState } from '@tanstack/react-table';

import '@ovh-ux/manager-react-components';
import { IMe } from '@ovh-ux/manager-react-components';

declare module '@ovh-ux/manager-react-components' {
  /**
   * Patch wrong typing from MRC
   * @deprecated use @/api/hooks/user instead (MRC one doesn't have a stable ref)
   */
  export function useMe(): { me: IMe | null };
  export function useDataGrid(defaultSorting: ColumnSort = undefined): {
    pagination: PaginationState;
    setPagination: Dispatch<SetStateAction<PaginationState>>;
    sorting: ColumnSort | undefined;
    setSorting: Dispatch<SetStateAction<ColumnSort>>;
  };
}
