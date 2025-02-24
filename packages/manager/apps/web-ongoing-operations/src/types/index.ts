export interface TOngoingOperations {
  id: number;
  domain: string;
  function: string;
  comment?: string;
  creationDate: string;
  todoDate: string;
  lastUpdate: string;
  doneDate?: string;
  status: string;
  canCancel: boolean;
  canRelaunch: boolean;
  canAccelerate: boolean;
}

export interface TOngoingOperationsData {
  data?: TOngoingOperations[];
}

export interface TArgument {
  acceptedFormats: string[];
  acceptedValues: null;
  description: string;
  fields: string[];
  key: string;
  maximumSize: number;
  minimumSize: null;
  readOnly: boolean;
  template: string;
  type: string;
  value: string;
}
