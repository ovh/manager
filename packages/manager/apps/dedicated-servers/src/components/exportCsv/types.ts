import { SetStateAction, Dispatch } from 'react';
import { DatagridColumn } from '@ovh-ux/manager-react-components';
import { DedicatedServer } from '@/data/types/server.type';

export type SetStateType<T> = Dispatch<SetStateAction<T>>;

export type ExportCsvDataType = {
  columns: DatagridColumn<DedicatedServer>[];
  totalCount: number;
};
