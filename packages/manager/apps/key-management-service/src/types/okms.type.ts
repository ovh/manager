import { ColumnSort } from '@ovhcloud/manager-components';

export type OKMS = {
  id: string;
  region: string;
  kmipEndpoint: string;
  restEndpoint: string;
  swaggerEndpoint: string;
  iam: IAM;
};

export type IAM = {
  displayName: string;
  id: string;
  urn: string;
};

export type OKMSOptions = {
  sorting: ColumnSort;
};
