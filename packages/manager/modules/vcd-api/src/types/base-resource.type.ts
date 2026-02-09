export type ResourceStatus =
  | 'CREATING'
  | 'DELETING'
  | 'ERROR'
  | 'READY'
  | 'SUSPENDED'
  | 'UPDATING';

export type BaseResource<
  TState extends Record<string, unknown>,
  TSpec extends Record<string, unknown> = TState
> = {
  id: string;
  resourceStatus: ResourceStatus;
  currentState: TState;
  targetSpec: TSpec;
  currentTasks: unknown[];
};

// TODO all other types file should inherit from this type
