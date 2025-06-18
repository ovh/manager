import { ColumnSort } from '@ovh-ux/manager-react-components';

export type OKMS = {
  id: string;
  region: string;
  kmipEndpoint: string;
  kmipRsaEndpoint?: string;
  restEndpoint: string;
  swaggerEndpoint: string;
  serviceKeyCount: number;
  kmipObjectCount: number;
  iam: IAM;
};

export type OkmsPublicCa = {
  publicCA: string;
  publicRsaCA: string;
};

export type IAM = {
  displayName: string;
  id: string;
  urn: string;
  tags?: Record<string, string>;
};

export type OKMSOptions = {
  sorting: ColumnSort;
};
