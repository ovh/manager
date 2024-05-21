import { Table, Header, Row, Cell } from '@tanstack/react-table';
import { RancherService } from '../../api/api.type';

export interface RancherDatagridWrapper {
  data: RancherService[];
  refetchRanchers: () => void;
}

export interface RancherTable {
  table: Table<RancherService>;
}

export interface RancherCellData {
  cell?: Cell<RancherService, unknown>;
  row?: Row<RancherService>;
}

export interface RancherTableTh {
  header: Header<RancherService, unknown>;
}

export interface RancherActionsCell {
  onClickManage: (path: string) => void;
  onClickDelete: () => void;
  row: Row<RancherService>;
}
