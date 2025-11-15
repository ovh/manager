import { IamObject } from '@ovh-ux/manager-react-components';

export type BaremetalDetails = {
  iam: IamObject;
  spla: boolean;
  sslV3: boolean;
  state: string;
  version: {
    build: string;
    major: string;
    minor: string;
  };
  location: string;
  bandwidth: string;
  vScopeUrl: string;
  generation: string;
  billingType: string;
  description: string;
  serviceName: string;
  canMigrateToVCD: boolean;
  commercialRange: string;
  servicePackName: string;
  webInterfaceUrl: string;
  advancedSecurity: boolean;
  productReference: string;
  userAccessPolicy: string;
  userLogoutPolicy: string;
  userSessionTimeout: number;
  managementInterface: string;
  certifiedInterfaceUrl: string;
  userLimitConcurrentSession: number;
};
