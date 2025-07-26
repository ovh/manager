import { IamObject } from '@ovh-ux/manager-react-components';

export type ObjectValues<T> = T[keyof T];

export type WithIam<T> = T & { iam: IamObject };

export type BillingType = 'MONTHLY' | 'DEMO';

type ResourceStatus = 'READY' | 'CREATING' | 'UPDATING';

export type BackupResourceStatus =
  | ResourceStatus
  | 'DISABLED'
  | 'DISABLING'
  | 'REMOVED'
  | 'REMOVING';

export type VCDResourceStatus =
  | ResourceStatus
  | 'DELETING'
  | 'ERROR'
  | 'SUSPENDED';

export type Task = {
  id: string;
  link: string;
  status: 'ERROR' | 'PENDING' | 'RUNNING' | 'SCHEDULED' | null;
  type: string;
};
