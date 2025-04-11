import { LicenseEnum, UserStateEnum } from '../api.type';

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
};

export type GetOfficeLicenseServiceParams = {
  serviceName?: string;
};
