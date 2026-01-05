export enum ResourceStatus {
  CREATING = 'CREATING',
  DELETING = 'DELETING',
  ERROR = 'ERROR',
  READY = 'READY',
  SUSPENDED = 'SUSPENDED',
  UPDATING = 'UPDATING',
}

export interface PublicService {
  id: string;
  resourceStatus: ResourceStatus;
  currentState: {
    createdAt: Date;
    agoraPlanCode: string;
    videoCount: {
      max: number;
      allocated: number;
    };
    videoDurationMinutes: {
      max: number;
      allocated: number;
    };
  };
}
