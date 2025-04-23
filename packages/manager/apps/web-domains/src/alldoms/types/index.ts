import {
  DomainDnssecStatus,
  DomainRegistrationStateEnum,
  ServiceInfoRenewMode,
  ServiceInfoType,
} from '@/alldoms/enum/service.enum';

export interface TServiceDetail {
  domainAttached: TAllDomDomains;
  serviceInfo: TServiceInfo;
  allDomProperty: TServiceProperty;
  nicAdmin: string;
  nicBilling: string;
  nicTechnical: string;
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
    lifecycle: {
      current: {
        creationDate: string | null;
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
  domains?: TDomainsInfo[];
  domainAttachedChecked?: string[];
  domainTerminateList?: string[];
  serviceName?: string;
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

export interface TAllDomDomains {
  currentState: {
    domains: TDomainsInfo[];
    extensions: string[];
  };
}

export interface TDomainsInfo {
  name: string;
  registrationStatus: DomainRegistrationStateEnum;
  expiration?: string;
  extension?: string;
  mainState?: string;
  protectionState?: string;
  suspensionState?: string;
  nameServers: string[];
  isDnssecActivated: boolean;
}
