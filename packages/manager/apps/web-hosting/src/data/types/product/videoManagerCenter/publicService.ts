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
    offerName: string;
    vodCount: {
      hostable: number;
      allocated: number;
    };
    vodDurationMinutes: {
      hostable: number;
      allocated: number;
    };
  };
}

export interface AuthToken {
  token: string;
}

export type tokenPayload = {
  language: string;
};
