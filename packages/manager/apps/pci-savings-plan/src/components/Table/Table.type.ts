import { Table, Header, Row, Cell } from '@tanstack/react-table';
import { SavingsPlanService } from '../../data/api/api.type';

export interface SavingsPlanDatagridWrapper {
  data: SavingsPlanService[];
  refetchSavingsPlans: () => void;
}

export interface SavingsPlanTable {
  table: Table<SavingsPlanService>;
}

export interface SavingsPlanCellData {
  cell?: Cell<SavingsPlanService, unknown>;
  row?: Row<SavingsPlanService>;
}

export interface SavingsPlanTableTh {
  header: Header<SavingsPlanService, unknown>;
}

export interface SavingsPlanActionsCell {
  onClickManage: (path: string) => void;
  onClickDelete: () => void;
  row: Row<SavingsPlanService>;
}
