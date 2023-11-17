export type Translations = {
  common_delete: string;
  server_vrack_none: string;
  server_tab_stats_network: string;
  server_configuration_ipv4: string;
  server_configuration_gateway_ipv4: string;
  server_configuration_ipv6: string;
  server_configuration_gateway_ipv6: string;
  server_configuration_ipv4_manage: string;
  server_configuration_reverse: string;
  server_configuration_reverse_edit_button: string;
  server_configuration_reverse_not_configured: string;
  server_configuration_secondary_dns_empty: string;
  server_bandwidth: string;
  server_bandwidth_incoming: string;
  server_bandwidth_outgoing: string;
  server_bandwidth_vrack: string;
  dedicated_server_bandwidth_order_button: string;
  dedicated_server_bandwidth_vrack_order_button: string;
  server_tab_dns: string;
  server_vrack: string;
  server_ola: string;
  server_ola_active: string;
  server_ola_mode_vrack_aggregation: string;
  iplb_title: string;
  iplb_home_tile_infos_ip_outbound: string;
  unit_size_Gbps: string;
};

export type NetworkInfos = {
  ola: {
    supportedModes: string[];
    availableModes: string[];
    available: boolean;
  };
  bandwidth: {
    OvhToOvh: {
      value: number;
      unit: string;
    };
    type: string;
    OvhToInternet: {
      value: number;
      unit: string;
    };
    InternetToOvh: {
      value: number;
      unit: string;
    };
  };
  switching: {
    name: string;
  };
  routing: {
    ipv4: {
      gateway: string;
      network: string;
      ip: string;
    };
    ipv6: {
      ip: string;
      network: string;
      gateway: string;
    };
  };
  vrack: {
    bandwidth: {
      value: number;
      unit: string;
    };
    type: string;
  };
  vmac: {
    supported: boolean;
  };
  connection: {
    unit: string;
    value: number;
  };
  traffic: {
    resetQuotaDate: string | null;
    inputQuotaUsed: number | null;
    isThrottled: boolean;
    inputQuotaSize: number | null;
    outputQuotaSize: number | null;
    outputQuotaUsed: number | null;
  };
};

export type ServerDetails = {
  expiration: string;
  netbootLabel: string;
  order: string[];
  canOrder: boolean;
  canOrderBandwith: boolean;
  canOrderVrackBandwith: boolean;
  canOrderUsbDisk: boolean;
  canOrderQuota: boolean;
  canResiliateBandwidth: boolean;
  canResiliateVrackBandwidth: boolean;
  engagement: {
    endDate: string;
    endRule: {
      possibleStrategies: string[];
      strategy: string;
    };
  };
  availableProfessionalUse: boolean;
  hasProfessionalUse: boolean;
  commercialRange: string;
  isExpired: boolean;
  isCachecade: boolean;
  raidController: boolean;
  typeDisk: string;
  nbPhysicalDisk: number;
  diskSize: number;
  nbDisk: number;
  totalSize: number;
  otherDisk: any[];
  ipv6: string;
  description: string;
  state: string;
  diskGroups: {
    defaultHardwareRaidSize: number | null;
    numberOfDisks: number;
    description: string;
    raidController: number | null;
    diskGroupId: number;
    diskType: string;
    diskSize: {
      unit: string;
      value: number;
    };
    defaultHardwareRaidType: number | null;
  }[];
  ip: string;
  os: string;
  reverse: string;
  datacenter: string;
  rack: string;
  bootId: number;
  serverId: number;
  monitored: boolean;
  rootDevice: any;
  name: string;
  displayName: string;
  serviceId: number;
  canTakeRendezVous: boolean;
  shouldReengage: boolean;
  noIntervention: boolean;
  newUpgradeSystem: boolean;
};

export type VrackIpLoadbalancingInfo = {
  serviceName: string;
  displayName: string;
  id: string;
  vrackName: string;
  vrackId: string;
  creationDate: string;
  state: string;
  internalNatIp: string;
  status: string;
  vrackProjectId: string;
  port: number;
  zone: string;
  vrackPrivateVlan: number;
  vrackType: string;
  enabled: boolean;
  ipAddress: string;
  natIp: string;
};

export type IpLoadbalancingInfo = {
  serviceName: string;
  displayName: string;
  id: string;
  creationDate: string;
  natIps: string[];
  ipAddress: string;
  zone: string;
  state: string;
  vrackId: string;
  vrackName: string;
  internalNatIp: string;
  status: string;
  port: number;
  vrackProjectId: string;
  vrackPrivateVlan: number;
  vrackType: string;
  enabled: boolean;
};

export type NetworkingInfos = {
  status: string;
  description: string;
  interfaces: Array<{ macs: string[]; type: string }>;
};

export type NatIpInfos = {
  zone: string;
  ip: string[];
};

export type IpFoInfos = {
  organisationId: null | string;
  canBeTerminated: boolean;
  rir: string;
  campus: string;
  version: number;
  bringYourOwnIp: boolean;
  routedTo: {
    serviceName: string;
  };
  isAdditionalIp: boolean;
  ip: string;
  description: null | string;
  type: string;
  regions: string[];
  country: string;
};
