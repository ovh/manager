import { fetchIceberg, IcebergOptions } from '@/api/iceberg';
import apiClient from '@/api/client';

export enum BandwidthTypeEnum {
  IMRPOVER = 'improved',
  INCLUDED = 'included',
  PLATINIUM = 'platinum',
  PREMIUM = 'premium',
  STANDARD = 'standard',
  ULTIMATE = 'ultimate',
}

export enum BandwidthvRackTypeEnum {
  INCLUDED = 'included',
  STANDARD = 'standard',
}

export enum OlaInterfaceModeEnum {
  PUBLIC = 'public',
  VRACK = 'vrack',
}

export enum VirtualNetworkInterfaceModeEnum {
  PUBLIC = 'public',
  PUBLIC_AGGREGATION = 'public_aggregation',
  VRACK = 'vrack',
  VRACK_AGGREGATION = 'vrack_aggregation',
}

export enum DedicatedServerOptionEnum {
  BACKUPPROTOCOL = 'BACKUPPROTOCOL',
  BANDWIDTH = 'BANDWIDTH',
  BANDWIDTH_VRACK = 'BANDWIDTH_VRACK',
  OLA = 'OLA',
  SGX = 'SGX',
  TRAFFIC = 'TRAFFIC',
  TRAFFIC_DISCOVER = 'TRAFFIC_DISCOVER',
  TUNING = 'TUNING',
  TUNING_FIREWALL = 'TUNING_FIREWALL',
  TUNING_KVM = 'TUNING_KVM',
  USB_KVM_IP = 'USB_KVM_IP',
}

export enum DedicatedServerOptionStateEnum {
  RELEASED = 'released',
  SUSCRIBED = 'subscribed',
  NOT_SUBSCRIBED = 'not-subscribed',
}

export type UnitAndValue = {
  unit: string;
  value: number;
};

export type DedicatedServer = {
  commercialRange: string;
  datacenter: string;
  rack: string;
  serviceId: number;
  state: string;
};

export type DedicatedServerTask = {
  comment: string;
  doneDate: Date;
  function: string;
  lastUpdate: Date;
  needSchedule: boolean;
  note: string;
  plannedInterventionId: number;
  startDate: Date;
  status: string;
  taskId: number;
  ticketReference: string;
};

export type DedicatedServerIntervention = {
  date: Date;
  interventionId: string;
  type: string;
};

export type NetworkSpecifications = {
  bandwidth?: {
    InternetToOvh?: UnitAndValue;
    OvhToInternet?: UnitAndValue;
    OvhToOvh?: UnitAndValue;
    type?: BandwidthTypeEnum;
  };
  connection?: UnitAndValue;
  ola?: {
    available: boolean;
    availableModes: {
      default: boolean;
      interfaces: {
        aggregation: boolean;
        count: number;
        type: OlaInterfaceModeEnum;
      }[];
      name: string;
    }[];
    supportedModes: VirtualNetworkInterfaceModeEnum[];
  };
  routing: {
    ipv4?: {
      gateway?: string;
      ip?: string;
      network?: string;
    };
    ipv6?: {
      gateway?: string;
      ip?: string;
      network?: string;
    };
  };
  switching?: {
    name: string;
  };
  traffic?: {
    isThrottled?: boolean;
    resetQuotaDate?: string;
    inputQuotaSize?: UnitAndValue;
    inputQuotaUsed?: UnitAndValue;
    outputQuotaSize?: UnitAndValue;
    outputQuotaUsed?: UnitAndValue;
  };
  vmac: {
    supported: boolean;
  };
  vrack: {
    bandwidth: UnitAndValue;
    type: BandwidthvRackTypeEnum;
  };
};

export type DedicatedServerOption = {
  option: DedicatedServerOptionEnum;
  state: DedicatedServerOptionStateEnum;
};

export type DedicatedServerBandwidthvRackOrderable = {
  orderable: boolean;
  vrack: number;
};

export async function getDedicatedServer(
  serviceName: string,
  v6?: boolean,
): Promise<DedicatedServer> {
  let response;
  if (v6) {
    response = await apiClient.v6.get(`/dedicated/server/${serviceName}`);
  } else {
    response = await apiClient.aapi.get(`/sws/dedicated/server/${serviceName}`);
  }
  return response.data;
}

export async function getNetwordSpecifications(
  serviceName: string,
): Promise<NetworkSpecifications> {
  const { data } = await apiClient.v6.get(
    `/dedicated/server/${serviceName}/specifications/network`,
  );
  return data;
}

export async function getDedicatedServerOption(
  serviceName: string,
  serverOption: DedicatedServerOptionEnum,
): Promise<DedicatedServerOption> {
  const { data } = await apiClient.v6.get(
    `/dedicated/server/${serviceName}/option/${serverOption}`,
  );
  return data;
}

export async function getDedicatedServerOrderableBandwidthVrack(
  serviceName: string,
): Promise<DedicatedServerBandwidthvRackOrderable> {
  const { data } = await apiClient.v6.get(
    `/dedicated/server/${serviceName}/orderable/bandwidthvRack`,
  );
  return data;
}

export async function getDedicatedServerGetIpmiFeature(
  serviceName: string,
): Promise<{
  activated: boolean;
  supportedFeatures: {
    kvmipHtml5URL: boolean;
    kvmipJnlp: boolean;
    serialOverLanSshKey: boolean;
    serialOverLanURL: boolean;
  };
}> {
  const { data } = await apiClient.v6.get(
    `/dedicated/server/${serviceName}/features/ipmi`,
  );
  return data;
}

export async function dedicatedServerIpmiRestart(
  serviceName: string,
): Promise<DedicatedServerTask> {
  const { data } = await apiClient.v6.post(
    `/dedicated/server/${serviceName}/features/ipmi/resetInterface`,
  );
  return data;
}

export default DedicatedServer;
