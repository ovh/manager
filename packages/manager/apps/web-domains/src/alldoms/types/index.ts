import {
  ServiceInfoRenewMode,
  ServiceInfoType,
} from '@/alldoms/enum/service.enum';

export interface TServiceDetail {
  domainAttached: string[];
  serviceInfo: TServiceInfo;
  allDomProperty: TServiceProperty;
}

export interface TServiceInfo {
  serviceId: number;
  billing: {
    expirationDate: string | null;
    renew: {
      current: {
        mode: ServiceInfoRenewMode | null;
      };
    } | null;
  };
  customer: {
    contacts: {
      customerCode: string;
      type: string;
    }[];
  };
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
