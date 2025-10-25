export type ResourceStatus = 'CREATING' | 'DELETING' | 'ERROR' | 'READY' | 'SUSPENDED' | 'UPDATING';

export type ResourceWithStatus = {
  resourceStatus: ResourceStatus;
};

export type ResourceWithAzName = {
  currentState: {
    azName: string;
  };
};
