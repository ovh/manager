import {
  DomainRegistrationStateEnum,
  ServiceInfoType,
  LifecycleCapacitiesEnum,
  ServiceInfoUpdateEnum,
} from '@/alldoms/enum/service.enum';
import { ServiceInfoRenewModeEnum } from '@/common/enum/common.enum';

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
        mode: ServiceInfoRenewModeEnum | null;
        nextDate: string;
      };
    } | null;
    lifecycle?: {
      current: {
        creationDate: string | null;
        pendingActions: LifecycleCapacitiesEnum[];
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
  pendingActions: LifecycleCapacitiesEnum[];
  renewMode: ServiceInfoRenewModeEnum | null;
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

export interface UpdateAllDomProps {
  serviceName: string;
  displayName: string;
  renew?: {
    mode?: ServiceInfoRenewModeEnum;
    period?: number;
  };
  terminationPolicy?: ServiceInfoUpdateEnum;
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

export interface DomainBillingInformation {
  list: {
    results: [
      {
        renew: {
          deleteAtExpiration: boolean;
          forced: boolean;
        };
      },
    ];
  };
}
