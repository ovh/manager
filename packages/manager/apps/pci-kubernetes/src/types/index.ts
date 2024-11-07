import { pluginData } from '@/api/data/plugins';

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
  customization: TClusterCustomization | null;
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
  plugins: typeof pluginData;
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

export enum UpdatePolicy {
  NeverUpdate = 'NEVER_UPDATE',
  MinimalDowntime = 'MINIMAL_DOWNTIME',
  AlwaysUpdate = 'ALWAYS_UPDATE',
}

export enum BreakPoints {
  XS = 0,
  SM = 540,
  MD = 720,
  LG = 960,
  XL = 1140,
}
