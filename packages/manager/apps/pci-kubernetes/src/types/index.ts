export type TKube = {
  id: string;
  region: string;
  name: string;
  url: string;
  attachedTo?: string;
  nodesUrl: string;
  version: string;
  nextUpgradeVersions: string[];
  kubeProxyMode: string;
  customization: TClusterCustomization;
  status: string;
  updatePolicy: string;
  isUpToDate: boolean;
  controlPlaneIsUpToDate: boolean;
  privateNetworkId: string;
  nodesSubnetId: string;
  loadBalancersSubnetId: string;
  createdAt: string;
  updatedAt: string;
  auditLogsSubscribed: boolean;
  privateNetworkConfiguration: TNetworkConfiguration;
  isClusterReady: boolean;
};

export type TAdmissionPlugin = {
  enabled: string[];
  disabled: string[];
};

export type TApiServerCustomization = {
  admissionPlugins: TAdmissionPlugin;
};

export type TClusterCustomization = {
  apiServer: TApiServerCustomization;
};

export type TNetworkConfiguration = {
  privateNetworkRoutingAsDefault: boolean;
  defaultVrackGateway: string;
};

export enum UPGRADEPOLICIES {
  NEVER_UPDATE = 'NEVER_UPDATE',
  MINIMAL_DOWTIME = 'MINIMAL_DOWTIME',
  ALWAYS_UPDATE = 'ALWAYS_UPDATE',
}
