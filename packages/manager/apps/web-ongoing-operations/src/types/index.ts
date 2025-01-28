export interface TOngoingOperations {
  id: number;
  domain: string;
  function: string;
  comment?: string;
  creationDate: string;
  todoDate: string;
  lastUpdate: string;
  endDate?: string;
  status: string;
  canCancel: boolean;
  canRelaunch: boolean;
  canAccelerate: boolean;
}

export interface TOngoingOperationsData {
  data?: TOngoingOperations[];
}
