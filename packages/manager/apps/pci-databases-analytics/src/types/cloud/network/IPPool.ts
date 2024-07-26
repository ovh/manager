import { Ip } from '@/types/Ip';
import { IpBlock } from '@/types/IpBlock';

/** IPPool */
export interface IPPool {
  /** Enable DHCP */
  dhcp?: boolean;
  /** Last IP for this region (eg: 192.168.1.24) */
  end?: Ip;
  /** Global network with cidr (eg: 192.168.1.0/24) */
  network?: IpBlock;
  /** Region where this subnet will be created */
  region?: string;
  /** First IP for this region (eg: 192.168.1.12) */
  start?: Ip;
}
