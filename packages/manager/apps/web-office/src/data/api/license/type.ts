import { LicenseEnum, UserStateEnum } from '../ApiType';

export type LicenseType = {
  address: string;
  city: string;
  creationDate: string;
  displayName: string;
  firstName: string;
  lastName: string;
  phone: string;
  serviceName: string;
  tenantServiceName: string;
  serviceType: string;
  status: UserStateEnum;
  zipCode: string;
  iam: {
    id: string;
    urn: string;
  };
  [key: string]: string | number | boolean | { id: string; urn: string };
};

export type LicensePrepaidType = {
  activationEmail: string;
  firstName: string;
  isVirtual: boolean;
  lastName: string;
  licences: LicenseEnum[];
  serviceName: string;
  status: UserStateEnum;
  taskPendingId: number;
  tenantServiceName: string;
  usageLocation: string;
  iam: {
    id: string;
    urn: string;
  };
  [key: string]: string | number | boolean | LicenseEnum[] | { id: string; urn: string };
};

export type GetOfficeLicenseServiceParams = {
  serviceName?: string;
};

export type OfficeServiceListType = {
  displayName: string;
  extraParams: string[];
  serviceName: string;
  stateParams: string[];
  url: string;
  address: string;
  city: string;
  creationDate: string;
  firstName: string;
  lastName: string;
  phone: string;
  serviceType: string;
  status: UserStateEnum;
  tenantServiceName: string;
  zipCode: string;
};
