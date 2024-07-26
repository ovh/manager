import { IpBlock } from '@/types/IpBlock';
import { Ip } from '@/types/Ip';
import { IPPool } from '@/types/cloud/network/IPPool';

/** Subnet */
export interface Subnet {
  /** Subnet CIDR */
  cidr?: IpBlock;
  /** Is DHCP enabled for the subnet */
  dhcpEnabled?: boolean;
  /** Gateway IP in the subnet */
  gatewayIp?: Ip;
  /** Subnet id */
  id?: string;
  /** List of ip pools allocated in subnet */
  ipPools?: IPPool[];
}
