import { IamObject } from '@ovh-ux/manager-react-components';

export type ObjectValues<T> = T[keyof T];

export type WithIam<T> = T & { iam: IamObject };

export type BillingType = 'MONTHLY' | 'DEMO';

export type Handler<T = unknown> = {
  url: string;
  response?: T;
  headers?: HeadersInit;
  statusText?: string;
  type?: ResponseType;
  responseText?: string;
  delay?: number;
  method?:
    | 'get'
    | 'post'
    | 'put'
    | 'delete'
    | 'all'
    | 'head'
    | 'options'
    | 'patch';
  status?: number;
  api?: 'v2' | 'v6' | 'aapi' | 'ws';
  baseUrl?: string;
  disabled?: boolean;
  once?: boolean;
};

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
