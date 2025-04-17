import { ServiceInfoType } from '@/alldoms/enum/service.enum';

export interface TServiceDetail {
  domainAttached: string[];
  serviceInfo: TServiceInfo;
  allDomProperty: TServiceProperty;
}

export interface TServiceInfo {
  serviceId: number;
  billing: {
    expirationDate: string;
    renew: {
      current: {
        mode: string;
      };
    };
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
