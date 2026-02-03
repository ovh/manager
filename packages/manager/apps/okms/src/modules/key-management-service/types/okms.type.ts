export type OKMS = {
  iam: IAM;
  id: string;
  kmipEndpoint: string;
  kmipObjectCount: number;
  kmipRsaEndpoint: string;
  region: string;
  restEndpoint: string;
  secretCount: number;
  secretVersionCount: number;
  serviceKeyCount: number;
  swaggerEndpoint: string;
};

export type OkmsPublicCa = {
  publicCA: string;
  publicRsaCA: string;
};

export type OkmsServiceState = 'EXPIRED' | 'IN_CREATION' | 'OK' | 'SUSPENDED';

export type IAM = {
  displayName: string;
  id: string;
  urn: string;
  tags?: Record<string, string>;
  state?: OkmsServiceState;
};
