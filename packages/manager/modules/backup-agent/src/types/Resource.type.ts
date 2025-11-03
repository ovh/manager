export type ResourceStatus = 'CREATING' | 'DELETING' | 'ERROR' | 'READY' | 'SUSPENDED' | 'UPDATING';

export type ResourceWithStatus = {
  resourceStatus: ResourceStatus;
};

export type ResourceWithAzName = {
  currentState: {
    azName: string;
  };
};

export type ResourceWithName = {
  currentState: {
    name: string;
  };
};

export type TaskStatus = 'ERROR' | 'PENDING' | 'RUNNING' | 'SCHEDULED' | 'WAITING_USER_INPUT';

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

export type Resource<T extends { name: string }> = ResourceWithStatus &
  ResourceWithName & {
    createdAt: string;
    currentState: T;
    currentTasks: CurrentTask[];
    iam: IamResource | null;
    id: string;
    resourceStatus: ResourceStatus;
    targetSpec: Pick<T, 'name'>;
    updatedAt: string;
  };
