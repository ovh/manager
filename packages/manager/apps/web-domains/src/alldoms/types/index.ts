import {
  ServiceInfoRenewEnum,
  ServiceInfoStatus,
  ServiceInfoType,
} from '@/alldoms/enum/service.enum';

export interface TServiceDetail {
  domainAttached: string[];
  serviceInfo: TServiceInfo;
  allDomProperty: TServiceProperty;
}

export interface TServiceInfo {
  canDeleteAtExpiration: boolean;
  contactAdmin: string;
  contactBilling: string;
  contactTech: string;
  creation: string;
  domain: string;
  engagedUpTo?: null | string;
  expiration: string;
  possibleRenewPeriod: number[];
  renew: {
    automatic: boolean;
    deleteAtExpiration: boolean;
    forced: boolean;
    manualPayment: boolean;
    period: number;
  };
  renewalType: ServiceInfoRenewEnum;
  serviceId: number;
  status: ServiceInfoStatus;
  name?: string;
}

export interface TServiceProperty {
  name: string;
  iam: {
    id: string;
    urn: string;
  };
  type: ServiceInfoType;
  offer: string;
}
