import {
  DomainRegistrationStateEnum,
  ServiceInfoRenewMode,
  ServiceInfoType,
  ServiceInfoUpdateEnum,
} from '@/alldoms/enum/service.enum';

export interface TServiceDetail {
  domainAttached: TAllDomDomains;
  serviceInfo: TServiceInfo;
  allDomProperty: TServiceProperty;
  nicAdmin: string;
  nicBilling: string;
  nicTechnical: string;
  allDomResourceState?: ServiceInfoUpdateEnum;
}

export interface TAllDomDomains {
  currentState: {
    domains: TDomainsInfo[];
    extensions: string[];
  };
}

export interface TServiceInfo {
  serviceId: number;
  billing: {
    expirationDate: string | null;
    renew: {
      current: {
        mode: ServiceInfoRenewMode | null;
        nextDate: string;
      };
    } | null;
    lifecycle: {
      current: {
        creationDate: string | null;
      };
      capacities: {
        actions: [ServiceInfoUpdateEnum];
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

export interface TDomainsInfo {
  name: string;
  registrationStatus: DomainRegistrationStateEnum;
  expiresAt?: string;
  extension?: string;
  mainState?: string;
  protectionState?: string | null;
  suspensionState?: string | null;
  nameServers: {
    nameServer: string;
  }[];
  dnssecActivated: boolean;
}

export interface UpdateAllDomProps {
  serviceName: string;
  displayName: string;
  renew?: {
    mode?: ServiceInfoRenewMode;
    period?: number;
  };
  terminationPolicy?: string;
}

export interface ModalStepsProps {
  domainsAttached?: TDomainsInfo[];
  domainAttachedChecked?: string[];
  domainTerminateList?: string[];
  serviceName?: string;
  checkAllDomain?: boolean;
  changeStep: () => void;
  handleDomainAttached?: (domainSelected: string[]) => void;
  handleCheckAllDomain?: (checked: boolean) => void;
  closeModal?: () => void;
}
