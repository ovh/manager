import { ColumnSort, PaginationState } from '@tanstack/react-table';
import { TWorkflowInstance } from '@/types';

export type TInstanceOptions = {
  pagination: PaginationState;
  sorting: ColumnSort;
};

export const sortResults = (
  items: TWorkflowInstance[],
  sorting: ColumnSort,
) => {
  let data: TWorkflowInstance[];
  if (sorting?.id === 'status') {
    data = [...items].sort((a, b) => (a.statusGroup > b.statusGroup ? 1 : 0));
  } else {
    data = [...items].sort((a, b) => (a[sorting?.id] > b[sorting?.id] ? 1 : 0));
  }

  if (sorting) {
    const { desc } = sorting;

    if (desc) {
      data.reverse();
    }
  }
  return data;
};
