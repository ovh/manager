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
}

export type UnitAndValue = {
  unit: string;
  value: number;
};

export type DedicatedServer = {
  datacenter: string;
  rack: string;
  serviceId: number;
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
): Promise<DedicatedServer> {
  const response = await fetch(
    `/engine/2api/sws/dedicated/server/${serviceName}`,
  );
  return response.json();
}

export async function getNetwordSpecifications(
  serviceName: string,
): Promise<NetworkSpecifications> {
  const response = await fetch(
    `/engine/apiv6/dedicated/server/${serviceName}/specifications/network`,
  );
  return response.json();
}

export async function getDedicatedServerOption(
  serviceName: string,
  serverOption: DedicatedServerOptionEnum,
): Promise<DedicatedServerOption> {
  const response = await fetch(
    `/engine/apiv6/dedicated/server/${serviceName}/option/${serverOption}`,
  );
  return response.json();
}

export async function getDedicatedServerOrderableBandwidthVrack(
  serviceName: string,
): Promise<DedicatedServerBandwidthvRackOrderable> {
  const response = await fetch(
    `/engine/apiv6/dedicated/server/${serviceName}/orderable/bandwidthvRack`,
  );
  return response.json();
}

export default DedicatedServer;
