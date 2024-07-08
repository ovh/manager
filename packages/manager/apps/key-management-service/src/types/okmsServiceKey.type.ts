import { ColumnSort } from '@ovhcloud/manager-components';

export type OkmsServiceKey = {
  id: string;
  createdAt: string;
  curve: string | null;
  keys: [];
  name: string;
  operations: string[];
  size: number | null;
  state: string;
  type: string;
};

export type OkmsServiceKeyOptions = {
  sorting: ColumnSort;
  okmsId: string;
};
