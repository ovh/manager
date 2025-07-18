import {
  DomainRegistrationStateEnum,
  ServiceInfoRenewMode,
  ServiceInfoType,
  ServiceInfoUpdateEnum,
  LifecycleCapacitiesEnum,
} from '@/alldoms/enum/service.enum';

export interface TAllDomDomains {
  currentState: {
    name: string;
    type: ServiceInfoType;
    domains: TDomainsInfo[];
    extensions: string[];
  };
}

export interface TServiceInfo {
  serviceId: number;
  billing: {
    expirationDate: string | null;
    renew?: {
      current: {
        mode: ServiceInfoRenewMode | null;
        nextDate: string;
      };
    } | null;
    lifecycle?: {
      current: {
        creationDate: string | null;
        pendingActions: LifecycleCapacitiesEnum[];
      };
      capacities: {
        actions: LifecycleCapacitiesEnum[];
      };
    } | null;
  };
  customer?: {
    contacts: {
      customerCode: string;
      type: string;
    }[];
  };
  resource: {
    name: string;
  };
}

export interface AlldomService {
  currentState: {
    name: string;
    type: ServiceInfoType;
    domains: TDomainsInfo[];
    extensions: string[];
  };
  nicAdmin: string;
  nicBilling: string;
  nicTechnical: string;
  lifecycleCapacities: LifecycleCapacitiesEnum[];
  renewMode: ServiceInfoRenewMode | null;
  expirationDate: string;
  creationDate: string;
  renewalDate: string;
  serviceId: number;
}

export interface TDomainsInfo {
  name: string;
  registrationStatus: DomainRegistrationStateEnum;
  expiresAt?: string;
  extension?: string;
}

export interface ModalStepsProps {
  services?: TServiceInfo[];
  domainsChecked?: string[];
  domainTerminateList?: string[];
  serviceName?: string;
  checkAllDomains?: boolean;
  setIsStepOne: (changeStep: boolean) => void;
  setDomainsChecked?: (domainSelected: string[]) => void;
  setCheckAllDomains?: (checked: boolean) => void;
  closeModal?: () => void;
}
