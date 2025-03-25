import {
  ServiceInfoRenewEnum,
  ServiceInfoStatus,
} from '@/alldoms/enum/service.enum';

export interface TServiceInfo {
  canDeleteAtExpiration: boolean;
  contactAdmin: string;
  contactBilling: string;
  contactTech: string;
  creation: Date;
  domain: string;
  engagedUpTo: Date;
  expiration: Date;
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
}
