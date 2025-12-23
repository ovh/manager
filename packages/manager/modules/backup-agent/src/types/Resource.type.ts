export type ResourceStatus = 'CREATING' | 'DELETING' | 'ERROR' | 'READY' | 'SUSPENDED' | 'UPDATING';

export type TaskStatus = 'ERROR' | 'PENDING' | 'RUNNING' | 'SCHEDULED' | 'WAITING_USER_INPUT';

export type AlternativeStatus = 'DISABLED' | 'ENABLED' | 'NOT_CONFIGURED' | 'NOT_INSTALLED';

export interface CurrentTask {
  id: string;
  link: string;
  status: TaskStatus | null;
  type: string;
}

export interface IamResource {
  displayName: string | null;
  id: string;
  tags?: Record<string, string> | null;
  urn: string;
}

export type Resource<T extends { name: string }> = {
  createdAt: string;
  currentState: T;
  currentTasks: CurrentTask[];
  iam: IamResource | null;
  id: string;
  resourceStatus: ResourceStatus;
  status?: AlternativeStatus; // ex: for agent status
  targetSpec: Pick<T, 'name'>;
  updatedAt: string;
};
