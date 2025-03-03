import { PaginationState } from '@ovh-ux/manager-react-components';
import { ColumnSort } from '@tanstack/react-table';

export const paginateResults = <T>(
  items: T[],
  pagination: PaginationState,
) => ({
  rows: items.slice(
    pagination.pageIndex * pagination.pageSize,
    (pagination.pageIndex + 1) * pagination.pageSize,
  ),
  pageCount: Math.ceil(items.length / pagination.pageSize),
  totalRows: items.length,
});

export const compareFunction = <T>(key: keyof T) => (a: T, b: T) => {
  const aValue = a[key] ?? '';
  const bValue = b[key] ?? '';

  if (typeof aValue === 'number' && typeof bValue === 'number') {
    return aValue - bValue;
  }

  return aValue.toString().localeCompare(bValue.toString());
};

export const sortResults = <T>(items: T[], sorting: ColumnSort): T[] => {
  const data = [...items];

  if (sorting) {
    const { id: sortKey, desc } = sorting;
    data.sort(compareFunction<T>(sortKey as keyof T));

    if (desc) {
      data.reverse();
    }
  }

  return data;
};

export const isJson = (str: string) => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

export type TParam<T> = {
  fn: () => Promise<T>;
  ruleFn: (value: T) => boolean;
  maxTries?: number;
  interval?: number;
  onSuccess?: ({ value, iteration }: { value: T; iteration: number }) => void;
  onFail?: (iteration: number, cause: Error) => void;
};

export const poll = async <T>(param: TParam<T>, iteration = 0) => {
  const maxTries = param.maxTries ?? 10;
  const interval = param.interval ?? 5000;

  if (iteration < maxTries) {
    const value: T = await param.fn();
    try {
      if (param.ruleFn(value)) {
        param?.onSuccess({ value, iteration });
      } else {
        setTimeout(() => poll(param, iteration + 1), interval);
      }
    } catch (e) {
      param?.onFail(iteration, e);
    }
  } else {
    param?.onFail(iteration, null);
  }
};
