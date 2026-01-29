export type TVpsDTO = {
  name: string;
  displayName: string;
  state: string;
  model: {
    name: string;
    offer: string;
    version: string;
    vcore: number;
    memory: number;
    disk: number;
    maximumAdditionalIp: number;
  };
  zone: string;
  cluster: string;
  netbootMode: string;
  slaMonitoring: boolean;
  keymap: string | null;
  memoryLimit: number;
  offerType: string;
  monitoringIpBlocks: Array<string>;
};

export type TVpsIpsDTO = {
  ipAddress: string;
  version: number;
  type: string;
};

export type TVpsDistributionDTO = {
  id: string;
  name: string;
  language: string | null;
  available: boolean;
};

export type TVpsServiceInfoDTO = {
  creation: string;
  expiration: string | null;
  renew: {
    automatic: boolean;
    period: string | null;
  } | null;
};

export type TVpsDatacenterDTO = {
  name: string;
  country: string;
  continent: string;
};

export type TVpsListItemDTO = string;

export type TVpsListDTO = Array<TVpsListItemDTO>;

export type TVpsImageDTO = {
  id: string;
  name: string;
  type: string;
  available: boolean;
  distribution: string;
};
