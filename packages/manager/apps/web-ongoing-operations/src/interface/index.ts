export interface TOngoingOperations {
  id: string;
  domain: string;
  function: string;
  comment: string;
  creationDate: string;
  todoDate: string;
  lastUpdate: string;
  endDate: string;
  status: string;
  canCancel: boolean;
  canRelaunch: boolean;
  canAccelerate: boolean;
}
