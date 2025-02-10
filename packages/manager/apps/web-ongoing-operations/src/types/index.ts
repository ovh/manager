export interface TOngoingOperations {
  id: number;
  domain: string;
  zone: string;
  function: string;
  comment?: string;
  creationDate: string;
  todoDate: string;
  lastUpdate: string;
  endDate?: string;
  doneDate: string;
  status: string;
  canCancel: boolean;
  canRelaunch: boolean;
  canAccelerate: boolean;
}

export interface TOngoingOperationsData {
  data?: TOngoingOperations[];
}
