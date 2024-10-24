export enum LicenseStatus {
  ACTIVATED = 'activated',
  TO_ACTIVATE = 'toActivate',
  PENDING = 'processing',
  ERROR = 'error',
}

export interface IamDetails {
  id: string;
  urn: string;
  serviceName?: string;
}

export interface IHycuDetails {
  controllerId: string;
  comment: string;
  expirationDate: string;
  iam: IamDetails;
  licenseStatus: LicenseStatus;
  serviceName: string;
}
export interface IHycuServiceInfo {
  canDeleteAtExpiration: false;
  contactAdmin: string;
  contactBilling: string;
  contactTech: string;
  creation: string;
  domain: string;
  engagedUpTo: string;
  expiration: string;
  possibleRenewPeriod: number[];
  renew: {
    automatic: boolean;
    deleteAtExpiration: boolean;
    forced: boolean;
    manualPayment: boolean;
    period: number;
  };
  renewalType: 'automaticForcedProduct';
  serviceId: number;
  status: 'expired';
}
