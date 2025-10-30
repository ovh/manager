import { IamObject } from '@ovh-ux/manager-react-components';

export type TIdentifier = {
  id: string;
};

export type TObservabilityResource = {
  iam?: IamObject;
} & TIdentifier;

export type ObservabilityService = {
  currentState: { displayName: string | null };
} & TObservabilityResource;
