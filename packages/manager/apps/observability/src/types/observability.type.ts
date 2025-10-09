import { IamObject } from '@ovh-ux/manager-react-components';

type TObservability = {
  id: string;
  iam?: IamObject;
};

export type Tenant = { currentState: { title: string } } & TObservability;
export type ObservabilityService = {
  currentState: { displayName: string | null };
} & TObservability;
