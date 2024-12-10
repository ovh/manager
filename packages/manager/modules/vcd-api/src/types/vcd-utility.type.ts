import { IamObject } from '@ovh-ux/manager-react-components';

export type ObjectValues<T> = T[keyof T];

export type WithIam<T> = T & { iam: IamObject };

export type BillingType = 'MONTHLY' | 'DEMO';

export type ResourceStatus =
  | 'READY'
  | 'CREATING'
  | 'DISABLED'
  | 'DISABLING'
  | 'REMOVED'
  | 'UPDATING';

export type Task = {
  id: string;
  link: string;
  status: 'ERROR' | 'PENDING' | 'RUNNING' | 'SCHEDULED' | null;
  type: string;
};
