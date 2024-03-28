/** Network */
export interface Network {
  /** Network id */
  id: string;
  /** Network name */
  name: string;
  /** Details about private network in region */
  regions: NetworkRegion[];
  /** Network status */
  status: NetworkStatusEnum;
  /** Network type */
  type?: NetworkTypeEnum;
  /** Network VLAN id */
  vlanId: number;
}
/** NetworkRegion */
export interface NetworkRegion {
  /** Network id on openstack region */
  openstackId?: string;
  /** Network region */
  region: string;
  /** Network region status */
  status: NetworkRegionStatusEnum;
}
/** NetworkRegionStatusEnum */
export enum NetworkRegionStatusEnum {
  'ACTIVE' = 'ACTIVE',
  'BUILDING' = 'BUILDING',
}
/** NetworkStatusEnum */
export enum NetworkStatusEnum {
  'ACTIVE' = 'ACTIVE',
  'BUILDING' = 'BUILDING',
  'DELETING' = 'DELETING',
}
/** NetworkTypeEnum */
export enum NetworkTypeEnum {
  'private' = 'private',
  'public' = 'public',
}

/** Subnet */
export interface Subnet {
  /** Subnet CIDR */
  cidr: string;
  /** Is DHCP enabled for the subnet */
  dhcpEnabled: boolean;
  /** Gateway IP in the subnet */
  gatewayIp?: string;
  /** Subnet id */
  id: string;
  /** List of ip pools allocated in subnet */
  ipPools: IPPool[];
}

/** IPPool */
export interface IPPool {
  /** Enable DHCP */
  dhcp: boolean;
  /** Last IP for this region (eg: 192.168.1.24) */
  end: string;
  /** Global network with cidr (eg: 192.168.1.0/24) */
  network: string;
  /** Region where this subnet will be created */
  region: string;
  /** First IP for this region (eg: 192.168.1.12) */
  start: string;
}

/* Vrack */
export interface Vrack {
  /** Description of your vRack */
  description: string;
  /** Name of your vRack */
  id: string;
  /** Vrack ID */
  name: string;
}
