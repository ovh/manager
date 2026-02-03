import { SetStateAction, Dispatch } from 'react';
import { DatagridColumn } from '@ovh-ux/muk';
import { DedicatedServer } from '@/data/types/server.type';

export type SetStateType<T> = Dispatch<SetStateAction<T>>;

export type ExportCsvDataType = {
  columns: DatagridColumn<DedicatedServer>[];
  totalCount: number;
};
