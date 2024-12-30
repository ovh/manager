export type SwsResponse<T> = {
  messages: string[];
  state: string;
  results: T[];
};

export type SwsListResponse<T> = {
  count: number;
  pagination: number[];
  list: SwsResponse<T>;
};

export type VMwareService = {
  displayName: string;
  advancedSecurity: boolean;
  bandwidth: string;
  billingType: string;
  canMigrateToVCD: boolean;
  certifiedInterfaceUrl: string;
  commercialRange: string;
  description: string;
  generation: string;
  iam: {
    displayName: string;
    id: string;
    tags: {
      'any-key': string;
    };
    urn: string;
  };
  location: string;
  managementInterface: string;
  productReference: string;
  serviceName: string;
  servicePackName: string;
  spla: boolean;
  sslV3: boolean;
  state: string;
  userAccessPolicy: string;
  userLimitConcurrentSession: number;
  userLogoutPolicy: string;
  userSessionTimeout: number;
  vScopeUrl: string;
  version: {
    build: string;
    major: string;
    minor: string;
  };
  webInterfaceUrl: string;
};

export type VMwareDatacentre = {
  commercialName: string;
  commercialRangeName: string;
  datacenterId: number;
  description: string;
  horizonViewName: string;
  isRemovable: boolean;
  name: string;
  version: string;
};

export type VMwareDatacentreCluster = {
  autoscale: {
    autoScaleInHost: string;
    autoScaleOutHost: string;
    autoScaleOutStorage: string;
    configId: number;
    id: number;
    inMaintenanceMode: false;
    state: string;
  };
  clusterId: number;
  drsMode: string;
  drsStatus: string;
  evcMode: string;
  haStatus: string;
  name: string;
  vmwareClusterId: string;
};
