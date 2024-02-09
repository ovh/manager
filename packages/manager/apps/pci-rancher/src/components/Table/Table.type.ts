import { Table, Header, Row } from '@tanstack/react-table';
import { RancherService } from '../../api/api.type';

export interface RancherDatagridWrapper {
  data: RancherService[];
}

export interface RancherTable {
  table: Table<RancherService>;
}

export interface RancherCellData {
  cell?: any;
  row?: Row<RancherService>;
}

export interface RancherTableTh {
  header: Header<RancherService, unknown>;
}

export interface RancherActionsCell {
  onClickManage: (path: string) => void;
  openModal: () => void;
  row: Row<RancherService>;
  setSelectedRancher: (rancher?: RancherService) => void;
}
