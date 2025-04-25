import {
  ServiceInfoRenewEnum,
  ServiceInfoRenewMode,
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
  engagedUpTo: Date | null;
  expiration: string;
  possibleRenewPeriod: number[];
  renew: {
    automatic: boolean;
    deleteAtExpiration: boolean;
    forced: boolean;
    manualPayment: boolean | null;
    period: number | null;
  } | null;
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

export interface ModalStepsProps {
  domainAttached?: string[];
  domainAttachedChecked?: string[];
  domainTerminateList?: string[];
  serviceInfoDetail?: TServiceDetail;
  checkAllDomain?: boolean;
  changeStep: () => void;
  handleDomainAttached?: (domainSelected: string[]) => void;
  handleCheckAllDomain?: (checked: boolean) => void;
  closeModal?: () => void;
}

export interface UpdateAllDomServiceProps {
  serviceName: string;
  renew: {
    mode: ServiceInfoRenewMode;
  };
}
