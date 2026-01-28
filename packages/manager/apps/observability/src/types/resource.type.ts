export type Resource = {
  name: string;
  type: string;
};

export type ResourceStatus =
  | 'READY'
  | 'UPDATING'
  | 'ERROR'
  | 'DELETING'
  | 'SUSPENDED'
  | 'CREATING'
  | 'UNKNOWN';
