import { IamObject } from '@ovh-ux/muk';

import { ResourceStatus } from '@/types/resource.type';

export type TIdentifier = {
  id: string;
};

export type TObservabilityResource = {
  iam?: IamObject;
  createdAt: string;
  updatedAt: string | null;
} & TIdentifier;

export type ObservabilityService = {
  currentState: { displayName: string | null };
  resourceStatus: ResourceStatus;
} & TObservabilityResource;
