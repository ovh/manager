import { PaginationState } from '@tanstack/react-table';

/* List of allowed page sizes */
export const PAGE_SIZES = [10, 25, 50, 100, 300];

export const DEFAULT_PAGINATION: PaginationState = {
  pageIndex: 0,
  pageSize: PAGE_SIZES[0],
};

export const defaultNumberOfLoadingRows = 5;

export type ColumnsVisibility = {
  id: string;
  isDisabled: boolean;
  label: string;
  enableHiding: boolean;
  isVisible: () => boolean;
  onChange: () => void;
};

export type ColumnsVisibilityProps = {
  columnsVisibility: ColumnsVisibility[];
};
