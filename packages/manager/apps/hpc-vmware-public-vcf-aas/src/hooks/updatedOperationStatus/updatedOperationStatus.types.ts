export type UpdatingInfo = {
  id: string;
  changedFields: string[];
};

export type ChangedFieldInfo = {
  id: string;
  changedField: string | null;
};

export type OperationsStatusResult = {
  updatingResources: UpdatingInfo[];
  completedResources: UpdatingInfo[];
  erroredResources: UpdatingInfo[];
};

export const UPDATING_STATUSES = ['UPDATING', 'CREATING', 'DELETING'] as const;
