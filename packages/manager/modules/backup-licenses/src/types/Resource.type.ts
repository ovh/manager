export type ResourceStatus = 'CREATING' | 'DELETING' | 'ERROR' | 'READY' | 'SUSPENDED' | 'UPDATING';

export type Resource<T> = {
  id: string;
  resourceStatus: ResourceStatus;
  currentState: T;
};
