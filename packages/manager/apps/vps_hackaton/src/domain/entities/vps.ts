export type TVpsState =
  | 'running'
  | 'stopped'
  | 'installing'
  | 'maintenance'
  | 'rebooting'
  | 'starting'
  | 'stopping'
  | 'upgrading'
  | 'migrating'
  | 'rescue'
  | 'rescued'
  | 'backuping'
  | 'error';

export type TVpsModel = {
  name: string;
  offer: string;
  version: string;
  vcore: number;
  memory: number;
  disk: number;
  maximumAdditionalIp: number;
};

export type TVpsLocation = {
  datacenter: string;
  country: string;
  continent: string;
};

export type TVpsNetwork = {
  ipV4: string;
  ipV6: string | null;
  netbootMode: 'local' | 'rescue';
  slaMonitoring: boolean;
};

export type TVpsDistribution = {
  name: string;
  id: string;
  language: string | null;
  available: boolean;
};

export type TVpsSubscription = {
  creationDate: string;
  expirationDate: string | null;
  autoRenew: boolean;
  renewPeriod: string | null;
};

export type TVps = {
  serviceName: string;
  displayName: string;
  state: TVpsState;
  model: TVpsModel;
  location: TVpsLocation;
  network: TVpsNetwork;
  distribution: TVpsDistribution;
  subscription: TVpsSubscription;
  zone: string;
  cluster: string;
  keymap: string | null;
  memoryLimit: number;
  offerType: string;
  monitoringIpBlocks: Array<string>;
};

export type TNormalizedVpsList = {
  byId: Map<string, TVps>;
  allIds: Array<string>;
};

export type TVpsList = Array<TVps>;

export type TVpsImage = {
  id: string;
  name: string;
  type: 'linux' | 'windows' | 'plesk' | 'cpanel' | 'other';
  available: boolean;
  distribution: string;
};
